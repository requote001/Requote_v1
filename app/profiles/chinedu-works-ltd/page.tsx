import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProviderProfile } from "@/components/profile/provider-profile";
import { getProfilePlaceholder } from "@/lib/profile-placeholders";

export const metadata: Metadata = {
  title: "Chinedu Works Ltd.",
  description: "Provider profile preview for Chinedu Works Ltd. on Requote.",
  alternates: { canonical: "/profiles/chinedu-works-ltd" },
  robots: { index: false, follow: false },
};

export default function ChineduWorksProfilePage() {
  const profile = getProfilePlaceholder("chinedu-works-ltd");
  if (!profile) notFound();
  return <ProviderProfile profile={profile} />;
}
