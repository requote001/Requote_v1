import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountSetup } from "@/components/profile/account-setup";

export const metadata: Metadata = {
  title: "Set up your account",
  description: "Complete your Requote account setup.",
  robots: { index: false, follow: false },
};

export default function AccountSetupPage() {
  return (
    <Suspense fallback={null}>
      <AccountSetup />
    </Suspense>
  );
}
