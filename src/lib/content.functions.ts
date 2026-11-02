import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type Speaker = Database["public"]["Tables"]["speakers"]["Row"];
export type Partner = Database["public"]["Tables"]["partners"]["Row"];
export type EventRow = Database["public"]["Tables"]["events"]["Row"];

function publicClient() {
  const url = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) {
    return null;
  }
  return createClient<Database>(url, key, {
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
  const client = publicClient();
  if (!client) return [] as Speaker[];
  const { data, error } = await client
    .from("speakers")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error(error);
    return [] as Speaker[];
  }
  return data ?? ([] as Speaker[]);
});

export const listPartners = createServerFn({ method: "GET" }).handler(async () => {
  const client = publicClient();
  if (!client) return [] as Partner[];
  const { data, error } = await client
    .from("partners")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error(error);
    return [] as Partner[];
  }
  return data ?? ([] as Partner[]);
});

export const listEvents = createServerFn({ method: "GET" }).handler(async () => {
  const client = publicClient();
  if (!client) return [] as EventRow[];
  const { data, error } = await client
    .from("events")
    .select("*")
    .order("starts_at", { ascending: false });
  if (error) {
    console.error(error);
    return [] as EventRow[];
  }
  return data ?? ([] as EventRow[]);
});
