import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !serviceKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_KEY must be configured to look up tutors.");
  }

  return createClient(url, serviceKey);
}

export type Tutor = { nom: string; domaine: string; numero: string };

export async function findTutor(domain: string): Promise<Tutor | null> {
  const { data } = await getSupabaseClient()
    .from("tuteurs")
    .select("nom, domaine, numero")
    .ilike("domaine", `%${domain}%`)
    .limit(1)
    .maybeSingle();
  return data;
}
