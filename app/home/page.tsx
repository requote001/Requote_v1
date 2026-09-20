import type { Metadata } from "next";
import { MockHomeFeed } from "@/components/home/mock-home-feed";

export const metadata: Metadata = {
  title: "Home",
  description: "Your Requote work network feed.",
  robots: { index: false, follow: false },
};

export default function HomeFeedPage() {
  return <MockHomeFeed />;
}
