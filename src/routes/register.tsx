import { createFileRoute } from "@tanstack/react-router";
import { ClosedTicketView } from "@/components/site/ClosedTicketView";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Registration Closed — TEDxLafia 2026" },
      {
        name: "description",
        content:
          "Registration and tickets for TEDxLafia 2026 are officially closed. Join the priority waitlist, retrieve an existing pass, or explore the digital livestream.",
      },
      { property: "og:title", content: "Registration Closed — TEDxLafia 2026" },
      {
        property: "og:description",
        content:
          "All seats for TEDxLafia 2026 have been reserved. Join the priority waitlist or stream the event live.",
      },
    ],
  }),
  component: RegisterRoute,
});

function RegisterRoute() {
  return <ClosedTicketView />;
}
