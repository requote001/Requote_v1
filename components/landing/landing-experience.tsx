"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { HeroDemoGuide } from "./hero-demo-guide";
import "./landing-experience.css";
import {
  LandingPeople,
  LandingEscrow,
  LandingRoadmap,
} from "./landing-details";

const examples = [
  {
    label: "A website",
    category: "Digital services",
    title: "A website that feels like my business.",
    detail:
      "A 5-page website for a growing Lagos business. Clear, fast, and ready for customers.",
    location: "Lagos · Remote",
    budget: "₦400k–₦600k",
    price: 650000,
    counter: 550000,
    revised: 590000,
    initials: "NS",
    provider: "North Studio",
  },
  {
    label: "Fabrication",
    category: "Fabrication & welding",
    title: "A team to bring my space to life.",
    detail:
      "Custom steel partitions for a new café. Fabrication, finishing, and installation included.",
    location: "Abuja · On site",
    budget: "₦800k–₦1.2m",
    price: 1250000,
    counter: 1000000,
    revised: 1100000,
    initials: "FW",
    provider: "Form Works",
  },
  {
    label: "Photography",
    category: "Creative services",
    title: "Someone to capture the whole story.",
    detail:
      "Full-day wedding photography for 300 guests, with an edited digital gallery.",
    location: "Lagos · On site",
    budget: "₦500k–₦650k",
    price: 700000,
    counter: 600000,
    revised: 640000,
    initials: "LS",
    provider: "Light Studio",
  },
] as const;
type Example = (typeof examples)[number];
const money = (amount: number) => "₦" + amount.toLocaleString("en-NG");

const roles = [
  {
    name: "Clients",
    id: "requester",
    title: "The right people for what you have in mind.",
    text: "A better brief is the beginning of better work. Tell us the outcome you need, compare the details, and find your fit.",
    action: "Join as a client",
    image: "/people/collaboration.webp",
    alt: "Professionals reviewing a project brief together",
    tags: ["Clear briefs", "Comparable offers", "Your choice"],
    note: "For your next project, product, or big idea.",
  },
  {
    name: "Providers",
    id: "provider",
    title: "Less chasing leads. More showing what you do.",
    text: "You bring the expertise. We’re building a place where real needs come with the context to quote, connect, and do your best work.",
    action: "Join as a provider",
    image: "/people/photographer.webp",
    alt: "A photographer in her creative studio",
    tags: ["Relevant needs", "Clear scope", "Room to requote"],
    note: "For independent experts and growing businesses.",
  },
  {
    name: "Employers",
    id: "employer",
    title: "Good teams begin with a clearer connection.",
    text: "Tell us what you’re building and the people you need beside you. Help shape a more intentional way to find expertise and build teams.",
    action: "Join as an employer",
    image: "/people/collaboration.webp",
    alt: "A small team sharing ideas around a project plan",
    tags: ["Business context", "Relevant expertise", "Better conversations"],
    note: "Employer tools are an early-access development path.",
  },
  {
    name: "Professionals",
    id: "employee",
    title: "Make room for the work that fits you.",
    text: "Your experience is more than a job title. Build a profile around what you know, what you’ve done, and where you want to go next.",
    action: "Join as a professional",
    image: "/figma/fabrication.jpg",
    alt: "A professional using her expertise in the field",
    tags: ["Your experience", "Your direction", "Your next step"],
    note: "Career features are being shaped with our early community.",
  },
  {
    name: "Investors",
    id: "investor",
    title: "See the possibility in a better work network.",
    text: "Follow what we’re building and explore a strategic conversation around connecting demand, expertise, and opportunity in Nigeria.",
    action: "Explore the investor path",
    image: "/people/collaboration.webp",
    alt: "Professionals considering the next steps for a project",
    tags: [
      "A connected economy",
      "Long-term thinking",
      "Strategic partnerships",
    ],
    note: "An early-access interest path, not an investment offer.",
  },
] as const;

const categories = [
  {
    name: "Photography & events",
    image: "/people/photographer.webp",
    alt: "An independent photographer ready for her next project",
    detail: "Find the eye that sees what you have in mind.",
    number: "05",
  },
  {
    name: "Digital & creative",
    image: "/figma/skilled-trades.jpg",
    alt: "A digital design workspace",
    detail: "Build something that moves your business.",
    number: "01",
  },
  {
    name: "Fabrication & welding",
    image: "/figma/digital-services.jpg",
    alt: "Metal fabrication with sparks in a workshop",
    detail: "Turn a sketch into something real.",
    number: "02",
  },
  {
    name: "Skilled trades",
    image: "/figma/fabrication.jpg",
    alt: "An electrical professional at work",
    detail: "Find expertise where it matters.",
    number: "03",
  },
  {
    name: "Agriculture & supply",
    image: "/figma/agriculture.jpg",
    alt: "A cultivated agricultural field",
    detail: "Connect the needs that keep us growing.",
    number: "04",
  },
  {
    name: "Teams & professional services",
    image: "/people/collaboration.webp",
    alt: "A professional team developing a project together",
    detail: "Bring the right people around your next chapter.",
    number: "06",
  },
];

const chapters = [
  {
    word: "Request.",
    eyebrow: "01 / START WITH WHAT YOU NEED",
    title: "A little context. A much clearer beginning.",
    text: "Your idea doesn’t need to be perfectly written. Start with what you need, where you need it, and the outcome you have in mind.",
    note: "One brief. The important details, together.",
  },
  {
    word: "Compare.",
    eyebrow: "02 / SEE THE WHOLE PICTURE",
    title: "Look beyond the price tag.",
    text: "Different approaches deserve a clearer comparison. See scope, timing, and price side by side, then decide what actually works for you.",
    note: "Choose the fit. Not just the lowest number.",
  },
  {
    word: "Requote.",
    eyebrow: "03 / FIND YOUR COMMON GROUND",
    title: "There’s room for a better conversation.",
    text: "Need a different price, scope, or timeline? Request a requote. Keep the original terms and the next version in one connected story.",
    note: "Because the first quote doesn’t have to be the last word.",
  },
];

const questions = [
  [
    "What exactly is Requote?",
    "Requote is a professional network built around real needs. The marketplace journey starts with a request, continues through comparable offers and requotes, and keeps the important terms connected.",
  ],
  [
    "Can I start using it today?",
    "We’re in early access. Join the waitlist to tell us your role and interests. The product previews on this page illustrate the experience we’re building; they do not submit live requests or generate real provider offers.",
  ],
  [
    "Can I be a client and a provider?",
    "Yes. Requote is being designed around one account with multiple roles. You may need expertise for one project and offer your own for another.",
  ],
  [
    "Why the name Requote?",
    "A quote is the start of a conversation. A requote makes room to adjust scope, timing, or price while keeping the history clear. That is a central part of the experience we’re building.",
  ],
  [
    "What about payments and verification?",
    "Milestone escrow, identity checks, and evidence-based dispute support are planned features, not live services. Before launch, we will explain the payment partner, fees, release rules, review process, and eligibility. This page does not take deposits or guarantee payment protection.",
  ],
  [
    "How can employers and investors get involved?",
    "Choose your role in the early-access form. Employers and professionals can help shape the relevant work tools, while investors and strategic partners can register interest in a conversation about Requote’s development.",
  ],
] as const;

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {diagonal ? (
        <path d="M6 18 18 6M6 6h12v12" />
      ) : (
        <path d="M4 12h15m-6-6 6 6-6 6" />
      )}
    </svg>
  );
}

function ProductDemo({
  example,
  phase,
  onPhaseChange,
  playbackControl,
}: {
  example: Example;
  phase: number;
  onPhaseChange?: (phase: number) => void;
  playbackControl?: ReactNode;
}) {
  return (
    <div className="rq-demo">
      <div className="rq-demo__top">
        <img src="/requote-logo.png" width="99" height="30" alt="Requote" />
        {playbackControl}
      </div>
      <div className="rq-demo__steps" aria-label="Example product steps">
        {["Request", "Compare", "Requote"].map((label, index) =>
          onPhaseChange ? (
            <button
              key={label}
              type="button"
              onClick={() => onPhaseChange(index)}
              aria-pressed={phase === index}
              data-guide-target={index === 0 ? "request" : undefined}
            >
              <span>{index + 1}</span>
              {label}
            </button>
          ) : (
            <span className={phase === index ? "is-current" : ""} key={label}>
              <i>{index + 1}</i>
              {label}
            </span>
          ),
        )}
      </div>
      <div className="rq-demo__screen" key={example.label + phase}>
        {phase === 0 && (
          <>
            <h3>
              What do you have
              <br />
              in mind?
            </h3>
            <div className="rq-demo__request">
              <span>{example.category}</span>
              <strong>{example.title}</strong>
              <p>{example.detail}</p>
            </div>
            <div className="rq-demo__metadata">
              <span>
                <i aria-hidden="true">⌖</i>
                {example.location}
              </span>
              <span>{example.budget}</span>
            </div>
            <div className="rq-demo__detail">
              <span>Outcome</span>
              <strong>Clear scope. No guessing.</strong>
              <span>Your choice</span>
              <strong>Compare before you commit.</strong>
            </div>
          </>
        )}
        {phase === 1 && (
          <>
            <h3>
              More context.
              <br />
              Better decisions.
            </h3>
            <div className="rq-demo__offer">
              <div className="rq-demo__avatar">{example.initials}</div>
              <div>
                <strong>{example.provider}</strong>
                <span>Example provider · Full scope</span>
              </div>
              <b>{money(example.price)}</b>
            </div>
            <div className="rq-demo__offer rq-demo__offer--secondary">
              <div className="rq-demo__avatar">FC</div>
              <div>
                <strong>Folio Collective</strong>
                <span>Example provider · Flexible timing</span>
              </div>
              <b>{money(Math.round(example.price * 1.12))}</b>
            </div>
            <div className="rq-demo__comparison">
              <span>Compare the details</span>
              <p>
                Scope <i>✓</i>
              </p>
              <p>
                Timing <i>✓</i>
              </p>
              <p>
                Total price <i>✓</i>
              </p>
            </div>
          </>
        )}
        {phase === 2 && (
          <>
            <h3>
              A better fit?
              <br />
              Let’s requote.
            </h3>
            <div className="rq-demo__negotiation">
              <div>
                <span>Original offer</span>
                <strong>{money(example.price)}</strong>
              </div>
              <div>
                <span>Your counter</span>
                <strong>{money(example.counter)}</strong>
              </div>
              <div>
                <span>
                  <i />
                  Provider’s requote
                </span>
                <strong>{money(example.revised)}</strong>
              </div>
            </div>
            <div className="rq-demo__history">
              <span aria-hidden="true">↳</span>
              <p>
                Every version stays in the story.
                <br />
                <strong>Clear terms. A shared next step.</strong>
              </p>
            </div>
          </>
        )}
      </div>
      {onPhaseChange && (
        <button
          className="rq-demo__next"
          data-guide-target="next"
          type="button"
          onClick={() => onPhaseChange(phase === 2 ? 0 : phase + 1)}
        >
          {phase === 0
            ? "See example offers"
            : phase === 1
              ? "Try a requote"
              : "Start the story again"}
          <Arrow />
        </button>
      )}
      <p className="rq-demo__disclaimer">
        Illustrative profiles and prices. No request is submitted.
      </p>
    </div>
  );
}

function useLandingMotion(
  root: React.RefObject<HTMLDivElement | null>,
  onChapter: (chapter: number) => void,
) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const configure = () => {
      element.setAttribute("data-motion", media.matches ? "off" : "on");
    };
    configure();
    media.addEventListener("change", configure);
    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            reveal.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    element
      .querySelectorAll("[data-reveal]")
      .forEach((target) => reveal.observe(target));
    const chaptersObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            onChapter(Number(entry.target.getAttribute("data-chapter")));
        }),
      { rootMargin: "-30% 0px -35% 0px", threshold: 0 },
    );
    element
      .querySelectorAll("[data-chapter]")
      .forEach((target) => chaptersObserver.observe(target));
    const update = () => {
      frame = 0;
      const total = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      element.style.setProperty(
        "--rq-progress",
        String(window.scrollY / total),
      );
      element.setAttribute("data-scrolled", String(window.scrollY > 25));
      if (!media.matches)
        element.style.setProperty(
          "--rq-hero-progress",
          String(Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1)),
        );
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    update();
    return () => {
      cancelAnimationFrame(frame);
      reveal.disconnect();
      chaptersObserver.disconnect();
      media.removeEventListener("change", configure);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
    };
  }, [root, onChapter]);
}

export default function LandingExperience() {
  const root = useRef<HTMLDivElement>(null);
  const categoryRail = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [demoPhase, setDemoPhase] = useState(0);
  const [chapter, setChapter] = useState(0);
  const [role, setRole] = useState(0);
  const [railEdges, setRailEdges] = useState({ start: true, end: false });
  useLandingMotion(root, setChapter);

  useEffect(() => {
    const rail = categoryRail.current;
    if (!rail) return;
    const update = () =>
      setRailEdges({
        start: rail.scrollLeft < 2,
        end: rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2,
      });
    const observer = new ResizeObserver(update);
    observer.observe(rail);
    Array.from(rail.children).forEach((card) => observer.observe(card));
    const frame = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    rail.addEventListener("load", update, true);
    rail.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", update);
      rail.removeEventListener("load", update, true);
      rail.removeEventListener("scroll", update);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    const outside = (event: globalThis.PointerEvent) => {
      if (
        !nav.current?.contains(event.target as Node) &&
        !menuButton.current?.contains(event.target as Node)
      )
        setMenuOpen(false);
    };
    window.addEventListener("keydown", keydown);
    window.addEventListener("pointerdown", outside);
    return () => {
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("pointerdown", outside);
    };
  }, [menuOpen]);

  function moveScene(event: PointerEvent<HTMLDivElement>) {
    if (
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--scene-x",
      ((event.clientX - bounds.left) / bounds.width - 0.5) * 3 + "deg",
    );
    event.currentTarget.style.setProperty(
      "--scene-y",
      -((event.clientY - bounds.top) / bounds.height - 0.5) * 2 + "deg",
    );
  }
  function resetScene(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--scene-x", "0deg");
    event.currentTarget.style.setProperty("--scene-y", "0deg");
  }
  function moveCategories(direction: number) {
    categoryRail.current?.scrollBy({
      left: direction * categoryRail.current.clientWidth * 0.7,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  const selectedRole = roles[role];

  return (
    <div className="rq-landing" ref={root} id="top">
      <a className="rq-skip" href="#rq-main">
        Skip to content
      </a>
      <header className="rq-header">
        <div className="rq-shell rq-header__inner">
          <Link className="rq-brand" href="/" aria-label="Requote home">
            <img
              src="/requote-logo.png"
              alt="Requote"
              width="126"
              height="38"
            />
          </Link>
          <nav
            ref={nav}
            id="rq-navigation"
            aria-label="Main navigation"
            className={menuOpen ? "rq-navigation is-open" : "rq-navigation"}
          >
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
              The experience
            </a>
            <a href="#paths" onClick={() => setMenuOpen(false)}>
              Made for you
            </a>
            <a href="#trust" onClick={() => setMenuOpen(false)}>
              Our approach
            </a>
            <a href="#escrow" onClick={() => setMenuOpen(false)}>
              Escrow
            </a>
            <Link className="rq-mobile-login" href="/login">
              Log in <Arrow />
            </Link>
          </nav>
          <div className="rq-header__actions">
            <Link className="rq-login-link" href="/login">
              Log in
            </Link>
            <Link
              className="rq-button rq-button--small"
              href="/waitlist?source=landing-header"
            >
              Get early access <Arrow diagonal />
            </Link>
            <button
              ref={menuButton}
              type="button"
              className="rq-menu-toggle"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              aria-controls="rq-navigation"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
        <div className="rq-reading-progress" aria-hidden="true" />
      </header>

      <main id="rq-main">
        <section className="rq-hero rq-shell" aria-labelledby="rq-title">
          <div className="rq-hero__copy">
            <h1 id="rq-title">
              Less chasing.
              <br />
              More <span>possibility.</span>
            </h1>
            <p className="rq-hero__lede">
              The expertise you need. The work you want.
              <br className="rq-desktop-break" /> A clearer way to bring them
              together.
            </p>
            <div className="rq-hero__actions">
              <Link href="/waitlist?source=landing-hero" className="rq-button">
                Find your next move <Arrow diagonal />
              </Link>
              <a className="rq-text-link" href="#how-it-works">
                See how it comes together <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className="rq-hero__note">
              <span className="rq-small-mark">
                <img src="/requote-mark.png" alt="" width="20" height="20" />
              </span>
              <p>
                Built around real needs.
                <br />
                <strong>Opening early access in Nigeria.</strong>
              </p>
            </div>
          </div>
          <div className="rq-hero__playground">
            <div
              className="rq-scene"
              onPointerMove={moveScene}
              onPointerLeave={resetScene}
            >
              <div className="rq-scene__card">
                <HeroDemoGuide phase={demoPhase} onPhaseChange={setDemoPhase}>
                  {(playbackControl) => (
                    <ProductDemo
                      example={examples[0]}
                      phase={demoPhase}
                      onPhaseChange={setDemoPhase}
                      playbackControl={playbackControl}
                    />
                  )}
                </HeroDemoGuide>
              </div>
            </div>
          </div>
        </section>

        <LandingPeople />

        <section
          className="rq-story"
          id="how-it-works"
          aria-label="The Requote experience"
        >
          <div className="rq-shell rq-story__layout">
            <div className="rq-story__chapters">
              {chapters.map((item, index) => (
                <article
                  className={
                    chapter === index ? "rq-chapter is-active" : "rq-chapter"
                  }
                  key={item.word}
                  id={"rq-chapter-" + index}
                  data-chapter={index}
                >
                  <div className="rq-chapter__word" aria-hidden="true">
                    {item.word}
                  </div>
                  <h2>{item.title}</h2>
                  <p>{item.text}</p>
                  <span className="rq-chapter__note">
                    <i />
                    {item.note}
                  </span>
                  <div className="rq-story__mobile-preview">
                    <ProductDemo example={examples[0]} phase={index} />
                  </div>
                </article>
              ))}
            </div>
            <div className="rq-story__sticky">
              <div className="rq-story__demo">
                <ProductDemo example={examples[0]} phase={chapter} />
              </div>
              <div
                className="rq-story__progress"
                aria-label="Current story chapter"
              >
                {chapters.map((item, index) => (
                  <a
                    href={"#rq-chapter-" + index}
                    key={item.word}
                    aria-label={"Read about " + item.word.replace(".", "")}
                    aria-current={chapter === index ? "step" : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      const target = root.current?.querySelector(
                        `[data-chapter="${index}"]`,
                      );
                      target?.scrollIntoView({
                        behavior: window.matchMedia(
                          "(prefers-reduced-motion: reduce)",
                        ).matches
                          ? "instant"
                          : "smooth",
                        block: "center",
                      });
                    }}
                  >
                    <span />
                    {String(index + 1).padStart(2, "0")}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <p className="rq-story__footnote rq-shell">
            A look at the experience we’re building. Join early access to help
            shape what comes next.
          </p>
        </section>

        <section className="rq-roles rq-shell" id="paths">
          <div className="rq-section-top" data-reveal>
            <h2>
              You don’t fit in one box.
              <br />
              <span>Neither should your network.</span>
            </h2>
          </div>
          <div
            className="rq-role-selector"
            aria-label="Choose your Requote role"
          >
            {roles.map((item, index) => (
              <button
                type="button"
                aria-pressed={role === index}
                aria-controls="rq-role-panel"
                onClick={() => setRole(index)}
                key={item.id}
              >
                {item.name}
                <Arrow diagonal />
              </button>
            ))}
          </div>
          <div
            className="rq-role-panel"
            id="rq-role-panel"
            key={selectedRole.id}
          >
            <div className="rq-role-panel__copy">
              <h3>{selectedRole.title}</h3>
              <p>{selectedRole.text}</p>
              <Link
                className="rq-text-link"
                href={
                  "/waitlist?role=" + selectedRole.id + "&source=landing-role"
                }
              >
                {selectedRole.action}
                <Arrow diagonal />
              </Link>
              <small>{selectedRole.note}</small>
            </div>
            <div className="rq-role-panel__image">
              <img
                src={selectedRole.image}
                alt={selectedRole.alt}
                loading="lazy"
                width="512"
                height="286"
              />
            </div>
          </div>
        </section>

        <section className="rq-categories" id="categories">
          <div className="rq-shell">
            <div className="rq-category-heading" data-reveal>
              <div>
                <h2>
                  Real needs.
                  <br />
                  <span>Real-world possibility.</span>
                </h2>
              </div>
              <div>
                <p>
                  From a better website to a beautifully built space.
                  <br />A good connection can change what comes next.
                </p>
                <div className="rq-rail-controls">
                  <button
                    type="button"
                    aria-label="Previous categories"
                    disabled={railEdges.start}
                    onClick={() => moveCategories(-1)}
                  >
                    <Arrow />
                  </button>
                  <button
                    type="button"
                    aria-label="Next categories"
                    disabled={railEdges.end}
                    onClick={() => moveCategories(1)}
                  >
                    <Arrow />
                  </button>
                </div>
              </div>
            </div>
            <div
              className="rq-category-rail"
              ref={categoryRail}
              tabIndex={0}
              role="region"
              aria-label="Explore work categories"
            >
              {categories.map((item) => (
                <Link
                  className="rq-category"
                  href={
                    "/waitlist?role=requester&source=landing-category&category=" +
                    encodeURIComponent(item.name)
                  }
                  key={item.name}
                >
                  <div className="rq-category__image">
                    <img
                      src={item.image}
                      alt={item.alt}
                      loading="lazy"
                      width="512"
                      height="286"
                    />
                    <i>
                      <Arrow diagonal />
                    </i>
                  </div>
                  <h3>{item.name}</h3>
                  <p>{item.detail}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <LandingEscrow />

        <section className="rq-trust" id="trust">
          <div className="rq-shell rq-trust__layout">
            <div className="rq-trust__copy" data-reveal>
              <h2>
                Big on possibility.
                <br />
                <span>Grounded in trust.</span>
              </h2>
              <p>
                Good connections need more than a handshake. We’re building
                Requote around clear expectations, considered decisions, and a
                record everyone can understand.
              </p>
              <Link href="/trust-safety" className="rq-text-link">
                Our approach to trust <Arrow diagonal />
              </Link>
            </div>
            <div className="rq-trust__principles">
              {[
                {
                  n: "01",
                  title: "Know what you’re agreeing to.",
                  text: "A clear brief and comparable terms, before the next step.",
                },
                {
                  n: "02",
                  title: "Keep the important details.",
                  text: "Requests, offers, and requotes belong in the same story.",
                },
                {
                  n: "03",
                  title: "Support grounded in evidence.",
                  text: "We’re planning a dispute-review process built around agreed scope, messages, and delivery evidence, with human review.",
                },
              ].map((item, index) => (
                <article
                  key={item.n}
                  data-reveal
                  style={{ "--rq-delay": index * 80 + "ms" } as CSSProperties}
                >
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                  <Arrow diagonal />
                </article>
              ))}
            </div>
          </div>
        </section>

        <LandingRoadmap />

        <section className="rq-faq rq-shell" id="faq">
          <div data-reveal>
            <h2>
              A little more
              <br />
              <span>context.</span>
            </h2>
            <p>
              Still have a question?
              <br />
              <a href="mailto:info@requote.cc">
                Let’s talk <Arrow diagonal />
              </a>
            </p>
          </div>
          <div className="rq-faq__items">
            {questions.map(([question, answer]) => (
              <details key={question} name="rq-faq">
                <summary>
                  <h3>{question}</h3>
                  <span className="rq-faq__toggle" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rq-closing">
          <div className="rq-shell rq-closing__inner">
            <h2>
              Your next move
              <br />
              could change <span>everything.</span>
            </h2>
            <div>
              <Link
                className="rq-button rq-button--white"
                href="/waitlist?source=landing-closing"
              >
                Let’s find out <Arrow diagonal />
              </Link>
              <p>
                Join the early-access community.
                <br />
                Help shape a clearer way to work.
              </p>
            </div>
            <span className="rq-closing__symbol" aria-hidden="true">
              ↗
            </span>
          </div>
        </section>
      </main>

      <footer className="rq-footer rq-shell">
        <div className="rq-footer__top">
          <div>
            <Link className="rq-brand" href="/" aria-label="Requote home">
              <img
                src="/requote-logo.png"
                alt="Requote"
                width="142"
                height="43"
              />
            </Link>
            <p>
              A clearer connection
              <br />
              to what comes next.
            </p>
            <a className="rq-footer__email" href="mailto:info@requote.cc">
              info@requote.cc <Arrow diagonal />
            </a>
          </div>
          <div>
            <h3>Discover</h3>
            <a href="#how-it-works">The experience</a>
            <a href="#paths">Find your role</a>
            <Link href="/how-it-works">How it works</Link>
            <Link href="/waitlist">Early access</Link>
          </div>
          <div>
            <h3>Requote</h3>
            <Link href="/trust-safety">Trust &amp; safety</Link>
            <a href="#escrow">Milestone escrow</a>
            <a href="#building-next">What we’re building</a>
            <Link href="/login">Log in</Link>
            <a href="mailto:info@requote.cc">Get in touch</a>
            <Link href="/waitlist?role=investor&source=landing-footer">
              Investors &amp; partners
            </Link>
          </div>
          <div>
            <h3>The details</h3>
            <Link href="/terms">Terms of service</Link>
            <Link href="/privacy">Privacy policy</Link>
            <Link href="/cookies">Cookie policy</Link>
            <a href="#faq">Questions &amp; answers</a>
          </div>
        </div>
        <div className="rq-footer__bottom">
          <span>
            © {new Date().getFullYear()} Requote. All rights reserved.
          </span>
          <span>Built for possibility. Starting in Nigeria.</span>
          <a href="#top">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
        <div className="rq-footer__wordmark" aria-hidden="true">
          Requote<span>↗</span>
        </div>
      </footer>
    </div>
  );
}
