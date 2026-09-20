import type { Metadata } from "next";
import { AccountSetup } from "@/components/profile/account-setup";

export const metadata: Metadata = {
  title: "Set up your account",
  description: "Complete your Requote account setup.",
  robots: { index: false, follow: false },
};

export default function AccountSetupPage() {
  return <AccountSetup />;
}
