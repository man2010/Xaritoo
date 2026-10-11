import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

export type Tutor = { nom: string; domaine: string; numero: string };

export async function findTutor(domain: string): Promise<Tutor | null> {
  const { data } = await supabase
    .from("tuteurs")
    .select("nom, domaine, numero")
    .ilike("domaine", `%${domain}%`)
    .limit(1)
    .maybeSingle();
  return data;
}
