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
  eyebrow: "Protected process",
  title: "Turn a clear request into a trusted transaction.",
  description:
    "Your request, offers, agreement, and delivery evidence stay connected from the first detail to the final confirmation.",
  items: [
    "Compare offers against one clear brief.",
    "Keep payment tied to the agreement.",
    "Use documented evidence if something changes.",
  ] as [string, string, string],
  footer: "Preview experience - No live payment is collected.",
};

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  panel = defaultPanel,
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
              {panel.eyebrow}
            </p>
            <h2>{panel.title}</h2>
            <p>{panel.description}</p>
          </div>
          <ul>
            {panel.items.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
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
