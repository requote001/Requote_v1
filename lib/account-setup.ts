/** Frontend fixtures and local-draft helpers. Never use these as authorization. */
export const SETUP_ROLES = [
  {
    id: "requester",
    label: "Client",
    description: "Find the right people for what you need.",
  },
  {
    id: "provider",
    label: "Provider",
    description: "Bring your services and expertise to the network.",
  },
  {
    id: "employee",
    label: "Professional",
    description: "Explore work that fits your skills and direction.",
  },
  {
    id: "employer",
    label: "Employer",
    description: "Connect people with your team’s next chapter.",
  },
  {
    id: "investor",
    label: "Investor",
    description: "Explore sectors, businesses, and strategic conversations.",
  },
] as const;
export type SetupRole = (typeof SETUP_ROLES)[number]["id"];
export const SETUP_STEPS = [
  "About you",
  "Professional overview",
  "Roles & details",
  "Email status",
  "Review",
];
export const PROFESSIONAL_LEVELS = [
  "Entry level / learning",
  "Early career professional",
  "Mid-level professional",
  "Senior specialist",
  "Founder / business owner",
  "Executive / team leader",
  "Established business",
];
type RoleField = {
  key: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  kind?: "textarea" | "select";
  options?: string[];
  when?: { field: string; value: string };
  hint?: string;
};
export const ROLE_FIELDS: Record<SetupRole, RoleField[]> = {
  requester: [
    {
      key: "interests",
      label: "Services you’re interested in",
      required: true,
      placeholder: "e.g. Website design, fabrication, photography",
      hint: "Separate interests with commas. You can change these later.",
    },
    {
      key: "preferredLocation",
      label: "Preferred service location",
      placeholder: "e.g. Lagos, remote, or open to other locations",
    },
  ],
  provider: [
    {
      key: "businessType",
      label: "How do you work?",
      required: true,
      kind: "select",
      options: ["Independent professional", "Registered business"],
    },
    {
      key: "businessName",
      label: "Business name",
      required: true,
      when: { field: "businessType", value: "Registered business" },
      placeholder: "Your registered business name",
    },
    {
      key: "services",
      label: "Services you provide",
      required: true,
      placeholder: "e.g. Brand identity and website design",
    },
    {
      key: "categories",
      label: "Service categories",
      required: true,
      placeholder: "e.g. Digital & technology, creative services",
    },
    {
      key: "serviceAreas",
      label: "Where can you deliver your services?",
      required: true,
      placeholder: "e.g. Lagos, Abuja, or remote nationwide",
    },
    {
      key: "experience",
      label: "Relevant experience",
      kind: "textarea",
      placeholder:
        "Summarise projects, industries, or outcomes you’ve worked on.",
    },
  ],
  employee: [
    {
      key: "skills",
      label: "Professional skills",
      required: true,
      placeholder: "e.g. Product design, research, stakeholder communication",
    },
    {
      key: "workPreferences",
      label: "What kind of work interests you?",
      required: true,
      placeholder:
        "e.g. Full-time design roles or short-term research projects",
    },
    {
      key: "workMode",
      label: "Preferred working arrangement",
      kind: "select",
      options: ["Remote", "On site", "Hybrid", "Flexible"],
    },
    {
      key: "workHistory",
      label: "Work history highlights",
      kind: "textarea",
      placeholder:
        "Share relevant roles, responsibilities, or experience. No CV upload is needed.",
    },
  ],
  employer: [
    {
      key: "companyName",
      label: "Company or organisation name",
      required: true,
      placeholder: "Your organisation’s name",
    },
    {
      key: "industry",
      label: "Industry",
      required: true,
      placeholder: "e.g. Construction, technology, agriculture",
    },
    {
      key: "companySize",
      label: "Team size",
      kind: "select",
      options: ["Just me", "2–10", "11–50", "51–200", "201+"],
    },
    {
      key: "hiringNeeds",
      label: "Expertise your team is looking for",
      required: true,
      placeholder: "e.g. Structural welders or a product design team",
    },
    {
      key: "companyOverview",
      label: "A little about the organisation",
      kind: "textarea",
      placeholder: "What do you do, and what are you building?",
    },
  ],
  investor: [
    {
      key: "sectors",
      label: "Sectors of interest",
      required: true,
      placeholder: "e.g. Technology, agriculture, logistics",
    },
    {
      key: "interests",
      label: "What would you like to explore?",
      required: true,
      placeholder:
        "e.g. Strategic partnerships, founder conversations, market insights",
    },
    {
      key: "stage",
      label: "Business stages of interest",
      placeholder: "e.g. Early-stage or established businesses",
    },
    {
      key: "engagement",
      label: "Preferred involvement",
      kind: "textarea",
      placeholder:
        "Describe the conversations or partnerships you’re interested in.",
    },
  ],
};
export type SetupForm = {
  name: string;
  location: string;
  headline: string;
  professionalFocus: string;
  professionalLevel: string;
  professionalOverview: string;
  skills: string;
  isAvailable: boolean;
  publicProfile: boolean;
  avatarDataUrl: string;
  roles: SetupRole[];
  primaryRole: SetupRole | "";
  roleDetails: Record<SetupRole, Record<string, string>>;
};
export type SetupDraft = {
  version: 2;
  owner: string;
  savedAt: string;
  step: number;
  form: SetupForm;
};
export type SetupStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};
const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
const text = (value: unknown) =>
  typeof value === "string" ? value.slice(0, 3000) : "";
export function setupRole(value: unknown): SetupRole | "" {
  if (typeof value !== "string") return "";
  const lower = value.toLowerCase();
  return (
    SETUP_ROLES.find(
      (role) => role.id === lower || role.label.toLowerCase() === lower,
    )?.id || ""
  );
}
export function setupRoleLabel(id: string) {
  return SETUP_ROLES.find((role) => role.id === id)?.label || id;
}
export function selectedSetupRoles(member: Record<string, unknown>) {
  const roles = Array.isArray(member.roles)
    ? ([...new Set(member.roles.map(setupRole).filter(Boolean))] as SetupRole[])
    : [];
  const legacy = setupRole(member.role);
  return roles.length ? roles : legacy ? [legacy] : [];
}
export function safeAvatar(value: unknown): string {
  return typeof value === "string" &&
    value.length <= 700000 &&
    /^data:image\/(?:png|jpeg|webp);base64,[a-z\d+/=]+$/i.test(value)
    ? value
    : "";
}
export function avatarFileIssue(type: string, size: number) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(type))
    return "Choose a JPG, PNG, or WebP image. SVG files are not supported.";
  return size > 500 * 1024
    ? "Choose an image smaller than 500 KB for this local preview."
    : "";
}
export function normaliseSetup(
  source: Record<string, unknown> = {},
): SetupForm {
  const roles = selectedSetupRoles(source);
  const primary = setupRole(source.primaryRole) || setupRole(source.role);
  const details = record(source.roleDetails);
  const roleDetails = Object.fromEntries(
    SETUP_ROLES.map((role) => [
      role.id,
      Object.fromEntries(
        ROLE_FIELDS[role.id].map((field) => [
          field.key,
          text(record(details[role.id])[field.key]),
        ]),
      ),
    ]),
  ) as SetupForm["roleDetails"];
  return {
    name: text(source.name),
    location: text(source.location),
    headline: text(source.headline),
    professionalFocus: text(source.professionalFocus),
    professionalLevel: PROFESSIONAL_LEVELS.includes(
      text(source.professionalLevel),
    )
      ? text(source.professionalLevel)
      : "",
    professionalOverview: text(source.professionalOverview || source.about),
    skills: text(source.skills),
    isAvailable: source.isAvailable === true,
    publicProfile: source.publicProfile === true,
    avatarDataUrl: safeAvatar(source.avatarDataUrl),
    roles,
    primaryRole: roles.includes(primary as SetupRole)
      ? primary
      : roles[0] || "",
    roleDetails,
  };
}
export function changeSetupRole(form: SetupForm, role: SetupRole): SetupForm {
  const roles = form.roles.includes(role)
    ? form.roles.filter((value) => value !== role)
    : [...form.roles, role];
  return {
    ...form,
    roles,
    primaryRole: roles.includes(form.primaryRole as SetupRole)
      ? form.primaryRole
      : roles[0] || "",
  };
}
export function visibleRoleFields(
  role: SetupRole,
  values: Record<string, string>,
) {
  return ROLE_FIELDS[role].filter(
    (field) => !field.when || values[field.when.field] === field.when.value,
  );
}
export function setupIssues(
  form: SetupForm,
  step: number,
  emailVerified = false,
): Record<string, string> {
  const issues: Record<string, string> = {};
  const required = (key: string, value: string, label: string, max = 160) => {
    if (!value.trim()) issues[key] = `Add ${label}.`;
    else if (value.length > max)
      issues[key] = `Keep this to ${max} characters or fewer.`;
  };
  if (step === 0) {
    required("name", form.name, "your name", 100);
    required("location", form.location, "your city and country", 120);
    if (form.headline.length > 140)
      issues.headline = "Keep your headline to 140 characters or fewer.";
  }
  if (step === 1) {
    required(
      "professionalFocus",
      form.professionalFocus,
      "your professional focus",
    );
    if (!PROFESSIONAL_LEVELS.includes(form.professionalLevel))
      issues.professionalLevel = "Choose the professional level that fits you.";
    if (form.professionalOverview.length > 1200)
      issues.professionalOverview =
        "Keep your overview to 1,200 characters or fewer.";
    if (form.skills.length > 300)
      issues.skills = "Keep your skills to 300 characters or fewer.";
  }
  if (step === 2) {
    if (!form.roles.length)
      issues.roles = "Choose at least one role. You can select more than one.";
    if (!form.roles.includes(form.primaryRole as SetupRole))
      issues.primaryRole = "Choose a primary role from your selected roles.";
    for (const role of form.roles)
      for (const field of visibleRoleFields(role, form.roleDetails[role])) {
        const key = `${role}.${field.key}`,
          value = form.roleDetails[role][field.key] || "";
        if (field.required)
          required(
            key,
            value,
            field.label.toLowerCase(),
            field.kind === "textarea" ? 1200 : 300,
          );
        if (value && field.options && !field.options.includes(value))
          issues[key] = "Choose one of the available options.";
        if (value.length > (field.kind === "textarea" ? 1200 : 300))
          issues[key] = "Shorten this entry before continuing.";
      }
  }
  if (step === 3 && !emailVerified)
    issues.email =
      "Email confirmation is needed before setup can be completed.";
  return issues;
}
export function allSetupIssues(form: SetupForm, emailVerified: boolean) {
  return Object.assign(
    {},
    ...[0, 1, 2, 3].map((step) => setupIssues(form, step, emailVerified)),
  ) as Record<string, string>;
}
const ownerId = (email: string) => email.trim().toLowerCase();
export function setupDraftKey(email: string) {
  if (!ownerId(email))
    throw new Error("A preview email is required to save account setup.");
  return `requote.setup.v2:${encodeURIComponent(ownerId(email))}`;
}
export function readSetupDraft(
  storage: SetupStorage,
  email: string,
): SetupDraft | null {
  const raw = storage.getItem(setupDraftKey(email));
  if (!raw) return null;
  const parsed = record(JSON.parse(raw));
  if (
    parsed.version !== 2 ||
    parsed.owner !== ownerId(email) ||
    !parsed.form ||
    typeof parsed.savedAt !== "string" ||
    !Number.isFinite(Date.parse(parsed.savedAt))
  )
    throw new Error(
      "The saved setup draft could not be read. Your account has not been changed.",
    );
  return {
    version: 2,
    owner: ownerId(email),
    savedAt: parsed.savedAt,
    step:
      typeof parsed.step === "number" && Number.isFinite(parsed.step)
        ? Math.max(0, Math.min(4, Math.floor(parsed.step)))
        : 0,
    form: normaliseSetup(record(parsed.form)),
  };
}
/** Keep more recent profile edits when resuming an older setup/role draft. */
export function mergeSavedProfileEdits(draft: SetupDraft, member: Record<string, unknown>): SetupForm {
  const timestamps = record(member.profileFieldEdits);
  const updates: Record<string, unknown> = {};
  for (const key of ["name", "headline", "location", "professionalFocus", "professionalOverview", "skills", "publicProfile", "isAvailable"]) {
    const at = typeof timestamps[key] === "string" ? Date.parse(timestamps[key]) : NaN;
    if (Number.isFinite(at) && at > Date.parse(draft.savedAt)) updates[key] = member[key];
  }
  return normaliseSetup({ ...draft.form, ...updates });
}
export function writeSetupDraft(
  storage: SetupStorage,
  email: string,
  form: SetupForm,
  step: number,
  now = new Date().toISOString(),
): SetupDraft {
  const draft: SetupDraft = {
    version: 2,
    owner: ownerId(email),
    savedAt: now,
    step: Number.isFinite(step)
      ? Math.max(0, Math.min(4, Math.floor(step)))
      : 0,
    form: normaliseSetup(form),
  };
  storage.setItem(setupDraftKey(email), JSON.stringify(draft));
  return draft;
}
export function completeLocalSetup(
  storage: SetupStorage,
  authKey: string,
  email: string,
  form: SetupForm,
) {
  const latest = record(JSON.parse(storage.getItem(authKey) || "null"));
  if (
    latest.authenticated !== true ||
    ownerId(text(latest.email)) !== ownerId(email)
  )
    throw new Error(
      "Your preview account changed. Sign in again before finishing setup.",
    );
  const issues = allSetupIssues(form, latest.emailVerified === true);
  if (Object.keys(issues).length)
    throw new Error(
      "Complete the required details and confirm your email before finishing.",
    );
  writeSetupDraft(storage, email, form, 4);
  const next = {
    ...latest,
    name: form.name.trim(),
    location: form.location.trim(),
    headline: form.headline.trim(),
    professionalFocus: form.professionalFocus.trim(),
    professionalLevel: form.professionalLevel,
    professionalOverview: form.professionalOverview.trim(),
    about: form.professionalOverview.trim(),
    skills: form.skills.trim(),
    avatarDataUrl: safeAvatar(form.avatarDataUrl),
    isAvailable: form.isAvailable,
    publicProfile: form.publicProfile,
    roles: [...form.roles],
    primaryRole: form.primaryRole,
    activeRole: form.primaryRole,
    role: setupRoleLabel(form.primaryRole),
    roleDetails: Object.fromEntries(
      form.roles.map((role) => [role, form.roleDetails[role]]),
    ),
    profileComplete: true,
  };
  storage.setItem(authKey, JSON.stringify(next));
  return next;
}
