import type { Metadata } from "next";
import { RequestWizard } from "@/components/request/request-wizard";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Start with Requote",
  description:
    "Choose whether you are joining Requote as a client, provider, employer, professional, or investor.",
  robots: { index: false, follow: false },
};

type PostRequestPageProps = {
  searchParams: Promise<{ journey?: string; source?: string }>;
};

export default async function PostRequestPage({
  searchParams,
}: PostRequestPageProps) {
  const { journey, source } = await searchParams;
  const inAppFlow = journey === "request" && source === "home";

  return (
    <>
      <SiteHeader compact />
      <main className="request-page">
        <RequestWizard
          startInRequestFlow={journey === "request"}
          inAppFlow={inAppFlow}
          cancelHref={inAppFlow ? "/home" : "/"}
        />
      </main>
    </>
  );
}
