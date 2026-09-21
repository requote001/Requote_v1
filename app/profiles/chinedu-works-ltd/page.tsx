import type { Metadata } from "next";
import { ProviderProfile } from "@/components/profile/provider-profile";
import { getProfilePlaceholder } from "@/lib/profile-placeholders";

export const metadata: Metadata = {
  title: "Chinedu Works Ltd.",
  description: "Provider profile preview for Chinedu Works Ltd. on Requote.",
  robots: { index: false, follow: false },
};

export default function ChineduWorksProfilePage() {
  return <ProviderProfile profile={getProfilePlaceholder("chinedu-works-ltd")} />;
}
