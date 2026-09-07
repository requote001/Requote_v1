import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "The terms governing requests, offers, protected payments, delivery, and disputes on Requote.",
  alternates: { canonical: "/terms" },
};

const sections = [
  { id: "acceptance", label: "Acceptance" },
  { id: "accounts", label: "Accounts and eligibility" },
  { id: "marketplace", label: "Marketplace role" },
  { id: "requests-offers", label: "Requests and offers" },
  { id: "payments", label: "Payments and protection" },
  { id: "delivery", label: "Delivery and milestones" },
  { id: "disputes", label: "Cancellations and disputes" },
  { id: "conduct", label: "Acceptable conduct" },
  { id: "fees", label: "Fees and taxes" },
  { id: "liability", label: "Liability" },
  { id: "termination", label: "Suspension and termination" },
  { id: "law", label: "Governing law" },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms and Conditions"
      summary="The rules that keep requests, offers, payments, delivery, and dispute handling clear for everyone using Requote."
      updated="7 September 2026"
      sections={sections}
    >
      <section id="acceptance">
        <h2>1. Acceptance of these terms</h2>
        <p>
          These Terms and Conditions govern your access to Requote&apos;s
          website, marketplace, communication tools, and protected transaction
          process. By creating an account, posting a request, submitting an
          offer, or using a Requote service, you agree to these terms.
        </p>
        <p>
          If you use Requote for a business or organisation, you confirm that
          you have authority to accept these terms for that organisation.
        </p>
      </section>

      <section id="accounts">
        <h2>2. Accounts and eligibility</h2>
        <p>
          You must provide accurate information, protect your login details, and
          notify us promptly if you believe your account is compromised. One
          account may be used to request products or services and to provide
          them, subject to any verification required for each activity.
        </p>
        <p>
          You must be at least 18 years old and legally able to enter a binding
          agreement. Requote may request identity, business, address, payment,
          or professional information before enabling particular features or
          higher transaction limits.
        </p>
      </section>

      <section id="marketplace">
        <h2>3. Requote&apos;s marketplace role</h2>
        <p>
          Requote helps requesters describe a need, receive offers, document an
          agreement, and use a protected payment process. Unless Requote
          expressly states otherwise, providers are independent users and not
          employees, agents, or representatives of Requote.
        </p>
        <p>
          Requote does not guarantee that every request will receive an offer or
          that every provider is suitable for every job. Users remain
          responsible for reviewing the agreed scope, provider information, and
          transaction details before proceeding.
        </p>
      </section>

      <section id="requests-offers">
        <h2>4. Requests, offers, and agreements</h2>
        <p>
          Requesters must describe the required product or service honestly and
          with enough detail for providers to prepare an informed offer.
          Providers must state their price, timing, assumptions, exclusions,
          logistics, and delivery terms clearly.
        </p>
        <p>
          Once an offer is accepted, the request and accepted offer together
          form the documented agreement. Changes should be recorded and accepted
          by both parties inside Requote before work continues.
        </p>
      </section>

      <section id="payments">
        <h2>5. Payments and transaction protection</h2>
        <p>
          Where protected payment is available, the requester funds the agreed
          amount before fulfilment begins. Funds remain subject to the agreed
          release conditions and applicable payment-partner rules.
        </p>
        <p>
          Requote may use licensed payment partners and does not represent that
          it is itself a bank. The final regulated structure, safeguarding
          arrangements, fees, settlement timing, and refund mechanics will be
          disclosed before live transactions are enabled.
        </p>
      </section>

      <section id="delivery">
        <h2>6. Delivery, logistics, and milestones</h2>
        <p>
          The parties must select a delivery method and identify who is
          responsible for transport, access, inspection, and confirmation.
          Platform-arranged logistics may have additional terms. When users
          arrange logistics independently, they are responsible for documenting
          handover and resolving carrier issues unless the agreement states
          otherwise.
        </p>
        <p>
          Service work may use milestones. Each milestone should state the work
          due, evidence required, amount released, and review period. A released
          milestone is treated as accepted except where fraud or a clear error
          is established.
        </p>
      </section>

      <section id="disputes">
        <h2>7. Cancellations, refunds, and disputes</h2>
        <p>
          Escrow protects the documented agreement, not a later change of
          preference. If delivery does not match the accepted specification, a
          user may open a dispute within the stated review period and provide
          relevant evidence such as messages, photographs, videos, inspection
          records, and delivery documents.
        </p>
        <p>
          Possible outcomes include completion of corrective work, a revised
          agreement, partial release, full release, or refund. Custom work may
          become non-cancellable once production begins unless the provider
          materially fails to meet the agreed specification.
        </p>
      </section>

      <section id="conduct">
        <h2>8. Acceptable conduct</h2>
        <p>
          You may not use Requote for unlawful, deceptive, unsafe, infringing,
          or abusive activity. This includes false identities, fabricated
          requests, manipulated evidence, payment circumvention, harassment,
          prohibited goods, money laundering, or attempts to compromise the
          platform.
        </p>
      </section>

      <section id="fees">
        <h2>9. Fees and taxes</h2>
        <p>
          Requote will show applicable platform, payment, logistics, or
          verification fees before a user commits to a charge. Users are
          responsible for their own taxes and statutory obligations unless the
          law requires Requote or a payment partner to collect or withhold an
          amount.
        </p>
      </section>

      <section id="liability">
        <h2>10. Service availability and liability</h2>
        <p>
          Requote works to provide a reliable platform but cannot guarantee
          uninterrupted access or prevent every user dispute or loss. Nothing in
          these terms excludes liability that cannot legally be excluded. Any
          other limitations must be interpreted under applicable Nigerian law
          and the final regulated payment structure.
        </p>
      </section>

      <section id="termination">
        <h2>11. Suspension and termination</h2>
        <p>
          Requote may restrict or suspend an account to protect users, comply
          with law, investigate misuse, or address unpaid obligations. Where
          appropriate, we will explain the reason and provide a route to appeal.
          Active transaction obligations may continue after account closure.
        </p>
      </section>

      <section id="law">
        <h2>12. Governing law and contact</h2>
        <p>
          These terms are intended to be governed by the laws of the Federal
          Republic of Nigeria. The final dispute forum and company details will
          be inserted following legal review and incorporation confirmation.
        </p>
        <p>
          Questions may be sent to{" "}
          <a href="mailto:info@requote.cc">info@requote.cc</a>.
        </p>
      </section>
    </LegalPage>
  );
}
