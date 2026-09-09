import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";

export const metadata: Metadata = {
  title: "Join the waitlist",
  description:
    "Join the Requote early-access waitlist as a requester or provider in Nigeria.",
  alternates: { canonical: "/waitlist" },
};

export default function WaitlistPage() {
  return (
    <main className="waitlist-minimal">
      <header className="waitlist-minimal__header">
        <Link
          className="waitlist-minimal__brand"
          href="/"
          aria-label="Requote home"
        >
          <img src="/requote-logo.png" alt="Requote" />
        </Link>
        <Link className="waitlist-minimal__back" href="/">
          Back to home
        </Link>
      </header>

      <div className="waitlist-minimal__frame">
        <section
          className="waitlist-minimal__intro"
          aria-labelledby="waitlist-story-title"
        >
          <p className="waitlist-minimal__eyebrow">Requote early access</p>
          <h1 id="waitlist-story-title">Good work starts with a clear ask.</h1>
          <p className="waitlist-minimal__lede">
            Requote is a calmer way for people who need things done and
            providers ready to do great work to find each other.
          </p>

          <div className="waitlist-minimal__points">
            <article>
              <span aria-hidden="true">01</span>
              <div>
                <strong>For requesters</strong>
                <p>Describe what you need and compare thoughtful offers.</p>
              </div>
            </article>
            <article>
              <span aria-hidden="true">02</span>
              <div>
                <strong>For providers</strong>
                <p>Find clearer opportunities that suit your work.</p>
              </div>
            </article>
          </div>

          <p className="waitlist-minimal__note">
            We’re opening access carefully, beginning with Nigeria.
          </p>
        </section>

        <section
          className="waitlist-minimal__form-panel"
          aria-labelledby="waitlist-form-title"
        >
          <div className="waitlist-minimal__form-heading">
            <p className="waitlist-minimal__eyebrow">Join the waitlist</p>
            <h2 id="waitlist-form-title">Start with the essentials.</h2>
            <p>
              No password is needed. We’ll only use your details to prepare
              your early access.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="auth-form-skeleton">Loading waitlist…</div>
            }
          >
            <WaitlistForm />
          </Suspense>

          <footer className="waitlist-minimal__footer">
            <span>Requote is designed for more clarity, from the start.</span>
            <span>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </span>
          </footer>
        </section>
      </div>
    </main>
  );
}
