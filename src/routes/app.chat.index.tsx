import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/chat/")({
  beforeLoad: () => {
    throw redirect({ to: "/app/advisor" });
  },
});
