import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Trust and Safety",
  description:
    "How Requote combines verification, documented agreements, protected payments, and evidence-based dispute handling.",
  alternates: { canonical: "/trust-safety" },
};

const layers = [
  {
    title: "Identity and verification",
    copy: "Account, identity, business, and activity checks help users understand who they are dealing with.",
  },
  {
    title: "Documented agreement",
    copy: "The request, accepted offer, messages, milestones, and logistics terms become the transaction record.",
  },
  {
    title: "Protected payment",
    copy: "The agreed funds are secured before work begins and released against confirmed outcomes.",
  },
];

export default function TrustSafetyPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="trust-hero">
          <div className="product-shell trust-hero__grid">
            <div>
              <p className="product-kicker product-kicker--light">
                Trust &amp; safety
              </p>
              <h1>Protection starts with a clear agreement.</h1>
              <p>
                Requote combines verification, transaction records, protected
                payment, and evidence-based review so strangers can do business
                with greater confidence.
              </p>
              <Link className="product-light-button" href="/post-a-request">
                Create a protected request
              </Link>
            </div>
            <div
              className="trust-scorecard"
              role="img"
              aria-label="Requote transaction protection summary"
            >
              <div className="trust-scorecard__top">
                <span className="trust-scorecard__shield">✓</span>
                <div>
                  <small>Transaction status</small>
                  <strong>Protection active</strong>
                </div>
              </div>
              <dl>
                <div>
                  <dt>Agreement</dt>
                  <dd>Confirmed</dd>
                </div>
                <div>
                  <dt>Provider</dt>
                  <dd>Verified</dd>
                </div>
                <div>
                  <dt>Funds</dt>
                  <dd>Secured</dd>
                </div>
                <div>
                  <dt>Evidence</dt>
                  <dd>Recorded</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="product-section">
          <div className="product-shell">
            <header className="product-section-heading">
              <p className="product-kicker">Layers of trust</p>
              <h2>No single feature carries the whole promise.</h2>
              <p>
                Requote uses three connected safeguards, each answering a
                different question before and during a transaction.
              </p>
            </header>
            <div className="trust-layer-grid" id="verification">
              {layers.map((layer, index) => (
                <article key={layer.title}>
                  <span>0{index + 1}</span>
                  <h3>{layer.title}</h3>
                  <p>{layer.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="product-section product-section--soft">
          <div className="product-shell protection-grid">
            <div>
              <p className="product-kicker">Protected transaction</p>
              <h2>The funds follow the agreement.</h2>
              <p>
                The requester secures the agreed amount. Release happens after
                delivery is confirmed, or according to accepted milestone terms.
                A provider can begin knowing the funds are committed.
              </p>
              <div className="protection-note">
                <strong>Important</strong>
                <span>
                  Requote&apos;s live payment structure will use licensed
                  partners and final compliance-approved terms.
                </span>
              </div>
            </div>
            <ol className="protection-timeline">
              <li>
                <span>1</span>
                <div>
                  <strong>Scope accepted</strong>
                  <small>Price, timing, and evidence are clear.</small>
                </div>
              </li>
              <li>
                <span>2</span>
                <div>
                  <strong>Funds secured</strong>
                  <small>Payment protection becomes active.</small>
                </div>
              </li>
              <li>
                <span>3</span>
                <div>
                  <strong>Work delivered</strong>
                  <small>Delivery and milestones are recorded.</small>
                </div>
              </li>
              <li>
                <span>4</span>
                <div>
                  <strong>Release or review</strong>
                  <small>Confirm delivery or raise an issue.</small>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section className="product-section" id="disputes">
          <div className="product-shell dispute-grid">
            <div>
              <p className="product-kicker">Evidence-based disputes</p>
              <h2>The agreement—not volume or emotion—sets the standard.</h2>
              <p>
                When an issue is raised, Requote compares the delivered outcome
                with the accepted request and offer. Messages, photographs,
                videos, inspection records, and logistics evidence help
                establish what happened.
              </p>
            </div>
            <div className="outcome-list">
              <article>
                <span>A</span>
                <div>
                  <strong>Agreement met</strong>
                  <p>Payment is released to the provider.</p>
                </div>
              </article>
              <article>
                <span>B</span>
                <div>
                  <strong>Correctable difference</strong>
                  <p>The parties agree on a fix, milestone, or revised term.</p>
                </div>
              </article>
              <article>
                <span>C</span>
                <div>
                  <strong>Material failure</strong>
                  <p>
                    A partial or full refund may be appropriate after review.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="product-section product-section--navy">
          <div className="product-shell safety-grid">
            <div>
              <p className="product-kicker product-kicker--light">
                Safer transactions
              </p>
              <h2>Good habits still matter.</h2>
            </div>
            <ul>
              <li>
                Keep requests, offers, changes, and evidence inside Requote.
              </li>
              <li>
                Do not move payment outside the protected transaction flow.
              </li>
              <li>
                Inspect profiles, verification, timing, and exclusions
                carefully.
              </li>
              <li>
                Report suspicious behaviour before accepting or funding an
                offer.
              </li>
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
