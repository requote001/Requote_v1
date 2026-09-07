import type { Metadata } from "next";
import { RequestWizard } from "@/components/request/request-wizard";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Post a request",
  description:
    "Describe what you need and receive offers from capable providers on Requote.",
  robots: { index: false, follow: false },
};

export default function PostRequestPage() {
  return (
    <>
      <SiteHeader compact />
      <main className="request-page">
        <RequestWizard />
      </main>
    </>
  );
}
