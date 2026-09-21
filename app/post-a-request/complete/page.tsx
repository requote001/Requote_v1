import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Request complete",
  robots: { index: false, follow: false },
};

type CompletePageProps = {
  searchParams: Promise<{
    id?: string;
    status?: string;
    source?: string;
  }>;
};

export default async function RequestCompletePage({
  searchParams,
}: CompletePageProps) {
  const params = await searchParams;
  const isDraft = params.status === "draft";
  const inAppFlow = params.source === "home";
  const reference = params.id?.slice(0, 8).toUpperCase() ?? "PREVIEW";
  const createAnotherHref = inAppFlow
    ? "/post-a-request?journey=request&source=home"
    : "/post-a-request";
  const returnHref = inAppFlow ? "/home" : "/";

  return (
    <>
      <SiteHeader compact />
      <main className="completion-page">
        <section className="completion-card">
          <span className="completion-card__icon">✓</span>
          <p className="product-kicker">
            {isDraft ? "Draft saved" : "Request published"}
          </p>
          <h1>
            {isDraft
              ? "Your request is ready when you are."
              : "Your request is ready for provider offers."}
          </h1>
          <p>
            {isDraft
              ? "Return to the request flow at any time on this device to review and publish it."
              : "In the production marketplace, relevant providers will be notified and their offers will appear in your account."}
          </p>
          <dl>
            <div>
              <dt>Reference</dt>
              <dd>{reference}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{isDraft ? "Draft" : "Published"}</dd>
            </div>
            <div>
              <dt>Protection</dt>
              <dd>Begins after an offer is accepted and funded</dd>
            </div>
          </dl>
          <div className="preview-notice">
            <strong>Preview storage</strong>
            <span>
              This request is stored in this browser for product testing. No
              provider notification or live database write has occurred.
            </span>
          </div>
          <div className="completion-card__actions">
            <Link className="product-primary-button" href={createAnotherHref}>
              Create another request
            </Link>
            <Link className="product-secondary-button" href={returnHref}>
              {inAppFlow ? "Return to feed" : "Return home"}
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
