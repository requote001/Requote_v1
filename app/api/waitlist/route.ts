import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { validateWaitlistSubmission } from "@/lib/waitlist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const privacyPolicyVersion = "2026-09-09";
const maximumBodySize = 12_000;

function json(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host");
  if (!host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return json({ success: false, message: "Request not allowed." }, 403);
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > maximumBodySize) {
    return json({ success: false, message: "Request is too large." }, 413);
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return json({ success: false, message: "Enter valid waitlist details." }, 400);
  }

  const validation = validateWaitlistSubmission(input);
  if (!validation.success) {
    return json({ success: false, message: validation.error }, 400);
  }

  // Quietly accept bot submissions caught by the honeypot.
  if (validation.data.website) {
    return json({ success: true, status: "joined" }, 200);
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return json(
      {
        success: false,
        code: "WAITLIST_NOT_CONFIGURED",
        message:
          "The waitlist is being connected. Please try again shortly.",
      },
      503,
    );
  }

  const submission = validation.data;
  const { error } = await supabase.from("waitlist_entries").upsert(
    {
      full_name: submission.fullName,
      email: submission.email,
      phone: submission.phone || null,
      role: submission.role,
      city: submission.city || null,
      service_category: submission.serviceCategory || null,
      source: submission.source,
      utm_source: submission.utmSource || null,
      utm_campaign: submission.utmCampaign || null,
      request_intent: submission.intent,
      consent_at: new Date().toISOString(),
      privacy_policy_version: privacyPolicyVersion,
    },
    { onConflict: "email" },
  );

  if (error) {
    console.error("Waitlist write failed", { code: error.code });
    return json(
      {
        success: false,
        message: "We could not save your place. Please try again.",
      },
      500,
    );
  }

  return json(
    {
      success: true,
      status: "joined",
      message: "You are on the Requote waitlist.",
    },
    200,
  );
}
