import { createFileRoute } from "@tanstack/react-router";
import { ClosedTicketView } from "@/components/site/ClosedTicketView";

export const Route = createFileRoute("/tickets")({
  head: () => ({
    meta: [
      { title: "Tickets & Registration Closed — TEDxLafia 2026" },
      {
        name: "description",
        content:
          "Registration and ticket reservations for TEDxLafia 2026 are officially closed. Join our priority waitlist, retrieve an existing pass, or explore digital streaming options.",
      },
      { property: "og:title", content: "Tickets & Registration Closed — TEDxLafia 2026" },
      {
        property: "og:description",
        content:
          "All seats for TEDxLafia 2026 have been reserved. Join the priority waitlist or stream the event live.",
      },
    ],
  }),
  component: TicketsRoute,
});

function TicketsRoute() {
  return <ClosedTicketView />;
}
