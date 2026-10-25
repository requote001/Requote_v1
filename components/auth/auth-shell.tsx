import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  panel?: {
    eyebrow: string;
    title: string;
    description: string;
    items: [string, string, string];
    footer: string;
  };
};

const defaultPanel = {
  eyebrow: "A clearer way to work",
  title: "Good work starts with a clear connection.",
  description:
    "Bring what you need and what you can do into one connected workspace.",
  items: [
    "Describe the outcome you need.",
    "Compare clear, relevant offers.",
    "Keep the conversation in context.",
  ] as [string, string, string],
  footer: "For people finding work, offering expertise, and building teams.",
};

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  panel = defaultPanel,
}: AuthShellProps) {
  return (
    <main className="auth-page auth-workspace">
      <div className="auth-workspace__topbar">
        <Link className="auth-page__brand" href="/" aria-label="Requote home">
          <img src="/requote-logo.png" alt="Requote" width="126" height="38" />
        </Link>
        <Link className="auth-back-to-site" href="/">
          Back to Requote <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <div className="auth-shell">
        <aside className="auth-trust-panel">
          <div>
            <p className="product-kicker product-kicker--light">
              {panel.eyebrow}
            </p>
            <h2>{panel.title}</h2>
            <p>{panel.description}</p>
          </div>
          <div
            className="auth-connection-visual"
            aria-label="Illustration of a request and a clear offer"
          >
            <div className="auth-example-brief">
              <span className="auth-example-label">THE STARTING POINT</span>
              <p>“Here’s what I need.”</p>
              <div>
                <span>Clear scope</span>
                <span>Real context</span>
              </div>
            </div>
            <div className="auth-example-connector" aria-hidden="true">
              <span>↓</span>
            </div>
            <div className="auth-example-offer">
              <img src="/requote-mark.png" alt="" width="32" height="32" />
              <div>
                <strong>A clearer next move.</strong>
                <span>Request. Compare. Requote.</span>
              </div>
              <span aria-hidden="true">↗</span>
            </div>
            <small>Illustrative product journey</small>
          </div>
          <ul>
            {panel.items.map((item) => (
              <li key={item}>
                <span aria-hidden="true">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <small>{panel.footer}</small>
        </aside>
        <section className="auth-card">
          <header>
            <p className="product-kicker">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </header>
          {children}
          <p className="auth-preview-disclosure">
            <span aria-hidden="true" />
            Design preview · No live authentication, email delivery, or password
            changes.
          </p>
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
