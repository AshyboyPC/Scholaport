import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/chat/$threadId")({
  beforeLoad: () => {
    throw redirect({ to: "/app/advisor" });
  },
});
