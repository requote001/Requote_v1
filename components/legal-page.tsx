import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  summary: string;
  updated: string;
  sections: { id: string; label: string }[];
  children: ReactNode;
};

export function LegalPage({
  eyebrow,
  title,
  summary,
  updated,
  sections,
  children,
}: LegalPageProps) {
  return (
    <>
      <SiteHeader compact />
      <main className="legal-page">
        <header className="legal-hero">
          <div className="product-shell">
            <p className="product-kicker">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{summary}</p>
            <span>Last updated: {updated}</span>
          </div>
        </header>
        <div className="product-shell legal-layout">
          <aside className="legal-nav" aria-label={title + " sections"}>
            <strong>On this page</strong>
            {sections.map((section) => (
              <a href={"#" + section.id} key={section.id}>
                {section.label}
              </a>
            ))}
          </aside>
          <article className="legal-content">
            <div className="legal-notice">
              <strong>Important notice</strong>
              <p>
                This is Requote&apos;s working product policy and should be
                reviewed by qualified Nigerian legal counsel before commercial
                launch, especially the escrow, payment, and dispute provisions.
              </p>
            </div>
            {children}
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
