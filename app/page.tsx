import type { Metadata } from "next";
import LandingExperience from "@/components/landing/landing-experience";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <LandingExperience />;
}
