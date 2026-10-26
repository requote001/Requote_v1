import type {
  WaitlistIntent,
  WaitlistRole,
  WaitlistSubmission,
} from "./waitlist";

export const waitlistRoleOptions: {
  value: WaitlistRole;
  title: string;
  copy: string;
}[] = [
  {
    value: "requester",
    title: "Client",
    copy: "Find products, services, and people for your next project.",
  },
  {
    value: "provider",
    title: "Provider",
    copy: "Bring your products, services, and expertise to the right people.",
  },
  {
    value: "employer",
    title: "Employer",
    copy: "Connect your team with the expertise it needs to grow.",
  },
  {
    value: "employee",
    title: "Professional",
    copy: "Explore meaningful work and make your strengths visible.",
  },
  {
    value: "investor",
    title: "Investor",
    copy: "Explore conversations, partnerships, and Requote’s growth.",
  },
  {
    value: "both",
    title: "Multiple roles",
    copy: "There’s room for all the ways you work. Add more context when accounts open.",
  },
];
export const waitlistInterests: Record<WaitlistRole, string[]> = {
  requester: [
    "Business procurement",
    "Personal projects",
    "Ongoing operational needs",
    "Other",
  ],
  provider: [
    "Agriculture",
    "Fabrication & Welding",
    "Construction & Skilled Trades",
    "Digital & Technology Services",
    "Logistics & Delivery",
    "Professional Services",
    "Other",
  ],
  employer: [
    "Full-time hiring",
    "Contract or project talent",
    "Operations and field teams",
    "Specialist roles",
    "Other",
  ],
  employee: [
    "Skilled trades",
    "Digital and technology",
    "Operations and logistics",
    "Professional services",
    "Other",
  ],
  investor: [
    "Early-stage investment",
    "Strategic partnership",
    "Market and growth research",
    "Advisory and ecosystem support",
    "Other",
  ],
  both: [
    "Products and services",
    "Work and talent",
    "Partnership and investment",
    "Other",
  ],
};
export const waitlistInterestLabels: Record<WaitlistRole, string> = {
  requester: "What do you need help with?",
  provider: "What do you provide?",
  employer: "What are you hiring for?",
  employee: "Your career area",
  investor: "Your interest in Requote",
  both: "What interests you most?",
};
export type WaitlistFormValues = Pick<
  WaitlistSubmission,
  | "fullName"
  | "email"
  | "phone"
  | "city"
  | "role"
  | "profileInterest"
  | "consent"
>;
type Query = { get: (key: string) => string | null };
export function waitlistIntent(query: Query): WaitlistIntent {
  const intent = query.get("intent");
  return intent === "draft" || intent === "published" ? intent : "general";
}
export function waitlistFieldIssues(
  values: WaitlistFormValues,
): Record<string, string> {
  const issues: Record<string, string> = {};
  if (values.fullName.trim().length < 2)
    issues.fullName = "Add your full name (at least 2 characters).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    issues.email = "Enter a valid email address, like you@example.com.";
  if (!waitlistRoleOptions.some((option) => option.value === values.role))
    issues.role = "Choose how you’d like to use Requote.";
  if (!values.consent)
    issues.consent = "Please confirm we may contact you about early access.";
  return issues;
}
export function waitlistPayload(
  values: WaitlistFormValues,
  query: Query,
  website = "",
): WaitlistSubmission {
  return {
    ...values,
    fullName: values.fullName.trim(),
    email: values.email.trim().toLowerCase(),
    phone: values.phone.trim(),
    city: values.city.trim(),
    serviceCategory: values.role === "provider" ? values.profileInterest : "",
    source: (query.get("source") || "website").slice(0, 100),
    utmSource: (query.get("utm_source") || "").slice(0, 120),
    utmCampaign: (query.get("utm_campaign") || "").slice(0, 120),
    intent: waitlistIntent(query),
    website,
  };
}
type Sender = (
  url: string,
  options: RequestInit,
) => Promise<{ ok: boolean; status: number; json: () => Promise<unknown> }>;
export async function requestWaitlistJoin(
  payload: WaitlistSubmission,
  send: Sender,
  signal?: AbortSignal,
) {
  let response;
  try {
    response = await send("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
  } catch {
    throw new Error(
      "We couldn’t confirm your signup. Check your connection, then try again with the same email.",
    );
  }
  const body = await response.json().catch(() => null);
  const result =
    body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  if (!response.ok || result.success !== true) {
    throw new Error(
      typeof result.message === "string" && result.message
        ? result.message.slice(0, 300)
        : response.status === 429
          ? "A few too many attempts. Please wait a moment and try again."
          : "We couldn’t confirm your place. Please try again in a moment.",
    );
  }
}
export function rememberWaitlistJoin(
  storage: { setItem: (key: string, value: string) => void },
  role: WaitlistRole,
) {
  try {
    storage.setItem(
      "requote_waitlist",
      JSON.stringify({ role, joinedAt: new Date().toISOString() }),
    );
    return true;
  } catch {
    return false;
  } // An optional browser marker must not undo server-confirmed success.
}
