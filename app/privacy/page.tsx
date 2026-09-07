import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Requote collects, uses, protects, and shares personal information.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  { id: "scope", label: "Scope" },
  { id: "collect", label: "Information we collect" },
  { id: "use", label: "How we use information" },
  { id: "sharing", label: "How information is shared" },
  { id: "verification", label: "Verification and payments" },
  { id: "retention", label: "Retention" },
  { id: "rights", label: "Your choices and rights" },
  { id: "security", label: "Security" },
  { id: "international", label: "International processing" },
  { id: "children", label: "Children" },
  { id: "contact", label: "Contact" },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      summary="A clear explanation of the information Requote needs to operate a trusted marketplace and the choices available to you."
      updated="7 September 2026"
      sections={sections}
    >
      <section id="scope">
        <h2>1. Scope</h2>
        <p>
          This policy applies to Requote&apos;s websites, applications,
          marketplace services, support channels, verification activities, and
          protected transaction process. It should be read with our Terms and
          Cookie Policy.
        </p>
      </section>

      <section id="collect">
        <h2>2. Information we collect</h2>
        <p>
          We collect account details such as your name, email address, telephone
          number, password credentials, location, and selected account
          activities. Providers may also supply business details, professional
          history, identity information, portfolio material, and verification
          records.
        </p>
        <p>
          Marketplace information includes requests, offers, specifications,
          budgets, messages, accepted agreements, files, delivery evidence,
          reviews, support enquiries, and dispute submissions. Technical
          information may include device type, IP address, browser, pages
          visited, timestamps, cookie identifiers, and security events.
        </p>
      </section>

      <section id="use">
        <h2>3. How we use information</h2>
        <ul>
          <li>Provide accounts, requests, offers, and transaction records.</li>
          <li>Match requesters with relevant providers.</li>
          <li>Verify identity, reduce fraud, and protect the marketplace.</li>
          <li>Process payments through licensed partners.</li>
          <li>Support delivery, disputes, refunds, and customer service.</li>
          <li>Maintain, measure, and improve Requote.</li>
          <li>Meet legal, regulatory, accounting, and security obligations.</li>
        </ul>
      </section>

      <section id="sharing">
        <h2>4. How information is shared</h2>
        <p>
          Information needed to evaluate a request or offer may be shown to the
          other marketplace party. We may also share relevant information with
          payment processors, verification vendors, logistics providers, hosting
          and communications suppliers, professional advisers, and public
          authorities where required.
        </p>
        <p>
          Requote does not sell personal information. Service providers may use
          information only to perform contracted services and protect their
          systems, subject to appropriate agreements.
        </p>
      </section>

      <section id="verification">
        <h2>5. Identity verification and payments</h2>
        <p>
          Identity or business verification may be performed by specialist
          providers. Payment-card or bank details should be collected directly
          by licensed payment partners wherever possible. Requote may receive
          transaction references, account names, status, and risk indicators
          needed to operate the protected transaction process.
        </p>
      </section>

      <section id="retention">
        <h2>6. Retention</h2>
        <p>
          We retain information for as long as needed to provide the service,
          complete transactions, maintain evidence, resolve disputes, prevent
          fraud, and meet legal obligations. Retention periods may differ by
          record type and transaction status.
        </p>
      </section>

      <section id="rights">
        <h2>7. Your choices and rights</h2>
        <p>
          Subject to applicable law, you may request access, correction,
          deletion, restriction, or a copy of certain personal information. You
          may also object to particular processing or withdraw consent where
          consent is the basis used. Some transaction records must be retained
          for legal, fraud-prevention, or dispute purposes.
        </p>
      </section>

      <section id="security">
        <h2>8. Security</h2>
        <p>
          Requote uses administrative, technical, and organisational safeguards
          designed to protect personal information. No online service can
          guarantee absolute security, so users should protect their passwords
          and report suspicious activity promptly.
        </p>
      </section>

      <section id="international">
        <h2>9. International processing</h2>
        <p>
          Some technology providers may process information outside Nigeria.
          Where this occurs, Requote will use appropriate contractual,
          organisational, and legal safeguards required for the transfer.
        </p>
      </section>

      <section id="children">
        <h2>10. Children</h2>
        <p>
          Requote is not intended for anyone under 18 and does not knowingly
          permit children to enter marketplace transactions.
        </p>
      </section>

      <section id="contact">
        <h2>11. Changes and contact</h2>
        <p>
          We may update this policy as the product, partners, or law changes.
          Material updates will be communicated through the service where
          appropriate. Privacy questions may be sent to{" "}
          <a href="mailto:info@requote.cc">info@requote.cc</a>.
        </p>
      </section>
    </LegalPage>
  );
}
