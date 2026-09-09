import type { MetadataRoute } from "next";

const publicRoutes = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/waitlist", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/how-it-works", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/trust-safety", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/terms", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/privacy", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/cookies", priority: 0.3, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://requote.cc").replace(
    /\/$/,
    "",
  );

  return publicRoutes.map((route) => ({
    url: baseUrl + route.path,
    lastModified: new Date("2026-09-09"),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
