import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/advisor")({
  server: {
    handlers: {
      POST: async () =>
        Response.json(
          {
            status: "coming_soon",
            message:
              "Scholaport AI Advisor is coming soon after the transcript, mapping, gap, roadmap, and packet workflow is ready.",
            retryable: false,
          },
          { status: 503 },
        ),
    },
  },
});
