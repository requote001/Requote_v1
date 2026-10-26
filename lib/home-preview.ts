export type FeedFilter =
  | "For you"
  | "Following"
  | "Requests"
  | "Opportunities"
  | "My activity";
export type FeedPost = {
  id: string;
  author: string;
  slug: string;
  role: string;
  tone: string;
  type: "Request" | "Work sample" | "Opportunity";
  title: string;
  description: string;
  tags: string[];
  action: string;
};
export const feedFilters: FeedFilter[] = [
  "For you",
  "Following",
  "Requests",
  "Opportunities",
  "My activity",
];
export const previewPosts: FeedPost[] = [
  {
    id: "photography",
    author: "Chinedu Works Ltd.",
    slug: "chinedu-works-ltd",
    role: "Provider · Lagos",
    tone: "green",
    type: "Request",
    title: "A photographer to capture a three-day Lagos wedding",
    description:
      "Looking for documentary-style coverage with a calm process, clear communication, and a natural, considered portfolio. Full-day coverage and an edited digital gallery are part of the brief.",
    tags: ["300 guests", "Lagos · On site", "Budget to discuss"],
    action: "View request",
  },
  {
    id: "metalwork",
    author: "Fatima Bello",
    slug: "fatima-bello",
    role: "Architectural metalwork",
    tone: "orange",
    type: "Work sample",
    title: "Thoughtful metalwork. Built around the brief.",
    description:
      "A closer look at the craft behind commercial steel partitions, from the first measurements to the final finish.",
    tags: ["Fabrication", "Commercial interiors"],
    action: "View work sample",
  },
  {
    id: "welders",
    author: "Lagos Build Collective",
    slug: "lagos-build-collective",
    role: "Construction · Project management",
    tone: "purple",
    type: "Opportunity",
    title: "Two structural welders for a commercial warehouse build",
    description:
      "A four-week contract for experienced structural welders. Commercial project experience and a safety-first approach are important for this team.",
    tags: ["Contract · 4 weeks", "Oregun, Ikeja", "On site"],
    action: "View opportunity",
  },
];
export function filterPreviewPosts(
  filter: FeedFilter,
  followed: string[],
  saved: string[],
  savedOnly = false,
) {
  return previewPosts.filter((post) => {
    if (savedOnly) return saved.includes(post.id);
    if (filter === "Following") return followed.includes(post.slug);
    if (filter === "Requests") return post.type === "Request";
    if (filter === "Opportunities") return post.type === "Opportunity";
    return filter !== "My activity";
  });
}
export function isPreviewProfileComplete(
  stored: boolean | undefined,
  mode?: "complete" | "incomplete",
) {
  return mode ? mode === "complete" : stored === true;
}
