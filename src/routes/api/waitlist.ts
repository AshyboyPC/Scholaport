import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { sendWaitlistConfirmation } from "@/lib/waitlist-email.server";

const sourceRoutes = {
  "tamil-nadu": "Tamil Nadu State Board",
  "andhra-pradesh": "Andhra Pradesh State Board",
  cbse: "CBSE or another Indian board",
  "other-source": "Another country or school system",
} as const;

const destinationRoutes = {
  georgia: "Georgia",
  texas: "Texas",
  "other-us-state": "Another U.S. state",
  "other-destination": "Another country or destination",
} as const;

const requestSchema = z.object({
  email: z
    .email()
    .max(254)
    .transform((value) => value.trim().toLowerCase()),
  source: z.enum(Object.keys(sourceRoutes) as [keyof typeof sourceRoutes]),
  destination: z.enum(Object.keys(destinationRoutes) as [keyof typeof destinationRoutes]),
});

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export const Route = createFileRoute("/api/waitlist")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const contentLength = Number(request.headers.get("content-length") || 0);
        if (contentLength > 4_096) {
          return json({ message: "That request is too large." }, 413);
        }

        let parsed: z.infer<typeof requestSchema>;
        try {
          parsed = requestSchema.parse(await request.json());
        } catch {
          return json({ message: "Enter a valid email and select both routes." }, 400);
        }

        try {
          const supabase = createServerSupabaseClient(null);
          const { error } = await supabase.from("expansion_waitlist").insert({
            email: parsed.email,
            source_route: parsed.source,
            destination_route: parsed.destination,
          });

          if (error?.code === "23505") {
            return json({
              status: "already_joined",
              message: "You’re already on the expansion list. We’ll keep your route in view.",
            });
          }
          if (error) throw error;

          let emailSent = false;
          try {
            await sendWaitlistConfirmation(
              {
                email: parsed.email,
                sourceLabel: sourceRoutes[parsed.source],
                destinationLabel: destinationRoutes[parsed.destination],
              },
              new URL(request.url).origin,
            );
            emailSent = true;
          } catch (emailError) {
            console.error("waitlist confirmation email failed", {
              error: emailError instanceof Error ? emailError.message : "Unknown email error",
            });
          }

          return json({
            status: "joined",
            emailSent,
            message: emailSent
              ? "You’re on the expansion list. A confirmation is on its way."
              : "You’re on the expansion list. We saved your route request.",
          });
        } catch (error) {
          console.error("waitlist request failed", {
            error: error instanceof Error ? error.message : "Unknown waitlist error",
          });
          return json(
            { message: "We couldn’t save your request right now. Please try again." },
            503,
          );
        }
      },
    },
  },
});
