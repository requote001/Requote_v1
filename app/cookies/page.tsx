import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How Requote uses essential, preference, analytics, and security technologies.",
  alternates: { canonical: "/cookies" },
};

const sections = [
  { id: "what", label: "What cookies are" },
  { id: "use", label: "How Requote uses them" },
  { id: "types", label: "Cookie categories" },
  { id: "choices", label: "Your choices" },
  { id: "updates", label: "Updates and contact" },
];

export default function CookiesPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Cookie Policy"
      summary="The small technologies Requote uses to keep accounts secure, remember choices, and understand how the service performs."
      updated="7 September 2026"
      sections={sections}
    >
      <section id="what">
        <h2>1. What cookies are</h2>
        <p>
          Cookies are small text files stored by a browser. Similar technologies
          include local storage, session storage, pixels, and software
          development kits. This policy uses “cookies” as a convenient term for
          these technologies.
        </p>
      </section>

      <section id="use">
        <h2>2. How Requote uses cookies</h2>
        <p>
          Requote uses cookies to maintain sessions, protect account access,
          retain an unfinished request, remember interface choices, diagnose
          errors, and understand whether pages and product flows are working.
        </p>
      </section>

      <section id="types">
        <h2>3. Cookie categories</h2>
        <div className="legal-table">
          <div>
            <strong>Essential</strong>
            <span>
              Login, security, request progress, and core functionality.
            </span>
          </div>
          <div>
            <strong>Preferences</strong>
            <span>Language, region, accessibility, and saved choices.</span>
          </div>
          <div>
            <strong>Analytics</strong>
            <span>Aggregated product usage and performance measurement.</span>
          </div>
          <div>
            <strong>Marketing</strong>
            <span>
              Campaign measurement only where enabled and permitted by consent.
            </span>
          </div>
        </div>
        <p>
          Requote will not activate optional analytics or marketing cookies
          before the appropriate consent controls and vendor disclosures are in
          place.
        </p>
      </section>

      <section id="choices">
        <h2>4. Your choices</h2>
        <p>
          You can block or remove cookies through your browser. Essential
          cookies cannot be disabled through a Requote preference tool because
          the service may not function safely without them. Optional-cookie
          controls will be provided before optional tracking is introduced.
        </p>
      </section>

      <section id="updates">
        <h2>5. Updates and contact</h2>
        <p>
          This policy will be updated when Requote introduces or changes cookie
          providers. Questions may be sent to{" "}
          <a href="mailto:info@requote.cc">info@requote.cc</a>.
        </p>
      </section>
    </LegalPage>
  );
}
