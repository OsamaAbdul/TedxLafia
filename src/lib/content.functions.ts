import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type Speaker = Database["public"]["Tables"]["speakers"]["Row"];
export type Partner = Database["public"]["Tables"]["partners"]["Row"];
export type EventRow = Database["public"]["Tables"]["events"]["Row"];

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const listSpeakers = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("speakers")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error(error);
    return [] as Speaker[];
  }
  return data;
});

export const listPartners = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("partners")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error(error);
    return [] as Partner[];
  }
  return data;
});

export const listEvents = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("events")
    .select("*")
    .order("starts_at", { ascending: false });
  if (error) {
    console.error(error);
    return [] as EventRow[];
  }
  return data;
});
