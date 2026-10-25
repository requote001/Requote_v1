"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import "./landing-details.css";

function Direction() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </svg>
  );
}
function Shield() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="25"
      height="25"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z" />
      <path d="m8 12 3 3 5-6" />
    </svg>
  );
}

const perspectives = [
  {
    label: "An idea worth bringing to life",
    title: "You see the possibility. Find the people who do, too.",
    text: "A new space. A growing business. A project you’ve been putting off. Start with what you need and give the right people a clearer way to help.",
    image: "/people/collaboration.webp",
    alt: "Three professionals considering an architectural project together",
    action: "Find your people",
    role: "requester",
  },
  {
    label: "A craft worth being seen",
    title: "Your expertise deserves more than another cold lead.",
    text: "Whether you create, build, consult, or deliver, show the work behind your name. We’re creating a place for better briefs and more relevant conversations.",
    image: "/people/photographer.webp",
    alt: "A photographer holding her camera in a bright creative studio",
    action: "Bring your expertise",
    role: "provider",
  },
  {
    label: "A next chapter worth exploring",
    title: "Make room for the work that moves you forward.",
    text: "Connect your experience with the people building something meaningful. Employers and professionals can help shape the next generation of Requote’s work tools.",
    image: "/figma/fabrication.jpg",
    alt: "A skilled electrical professional working on an installation",
    action: "Shape your next chapter",
    role: "employee",
  },
];

export function LandingPeople() {
  const [selected, setSelected] = useState(0);
  const photoRef = useRef<HTMLElement>(null);
  function selectPerspective(index: number) {
    setSelected(index);
    if (window.matchMedia("(max-width: 620px)").matches) {
      requestAnimationFrame(() =>
        photoRef.current?.scrollIntoView({
          block: "start",
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        }),
      );
    }
  }
  const item = perspectives[selected];
  return (
    <section
      className="rq-community rq-shell"
      id="people"
      aria-labelledby="rq-people-title"
    >
      <div className="rq-community__heading" data-reveal>
        <h2 id="rq-people-title">
          Behind every brief,
          <br />
          <span>there’s a person.</span>
        </h2>
        <p>
          People with ideas. People with expertise. People ready for a different
          kind of opportunity. That’s who we’re building Requote for.
        </p>
      </div>
      <div className="rq-community__layout">
        <div className="rq-community__copy">
          <div
            className="rq-perspectives"
            role="group"
            aria-label="Explore the people behind the work"
          >
            {perspectives.map((perspective, index) => (
              <button
                key={perspective.role}
                type="button"
                aria-pressed={selected === index}
                aria-controls="rq-person-story"
                onClick={() => selectPerspective(index)}
              >
                {perspective.label}
                <Direction />
              </button>
            ))}
          </div>
          <div className="rq-person-story" id="rq-person-story" key={item.role}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <Link
              className="rq-text-link"
              href={`/waitlist?role=${item.role}&source=landing-people`}
            >
              {item.action}
              <Direction />
            </Link>
          </div>
        </div>
        <figure className="rq-community__photo" ref={photoRef}>
          <img
            key={item.image}
            src={item.image}
            alt={item.alt}
            width="1400"
            height="900"
            loading="lazy"
          />
        </figure>
      </div>
    </section>
  );
}

const escrowSteps = [
  {
    label: "Agree on the scope",
    text: "Decide what’s included, what success looks like, and when each milestone is due.",
    title: "A shared starting point.",
    detail:
      "The proposed agreement would bring deliverables, timing, and the release conditions together before funding.",
    stage: "Agreement",
    rows: [
      "Event coverage and edited gallery",
      "Delivery date agreed by both sides",
      "Acceptance criteria recorded",
    ],
  },
  {
    label: "Fund the milestone",
    text: "The client would fund the agreed milestone through an integrated payment partner.",
    title: "A commitment to the work.",
    detail:
      "The planned flow would hold milestone funds with a payment partner until the applicable release conditions are met.",
    stage: "Funding",
    rows: [
      "Payment handled by a partner",
      "Milestone linked to the agreement",
      "No release just for starting work",
    ],
  },
  {
    label: "Deliver and review",
    text: "The provider submits the work. The client checks it against the agreed brief.",
    title: "Make the outcome visible.",
    detail:
      "Files, delivery notes, and feedback would stay connected to the milestone, with a route to request changes or raise a dispute.",
    stage: "Review",
    rows: [
      "Delivery evidence attached",
      "Review against the agreed scope",
      "Questions and changes documented",
    ],
  },
  {
    label: "Approve the release",
    text: "Client approval would authorise release, subject to the published rules and review process.",
    title: "A clearer finish for both sides.",
    detail:
      "Release rules, review windows, dispute handling, fees, and eligibility will be published before this feature launches.",
    stage: "Release",
    rows: [
      "Approval recorded in the work history",
      "Release follows published conditions",
      "A review path if there’s a disagreement",
    ],
  },
];

export function LandingEscrow() {
  const [step, setStep] = useState(0);
  const exampleRef = useRef<HTMLDivElement>(null);
  function selectStep(index: number) {
    setStep(index);
    if (window.matchMedia("(max-width: 620px)").matches) {
      requestAnimationFrame(() =>
        exampleRef.current?.scrollIntoView({
          block: "start",
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        }),
      );
    }
  }
  const current = escrowSteps[step];
  return (
    <section
      className="rq-escrow"
      id="escrow"
      aria-labelledby="rq-escrow-title"
    >
      <div className="rq-shell">
        <div className="rq-escrow__heading" data-reveal>
          <h2 id="rq-escrow-title">
            Good work deserves
            <br />
            <span>a clearer agreement.</span>
          </h2>
          <div>
            <p>
              We’re planning milestone escrow to bring more structure to how
              work gets funded, reviewed, and paid for. A clearer next step for
              the client. A clearer commitment for the provider.
            </p>
            <small>In development. Explore the proposed flow below.</small>
          </div>
        </div>
        <div className="rq-escrow__layout">
          <div
            className="rq-escrow__steps"
            role="group"
            aria-label="Explore the planned escrow workflow"
          >
            {escrowSteps.map((item, index) => (
              <button
                key={item.label}
                type="button"
                aria-pressed={step === index}
                aria-controls="rq-escrow-example"
                onClick={() => selectStep(index)}
              >
                <span className="rq-escrow__step-number">{index + 1}</span>
                <span>
                  <strong>{item.label}</strong>
                  <span>{item.text}</span>
                </span>
                <Direction />
              </button>
            ))}
          </div>
          <div
            className="rq-escrow-example"
            id="rq-escrow-example"
            ref={exampleRef}
          >
            <div className="rq-escrow-example__top">
              <Shield />
              <span>Milestone escrow</span>
              <small>Concept</small>
            </div>
            <div className="rq-escrow-example__amount">
              <span>Example milestone · Photography</span>
              <strong>₦600,000</strong>
              <span>One scope. One shared record.</span>
            </div>
            <div className="rq-escrow-example__track" aria-hidden="true">
              {escrowSteps.map((item, index) => (
                <span
                  className={index <= step ? "is-current" : ""}
                  key={item.stage}
                >
                  {item.stage}
                  <i />
                </span>
              ))}
            </div>
            <div className="rq-escrow-example__content" key={step}>
              <h3 aria-live="polite">{current.title}</h3>
              <p>{current.detail}</p>
              <ul>
                {current.rows.map((row) => (
                  <li key={row}>
                    <span aria-hidden="true">✓</span>
                    {row}
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="rq-escrow-example__next"
              type="button"
              onClick={() => setStep(step === 3 ? 0 : step + 1)}
            >
              {step === 3
                ? "Explore the flow again"
                : `Next: ${escrowSteps[step + 1].label.toLowerCase()}`}
              <Direction />
            </button>
          </div>
        </div>
        <div className="rq-escrow__foot">
          <p>
            <Shield />
            <span>
              Clear milestones, delivery evidence, and a human-reviewed dispute
              path are part of the plan.
            </span>
          </p>
          <small>
            Illustrative only. No money is deposited, held, or released here.
            Escrow is not currently available; payment-partner arrangements and
            final terms are still to be confirmed.
          </small>
        </div>
      </div>
    </section>
  );
}

const roadmap = [
  {
    title: "Describe the need. Skip the long form.",
    text: "A planned AI request assistant will help turn a natural-language description into a draft brief, identify important missing details, and let you confirm everything before posting. Your intent stays in your hands.",
  },
  {
    title: "Better matches. Clearer comparisons.",
    text: "We’re exploring matching around category, location, availability, budget, and relevant experience, alongside offer comparisons that explain factual differences in scope, timing, and price—not a black-box decision about who you should choose.",
  },
  {
    title: "A business workspace that works with you.",
    text: "Providers should be able to track opportunities, organise quotes and requotes, and see what needs a response. A future business assistant could help prepare offer drafts and surface useful insights from their own activity.",
  },
  {
    title: "A network with room to grow.",
    text: "We’re shaping profiles around work, experience, and professional direction, with paths for team-building, career opportunities, and strategic investor conversations. One account should be able to support more than one role.",
  },
  {
    title: "Keep the conversation moving.",
    text: "In-app and email updates are planned to connect requests, offers, requotes, and milestones. Optional WhatsApp notifications are a later possibility, with clear consent and notification preferences.",
  },
];

export function LandingRoadmap() {
  return (
    <section
      className="rq-future rq-shell"
      id="building-next"
      aria-labelledby="rq-future-title"
    >
      <div className="rq-future__intro" data-reveal>
        <h2 id="rq-future-title">
          A smarter way
          <br />
          to <span>move work forward.</span>
        </h2>
        <p>
          Our direction is bigger than a single request. We’re building toward a
          connected workspace that understands the brief, brings the right
          people together, and keeps the important details in reach.
        </p>
        <p className="rq-future__availability">
          These are planned capabilities, not live features. We’ll introduce
          them in stages, shaped by what our early community needs most.
        </p>
        <Link className="rq-text-link" href="/waitlist?source=landing-roadmap">
          Help shape what comes next
          <Direction />
        </Link>
        <figure>
          <img
            src="/people/collaboration.webp"
            alt="A team exchanging ideas around an architectural project"
            width="1400"
            height="788"
            loading="lazy"
          />
        </figure>
      </div>
      <div className="rq-future__features">
        {roadmap.map((item, index) => (
          <details key={item.title} name="rq-roadmap" open={index === 0}>
            <summary>
              <h3>{item.title}</h3>
              <span aria-hidden="true">+</span>
            </summary>
            <p>{item.text}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
