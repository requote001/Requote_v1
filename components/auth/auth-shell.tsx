import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: AuthShellProps) {
  return (
    <main className="auth-page">
      <Link className="auth-page__brand" href="/" aria-label="Requote home">
        <img src="/requote-logo.png" alt="Requote" />
      </Link>
      <div className="auth-shell">
        <aside className="auth-trust-panel">
          <div>
            <p className="product-kicker product-kicker--light">
              Protected process
            </p>
            <h2>Turn a clear request into a trusted transaction.</h2>
            <p>
              Your request, offers, agreement, and delivery evidence stay
              connected from the first detail to the final confirmation.
            </p>
          </div>
          <ul>
            <li>
              <span>01</span>Compare offers against one clear brief.
            </li>
            <li>
              <span>02</span>Keep payment tied to the agreement.
            </li>
            <li>
              <span>03</span>Use documented evidence if something changes.
            </li>
          </ul>
          <small>Preview experience · No live payment is collected.</small>
        </aside>
        <section className="auth-card">
          <header>
            <p className="product-kicker">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </header>
          {children}
        </section>
      </div>
      <footer className="auth-page__footer">
        <span>© {new Date().getFullYear()} Requote</span>
        <div>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <a href="mailto:info@requote.cc">Help</a>
        </div>
      </footer>
    </main>
  );
}
