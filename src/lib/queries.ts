import { queryOptions } from "@tanstack/react-query";
import { listEvents, listPartners, listSpeakers } from "./content.functions";

export const speakersQuery = queryOptions({
  queryKey: ["speakers"],
  queryFn: () => listSpeakers(),
});

export const partnersQuery = queryOptions({
  queryKey: ["partners"],
  queryFn: () => listPartners(),
});

export const eventsQuery = queryOptions({
  queryKey: ["events"],
  queryFn: () => listEvents(),
});
