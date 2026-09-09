import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";

export const metadata: Metadata = {
  title: "Join the waitlist",
  description:
    "Join the Requote early-access waitlist as a requester or provider in Nigeria.",
  alternates: { canonical: "/waitlist" },
};

export default function WaitlistPage() {
  return (
    <AuthShell
      eyebrow="Early access"
      title="Get your place on Requote."
      description="Join the first group of requesters and providers shaping a clearer way to find work and compare offers."
      panel={{
        eyebrow: "Built with the first users",
        title: "Join early. Help shape what Requote becomes.",
        description:
          "Tell us how you plan to use Requote so we can prepare the right onboarding experience for you.",
        items: [
          "Be among the first people invited to create an account.",
          "Get launch updates that match your requester or provider role.",
          "Help us prioritise the categories and locations that matter.",
        ],
        footer: "No password required · Your details stay private.",
      }}
    >
      <Suspense
        fallback={<div className="auth-form-skeleton">Loading waitlist…</div>}
      >
        <WaitlistForm />
      </Suspense>
    </AuthShell>
  );
}
