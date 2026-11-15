import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY;

  if (!url || !secretKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY must be configured to look up tutors.");
  }

  return createClient(url, secretKey);
}

export type Tutor = { nom: string; domaine: string; numero: string };

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function areasForDomain(domain: string) {
  const value = normalize(domain);
  const areas = new Set<string>();
  const add = (...labels: string[]) => labels.forEach((label) => areas.add(label));

  if (/math|algebra|geometry|calcul/.test(value)) {
    add("Math Tutoring & Support", "Comprehensive Academic Tutoring", "Other / Multiple Areas");
  }
  if (/science|biology|bio|chemistry|chemical|physics|anatomy/.test(value)) {
    add("Science (Biology, Chemistry, Physics)", "Comprehensive Academic Tutoring", "Other / Multiple Areas");
  }
  if (/english|anglais|writing|reading|essay|literature/.test(value)) {
    add("Writing, Reading & English", "Comprehensive Academic Tutoring", "Other / Multiple Areas");
  }
  if (/sat|act|test prep|exam/.test(value)) {
    add("SAT / ACT Test Preparation", "Comprehensive Academic Tutoring", "Other / Multiple Areas");
  }
  if (/scholarship|college|university|admission/.test(value)) {
    add("Scholarships & College Planning", "Comprehensive Academic Tutoring", "Other / Multiple Areas");
  }
  if (/career|resume|cv|profession/.test(value)) {
    add("Career Guidance & Resume Building", "Comprehensive Academic Tutoring", "Other / Multiple Areas");
  }
  if (/counsel|wellbeing|well being/.test(value)) {
    add("Counseling", "Other / Multiple Areas");
  }
  if (/mentor|accountability|guidance/.test(value)) {
    add("General Mentorship & Accountability", "Other / Multiple Areas");
  }
  if (areas.size === 0) areas.add(domain.trim());
  return [...areas];
}

export async function findTutor(domain: string): Promise<Tutor | null> {
  const { data, error } = await getSupabaseClient()
    .from("tutor_profiles")
    .select("display_name, support_areas, whatsapp_number")
    .eq("approval_status", "approved")
    .order("display_name", { ascending: true })
    .limit(100);

  if (error) throw error;

  const wantedAreas = areasForDomain(domain).map(normalize);
  const match = (data ?? []).find((candidate) =>
    (candidate.support_areas as string[]).some((area) => wantedAreas.includes(normalize(area))),
  );

  if (!match) return null;
  const matchingArea = (match.support_areas as string[]).find((area) => wantedAreas.includes(normalize(area)));
  return {
    nom: match.display_name,
    domaine: matchingArea || (match.support_areas as string[]).join(", "),
    numero: match.whatsapp_number,
  };
}
