export type ProfileWorkSample = {
  title: string;
  type: string;
  note: string;
  tone: "steel" | "blueprint";
};

export type ProfilePost = {
  label: string;
  time: string;
  title: string;
  copy: string;
};

export type ProfilePlaceholder = {
  slug: string;
  name: string;
  initials: string;
  profileKind: string;
  headline: string;
  location: string;
  availability: string;
  intro: string;
  aboutTitle: string;
  about: string;
  services: string[];
  category: string;
  serviceArea: string;
  preferredWork: string;
  workSamples: ProfileWorkSample[];
  posts: ProfilePost[];
};

const sharedWork: ProfileWorkSample[] = [
  {
    title: "Commercial steel stair and handrail system",
    type: "Fabrication · Lagos",
    note: "Designed for a high-traffic commercial entry with a durable powder-coated finish.",
    tone: "steel",
  },
  {
    title: "Custom retail display framework",
    type: "Fit-out · Victoria Island",
    note: "Modular frame system built to support seasonal merchandising and quick reconfiguration.",
    tone: "blueprint",
  },
];

const profiles: Record<string, ProfilePlaceholder> = {
  "chinedu-works-ltd": {
    slug: "chinedu-works-ltd",
    name: "Chinedu Works Ltd.",
    initials: "CW",
    profileKind: "Provider profile",
    headline: "Fabrication & commercial fit-out",
    location: "Lagos, Nigeria",
    availability: "Availability self-reported",
    intro: "A project-focused fabrication team working on commercial metalwork, structural detailing, and practical finishing for spaces that need to perform every day.",
    aboutTitle: "Built for briefs that need precision.",
    about: "Chinedu Works Ltd. supports commercial projects from early fabrication planning through site-ready installation. Their work is organized around clear scope, practical materials, and delivery expectations that teams can coordinate around.",
    services: ["Commercial metalwork", "Structural fabrication", "Retail & office fit-out", "Custom handrails & frames"],
    category: "Fabrication",
    serviceArea: "Lagos and nearby",
    preferredWork: "Commercial projects",
    workSamples: sharedWork,
    posts: [
      { label: "Shared request", time: "2h ago", title: "Need a professional lead photographer for a 3-day Lagos wedding in November", copy: "Sharing a well-scoped request from the network for providers who may be a strong fit." },
      { label: "Project update", time: "Yesterday", title: "What helps a commercial fabrication brief move faster", copy: "Clear dimensions, site context, and the intended finish give a project team a much better place to start." },
    ],
  },
  "fatima-bello": {
    slug: "fatima-bello",
    name: "Fatima Bello",
    initials: "FB",
    profileKind: "Provider profile",
    headline: "Architectural metalwork",
    location: "Lagos, Nigeria",
    availability: "Availability self-reported",
    intro: "An architectural metalwork practice focused on useful details, durable finishes, and visual consistency across commercial interiors.",
    aboutTitle: "Details that hold up in daily use.",
    about: "Fatima works with project teams on architectural metalwork and custom finishing for offices, retail environments, and hospitality spaces. Her profile keeps the project context close to every work sample.",
    services: ["Architectural metalwork", "Interior fit-out", "Custom frames", "Powder-coated finishes"],
    category: "Architectural metalwork",
    serviceArea: "Lagos and nearby",
    preferredWork: "Interior projects",
    workSamples: sharedWork.map((sample, index) => index === 0 ? { ...sample, title: "Structural steel partitioning with a refined finish" } : sample),
    posts: [
      { label: "Work sample", time: "4h ago", title: "Structural steel partitioning with a finish designed for everyday use", copy: "A concise project update showing the detail, purpose, and delivery context behind the work." },
      { label: "Project update", time: "Monday", title: "Why finish specification belongs in the first brief", copy: "Bringing the intended finish into the early conversation helps teams make better material and cost decisions." },
    ],
  },
  "lagos-build-collective": {
    slug: "lagos-build-collective",
    name: "Lagos Build Collective",
    initials: "LB",
    profileKind: "Team profile",
    headline: "Contracting & project management",
    location: "Ikeja, Lagos",
    availability: "Availability self-reported",
    intro: "A multidisciplinary construction team coordinating people, scope, and site execution for commercial builds around Lagos.",
    aboutTitle: "Built around clear site coordination.",
    about: "Lagos Build Collective brings together project coordination, site delivery, and specialist trade expertise. Their profile is designed to help capable people understand the project context before they express interest.",
    services: ["Project management", "Commercial builds", "Trade coordination", "Site supervision"],
    category: "Construction",
    serviceArea: "Lagos",
    preferredWork: "Commercial construction",
    workSamples: sharedWork.map((sample, index) => index === 0 ? { ...sample, title: "Commercial warehouse delivery plan", type: "Construction · Ikeja" } : sample),
    posts: [
      { label: "Opportunity", time: "Yesterday", title: "Looking for two certified structural welders for a 4-week commercial warehouse build", copy: "Project context, expected experience, and working arrangements are visible before an expression of interest." },
      { label: "Project update", time: "Last week", title: "The handover details that keep commercial projects moving", copy: "A short note on documenting site decisions so the next team can make a confident move." },
    ],
  },
};

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "Requote member";
}

export function getProfilePlaceholder(slug: string): ProfilePlaceholder {
  const normalizedSlug = slug.toLowerCase();
  const known = profiles[normalizedSlug];
  if (known) return known;

  const name = titleFromSlug(normalizedSlug);
  const initials = name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "RM";
  return {
    slug: normalizedSlug,
    name,
    initials,
    profileKind: "Profile preview",
    headline: "Work profile",
    location: "Location to be added",
    availability: "Availability not shared",
    intro: "This reusable Requote profile placeholder will fill with the member’s public details, services, work samples, and posts as those features are connected.",
    aboutTitle: "Profile details are being prepared.",
    about: "This placeholder keeps the page structure consistent while public profile information is added to the product.",
    services: ["Service details to be added", "Work samples to be added"],
    category: "To be added",
    serviceArea: "To be added",
    preferredWork: "To be added",
    workSamples: sharedWork,
    posts: [],
  };
}
