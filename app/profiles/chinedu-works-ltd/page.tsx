import type { Metadata } from "next";
import { ProviderProfile } from "@/components/profile/provider-profile";

export const metadata: Metadata = {
  title: "Chinedu Works Ltd.",
  description: "Provider profile preview for Chinedu Works Ltd. on Requote.",
  robots: { index: false, follow: false },
};

export default function ChineduWorksProfilePage() {
  return <ProviderProfile />;
}
