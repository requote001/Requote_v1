import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how a Requote request moves from a clear brief to competitive offers, protected payment, delivery, and confirmation.",
  alternates: { canonical: "/how-it-works" },
};

const steps = [
  {
    number: "01",
    title: "Describe what you need",
    copy: "Set the category, specifications, location, timing, and optional budget in one clear request.",
  },
  {
    number: "02",
    title: "Receive provider offers",
    copy: "Relevant providers respond with price, timing, approach, and delivery terms.",
  },
  {
    number: "03",
    title: "Compare and agree",
    copy: "Review each offer against the same request, ask questions, and accept the best fit.",
  },
  {
    number: "04",
    title: "Secure the transaction",
    copy: "Fund the agreed amount through the protected payment process before fulfilment begins.",
  },
  {
    number: "05",
    title: "Track delivery",
    copy: "Keep milestones, messages, logistics, and evidence connected to the agreement.",
  },
  {
    number: "06",
    title: "Confirm or resolve",
    copy: "Confirm the result to release payment, or open a documented dispute when the agreement is not met.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="product-hero">
          <div className="product-shell product-hero__grid">
            <div>
              <p className="product-kicker">How Requote works</p>
              <h1>One clear process from request to protected delivery.</h1>
              <p>
                Requote turns an informal transaction into a documented
                agreement both sides can understand and follow.
              </p>
              <div className="product-actions">
                <Link className="product-primary-button" href="/post-a-request">
                  Post a request
                </Link>
                <Link className="product-secondary-button" href="/trust-safety">
                  Explore protection
                </Link>
              </div>
            </div>
            <div
              className="agreement-visual"
              aria-label="A protected Requote transaction"
            >
              <div>
                <span>Request</span>
                <strong>Commercial workshop gate</strong>
                <small>Specifications confirmed</small>
              </div>
              <i aria-hidden="true" />
              <div className="agreement-visual__active">
                <span>Protected payment</span>
                <strong>Funds secured</strong>
                <small>Release after confirmation</small>
              </div>
              <i aria-hidden="true" />
              <div>
                <span>Delivery</span>
                <strong>Evidence recorded</strong>
                <small>Both parties stay informed</small>
              </div>
            </div>
          </div>
        </section>

        <section className="product-section product-section--soft">
          <div className="product-shell">
            <header className="product-section-heading">
              <p className="product-kicker">The transaction path</p>
              <h2>Six visible steps. No guessing where the deal stands.</h2>
            </header>
            <ol className="journey-grid">
              {steps.map((step) => (
                <li key={step.number}>
                  <span>{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="product-section">
          <div className="product-shell audience-grid">
            <article>
              <p className="product-kicker">For requesters</p>
              <h2>Ask once. Compare like for like.</h2>
              <p>
                Every provider responds to the same written requirement, making
                price, timing, and approach easier to compare.
              </p>
              <ul className="product-check-list">
                <li>Keep the scope, budget, and timing together.</li>
                <li>Choose an offer without losing the original request.</li>
                <li>Release funds only against the documented outcome.</li>
              </ul>
              <Link className="product-primary-button" href="/post-a-request">
                Start a request
              </Link>
            </article>
            <article className="audience-grid__dark">
              <p className="product-kicker product-kicker--light">
                For providers
              </p>
              <h2>Price real work with clear expectations.</h2>
              <p>
                See what a requester needs before preparing an offer, then begin
                once the scope and protected payment are in place.
              </p>
              <ul className="product-check-list product-check-list--light">
                <li>Respond to detailed, legitimate requests.</li>
                <li>Document assumptions and delivery terms.</li>
                <li>Build a verifiable transaction history.</li>
              </ul>
              <Link
                className="product-light-button"
                href="/create-account?role=provider"
              >
                Join as a provider
              </Link>
            </article>
          </div>
        </section>

        <section className="product-cta">
          <div className="product-shell product-cta__inner">
            <div>
              <p className="product-kicker product-kicker--light">
                Ready to begin?
              </p>
              <h2>Describe the outcome. Let providers quote the work.</h2>
            </div>
            <Link className="product-light-button" href="/post-a-request">
              Post your request
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
