import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ALLOWED_STATUSES = new Set(["pending", "approved", "rejected", "paused"]);

function reviewResult(result: "success" | "error", message: string) {
  return NextResponse.json({ ok: result === "success", message: message.slice(0, 500) }, {
    status: result === "success" ? 200 : 400,
    headers: {
      "cache-control": "no-store, max-age=0",
    },
  });
}

function formString(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    console.warn("[admin tutor status] Rejected cross-origin request", {
      origin,
      requestOrigin: new URL(request.url).origin,
    });
    return reviewResult("error", "Request rejected because the page origin could not be verified. Reload the admin workspace and try again.");
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    console.error("[admin tutor status] Could not parse submitted form data");
    return reviewResult("error", "The review request could not be read. Reload the admin workspace and try again.");
  }

  const accessToken = formString(form, "access_token");
  const tutorProfileId = formString(form, "tutor_profile_id");
  const status = formString(form, "status");
  const note = formString(form, "note").trim();
  if (!accessToken || !UUID_PATTERN.test(tutorProfileId) || !ALLOWED_STATUSES.has(status) || note.length > 1000) {
    console.warn("[admin tutor status] Invalid review form fields", {
      hasAccessToken: Boolean(accessToken),
      tutorProfileIdValid: UUID_PATTERN.test(tutorProfileId),
      requestedStatus: status,
      noteLength: note.length,
    });
    return reviewResult("error", "The submitted review request is incomplete or invalid. Reload the admin workspace and try again.");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !publishableKey) {
    console.error("[admin tutor status] Supabase server configuration is missing", {
      hasProjectUrl: Boolean(supabaseUrl),
      hasPublishableKey: Boolean(publishableKey),
    });
    return reviewResult("error", "Supabase is not configured on the server. Check the application environment variables.");
  }

  try {
    const supabase = createClient(supabaseUrl, publishableKey, {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });
    const { data: userData, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !userData.user) {
      console.error("[admin tutor status] Supabase session validation failed", {
        code: authError?.code,
        message: authError?.message,
      });
      return reviewResult("error", "Your admin session expired. Return to the admin workspace, sign out, and sign in again.");
    }

    const { error: reviewError } = await supabase.rpc("xaritoo_admin_set_tutor_status", {
      p_tutor_profile_id: tutorProfileId,
      p_status: status,
      p_note: note || null,
    });
    if (reviewError) {
      console.error("[admin tutor status] Admin RPC failed", {
        adminUserId: userData.user.id,
        tutorProfileId,
        requestedStatus: status,
        code: reviewError.code,
        message: reviewError.message,
        details: reviewError.details,
        hint: reviewError.hint,
      });
      return reviewResult("error", `Tutor status was not changed: ${reviewError.message}`);
    }

    const statusLabel = status === "approved" ? "approved" : status === "rejected" ? "rejected" : status === "paused" ? "paused" : "returned to review";
    return reviewResult("success", `Tutor application ${statusLabel}. The admin audit log has been updated.`);
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "Unexpected Supabase request failure.";
    console.error("[admin tutor status] Unexpected review request failure", {
      tutorProfileId,
      requestedStatus: status,
      message,
    });
    return reviewResult("error", `Tutor status was not changed: ${message}`);
  }
}
