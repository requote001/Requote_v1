/** Browser-only profile adapters. These are NOT authentication or privacy enforcement. */
import type { SetupForm, SetupStorage } from "./account-setup";

export const PROFILE_KEY = "requote_mock_auth";
export const PROFILE_FIELDS = [
  { key: "name", label: "Display name", max: 100, required: true },
  { key: "headline", label: "Professional headline", max: 140 },
  { key: "location", label: "City and country", max: 120, required: true },
  { key: "professionalFocus", label: "What you do", max: 160, required: true },
  { key: "professionalOverview", label: "About you", max: 1200 },
  { key: "skills", label: "Skills and strengths", max: 300 },
] as const;
export type ProfileField = (typeof PROFILE_FIELDS)[number]["key"];
export type ProfileEdit = Record<ProfileField, string>;
export type PreviewProfileMember = Record<string, unknown> & {
  authenticated?: boolean;
  email?: string;
  name?: string;
  role?: string;
  roles?: string[];
  primaryRole?: string;
  headline?: string;
  location?: string;
  about?: string;
  professionalFocus?: string;
  professionalLevel?: string;
  professionalOverview?: string;
  skills?: string;
  avatarDataUrl?: string;
  profileComplete?: boolean;
  emailVerified?: boolean;
  nameVerified?: boolean;
  publicProfile?: boolean;
  isAvailable?: boolean;
};
const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
const text = (value: unknown) => typeof value === "string" ? value : "";
const owner = (value: unknown) => text(value).trim().toLowerCase();

export function readLocalProfile(storage: SetupStorage): PreviewProfileMember {
  const member = record(JSON.parse(storage.getItem(PROFILE_KEY) || "null"));
  if (member.authenticated !== true || !owner(member.email))
    throw new Error("Sign in to your preview account again before continuing.");
  for (const key of ["name", "email", "role", "primaryRole", "headline", "location", "about", "professionalFocus", "professionalLevel", "professionalOverview", "skills", "avatarDataUrl"])
    if (member[key] !== undefined && typeof member[key] !== "string")
      throw new Error("The saved preview profile could not be read. Sign in again or restore the local data.");
  if (member.roles !== undefined && (!Array.isArray(member.roles) || member.roles.some((role) => typeof role !== "string")))
    throw new Error("The saved preview roles could not be read. Your account has not been changed.");
  for (const key of ["profileComplete", "emailVerified", "nameVerified", "publicProfile", "isAvailable"])
    if (member[key] !== undefined && typeof member[key] !== "boolean")
      throw new Error("The saved preview status could not be read. Your account has not been changed.");
  return member as PreviewProfileMember;
}
export function profileEditValues(member: PreviewProfileMember): ProfileEdit {
  return Object.fromEntries(PROFILE_FIELDS.map(({ key }) => [
    key, text(key === "professionalOverview"
      ? member.professionalOverview ?? member.about : member[key]),
  ])) as ProfileEdit;
}
export function profileEditIssues(values: ProfileEdit) {
  const issues: Partial<Record<ProfileField, string>> = {};
  for (const field of PROFILE_FIELDS) {
    const value = text(values[field.key]).trim();
    if ("required" in field && field.required && !value)
      issues[field.key] = `Add your ${field.label.toLowerCase()}.`;
    else if (value.length > field.max)
      issues[field.key] = `Keep this to ${field.max} characters or fewer.`;
  }
  return issues;
}
function latestFor(storage: SetupStorage, expected: PreviewProfileMember) {
  const latest = readLocalProfile(storage);
  if (owner(latest.email) !== owner(expected.email))
    throw new Error("The preview account changed. Reload before saving.");
  return latest;
}
export function saveLocalProfile(
  storage: SetupStorage, expected: PreviewProfileMember, values: ProfileEdit,
) {
  const latest = latestFor(storage, expected);
  if (JSON.stringify(profileEditValues(latest)) !== JSON.stringify(profileEditValues(expected)))
    throw new Error("Your profile changed in another view. Close this editor and reload before saving.");
  if (Object.keys(profileEditIssues(values)).length)
    throw new Error("Review the highlighted fields before saving.");
  // Explicit allowlist: never accept roles, email, completion or verification from the editor.
  const patch = Object.fromEntries(PROFILE_FIELDS.map(({ key }) => [key, values[key].trim()]));
  const now = new Date().toISOString();
  const profileFieldEdits = { ...record(latest.profileFieldEdits) };
  for (const { key } of PROFILE_FIELDS)
    if (profileEditValues(latest)[key] !== patch[key]) profileFieldEdits[key] = now;
  const next = { ...latest, ...patch, about: patch.professionalOverview, profileFieldEdits };
  storage.setItem(PROFILE_KEY, JSON.stringify(next));
  return next as PreviewProfileMember;
}
export function saveLocalPreference(
  storage: SetupStorage, expected: PreviewProfileMember,
  key: "publicProfile" | "isAvailable", value: boolean,
) {
  if (!["publicProfile", "isAvailable"].includes(key) || typeof value !== "boolean")
    throw new Error("This preference is not supported.");
  const latest = latestFor(storage, expected);
  if ((latest[key] === true) !== (expected[key] === true))
    throw new Error("This preference changed in another view. Reload before trying again.");
  const next = { ...latest, [key]: value, profileFieldEdits: { ...record(latest.profileFieldEdits), [key]: new Date().toISOString() } };
  storage.setItem(PROFILE_KEY, JSON.stringify(next));
  return next;
}

// Deliberate public allowlist, independent of any future private account fields.
const publicRoleFields: Record<string, readonly string[]> = {
  requester: ["interests", "preferredLocation"],
  provider: ["businessType", "businessName", "services", "categories", "serviceAreas", "experience"],
  employee: ["skills", "workPreferences", "workMode", "workHistory"],
  employer: ["companyName", "industry", "companySize", "hiringNeeds", "companyOverview"],
  investor: ["sectors", "interests", "stage", "engagement"],
};
export function publicProfileView(form: SetupForm) {
  if (!form.publicProfile) return null;
  return {
    name: form.name, headline: form.headline, location: form.location,
    professionalFocus: form.professionalFocus,
    professionalLevel: form.professionalLevel,
    professionalOverview: form.professionalOverview, skills: form.skills,
    isAvailable: form.isAvailable, roles: [...form.roles], primaryRole: form.primaryRole,
    roleDetails: Object.fromEntries(form.roles.map((role) => [role,
      Object.fromEntries((publicRoleFields[role] || []).flatMap((key) => {
        if (key === "businessName" && form.roleDetails[role].businessType !== "Registered business") return [];
        const value = text(form.roleDetails[role][key]).trim();
        return value ? [[key, value]] : [];
      })),
    ])),
  };
}
export type PublicProfileView = NonNullable<ReturnType<typeof publicProfileView>>;

export function nextProfileTab<T extends string>(tabs: readonly T[], current: T, key: string): T | null {
  const index = tabs.indexOf(current);
  if (key === "ArrowRight") return tabs[(index + 1) % tabs.length];
  if (key === "ArrowLeft") return tabs[(index - 1 + tabs.length) % tabs.length];
  if (key === "Home") return tabs[0];
  if (key === "End") return tabs[tabs.length - 1];
  return null;
}
