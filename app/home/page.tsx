import type { Metadata } from "next";
import { MockHomeFeed } from "@/components/home/mock-home-feed";

export const metadata: Metadata = {
  title: "Home",
  description: "Your Requote work network feed.",
  robots: { index: false, follow: false },
};

type HomeFeedPageProps = {
  searchParams: Promise<{ profile?: string }>;
};

export default async function HomeFeedPage({ searchParams }: HomeFeedPageProps) {
  const { profile } = await searchParams;
  const profileMode = profile === "true" ? "incomplete" : "complete";

  return <MockHomeFeed profileMode={profileMode} />;
}
