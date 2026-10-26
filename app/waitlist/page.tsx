import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import "./waitlist.css";

export const metadata: Metadata = {
  title: "Join the waitlist",
  description:
    "Join Requote early access as a client, provider, employer, professional, or investor in Nigeria.",
  alternates: { canonical: "/waitlist" },
};

export default function WaitlistPage() {
  return (
    <div className="waitlist-page">
      <header className="waitlist-header">
        <Link className="waitlist-brand" href="/" aria-label="Requote home">
          <img src="/requote-logo.png" alt="Requote" />
        </Link>
        <Link className="waitlist-back" href="/">
          Back to Requote <span aria-hidden="true">↗</span>
        </Link>
      </header>

      <main className="waitlist-layout" id="waitlist-main">
        <section
          className="waitlist-story"
          aria-labelledby="waitlist-story-title"
        >
          <p className="waitlist-eyebrow">
            <span aria-hidden="true" /> A better way to connect
          </p>
          <h1 id="waitlist-story-title">
            Good work starts with the <em>right people.</em>
          </h1>
          <p className="waitlist-lede">
            Find the expertise you need. Bring your skills to the right work.
            Build what comes next, together.
          </p>
          <figure className="waitlist-people">
            <img
              src="/people/collaboration.webp"
              alt="Professionals bringing their ideas together around a work table"
              width={780}
              height={520}
            />
            <figcaption>
              <span aria-hidden="true">↗</span>
              <span>
                Different strengths.
                <br />
                <strong>Shared possibilities.</strong>
              </span>
            </figcaption>
          </figure>
          <div className="waitlist-story-note">
            <span aria-hidden="true">◇</span>
            <p>
              For clients, providers, employers, professionals, and investors.
              <br />
              <strong>One network. Your own direction.</strong>
            </p>
          </div>
        </section>

        <section
          className="waitlist-panel"
          aria-labelledby="waitlist-form-title"
        >
          <Suspense
            fallback={
              <div className="waitlist-loading" role="status" aria-busy="true">
                <span />
                <span />
                <span />
                <p>Preparing your place…</p>
              </div>
            }
          >
            <WaitlistForm />
          </Suspense>
        </section>
      </main>
      <footer className="waitlist-footer">
        <span>Built for better connections. Starting in Nigeria.</span>
        <nav aria-label="Waitlist support and legal">
          <a href="mailto:info@requote.cc">Get in touch</a>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
      </footer>
    </div>
  );
}
