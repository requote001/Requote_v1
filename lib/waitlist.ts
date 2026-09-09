export const WAITLIST_ROLES = ["requester", "provider", "both"] as const;

export type WaitlistRole = (typeof WAITLIST_ROLES)[number];
export type WaitlistIntent = "general" | "draft" | "published";

export type WaitlistSubmission = {
  fullName: string;
  email: string;
  phone: string;
  role: WaitlistRole;
  city: string;
  serviceCategory: string;
  source: string;
  utmSource: string;
  utmCampaign: string;
  intent: WaitlistIntent;
  consent: boolean;
  website: string;
};

type ValidationResult =
  | { success: true; data: WaitlistSubmission }
  | { success: false; error: string };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanText(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

export function validateWaitlistSubmission(input: unknown): ValidationResult {
  if (!input || typeof input !== "object") {
    return { success: false, error: "Enter your waitlist details." };
  }

  const body = input as Record<string, unknown>;
  const fullName = cleanText(body.fullName, 100);
  const email = cleanText(body.email, 254).toLowerCase();
  const phone = cleanText(body.phone, 30);
  const city = cleanText(body.city, 100);
  const serviceCategory = cleanText(body.serviceCategory, 120);
  const source = cleanText(body.source, 100) || "website";
  const utmSource = cleanText(body.utmSource, 120);
  const utmCampaign = cleanText(body.utmCampaign, 120);
  const website = cleanText(body.website, 200);
  const role = cleanText(body.role, 20) as WaitlistRole;
  const intentValue = cleanText(body.intent, 20);
  const intent: WaitlistIntent = ["draft", "published"].includes(intentValue)
    ? (intentValue as WaitlistIntent)
    : "general";

  if (fullName.length < 2) {
    return { success: false, error: "Enter your full name." };
  }

  if (!emailPattern.test(email)) {
    return { success: false, error: "Enter a valid email address." };
  }

  if (!WAITLIST_ROLES.includes(role)) {
    return { success: false, error: "Choose how you plan to use Requote." };
  }

  if (body.consent !== true) {
    return {
      success: false,
      error: "Confirm that Requote may contact you about early access.",
    };
  }

  return {
    success: true,
    data: {
      fullName,
      email,
      phone,
      role,
      city,
      serviceCategory,
      source,
      utmSource,
      utmCampaign,
      intent,
      consent: true,
      website,
    },
  };
}
