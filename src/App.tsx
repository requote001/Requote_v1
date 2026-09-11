"use client";

import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

const earlyAccessLink = "/waitlist";
const requesterLink = "/post-a-request?journey=request";
const providerLink = "/waitlist?role=provider&source=landing-provider";
const employerLink = "/waitlist?role=employer&source=landing-employer";
const employeeLink = "/waitlist?role=employee&source=landing-employee";
const investorLink = "/waitlist?role=investor&source=landing-investor";

const requestExamples = [
  "Commercial welding service",
  "2,000 branded uniforms",
  "Warehouse security system",
  "Business website redesign",
];

function useTypingSequence(phrases: string[]) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [visibleLength, setVisibleLength] = useState(() =>
    reduceMotion ? phrases[0].length : 0,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];

    if (reduceMotion) return;

    const isComplete = visibleLength === currentPhrase.length;
    const isEmpty = visibleLength === 0;
    const delay = isDeleting ? (isEmpty ? 260 : 32) : isComplete ? 1600 : 58;

    const timeout = window.setTimeout(() => {
      if (!isDeleting && isComplete) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && isEmpty) {
        setIsDeleting(false);
        setPhraseIndex((index) => (index + 1) % phrases.length);
        return;
      }

      setVisibleLength((length) => length + (isDeleting ? -1 : 1));
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [isDeleting, phraseIndex, phrases, reduceMotion, visibleLength]);

  return phrases[phraseIndex].slice(0, visibleLength);
}

function moveDealVisual(event: ReactPointerEvent<HTMLDivElement>) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const bounds = event.currentTarget.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;
  const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 8;

  event.currentTarget.style.setProperty("--pointer-x", `${x.toFixed(2)}px`);
  event.currentTarget.style.setProperty("--pointer-y", `${y.toFixed(2)}px`);
  event.currentTarget.style.setProperty(
    "--back-x",
    `${(-x * 0.45).toFixed(2)}px`,
  );
  event.currentTarget.style.setProperty(
    "--back-y",
    `${(-y * 0.45).toFixed(2)}px`,
  );
}

function resetDealVisual(event: ReactPointerEvent<HTMLDivElement>) {
  event.currentTarget.style.setProperty("--pointer-x", "0px");
  event.currentTarget.style.setProperty("--pointer-y", "0px");
  event.currentTarget.style.setProperty("--back-x", "0px");
  event.currentTarget.style.setProperty("--back-y", "0px");
}

function AssetIcon({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  return (
    <img
      className={"asset-icon " + className}
      src={src}
      alt=""
      aria-hidden="true"
    />
  );
}

function Logo() {
  return (
    <a className="brand-logo" href="#top" aria-label="Requote home">
      <img src="/requote-logo.png" alt="" />
    </a>
  );
}

const processSteps = [
  [
    "01",
    "Post a request",
    "Tell us exactly what you need, where you need it, and when.",
    "/figma/icon-01.svg",
  ],
  [
    "02",
    "Receive offers",
    "Capable providers respond with their pricing, plan, and timing.",
    "/figma/icon-02.svg",
  ],
  [
    "03",
    "Choose a provider",
    "Compare offers, provider history, and the details that matter.",
    "/figma/icon-03.svg",
  ],
  [
    "04",
    "Secure payment",
    "Your payment is held in escrow against the agreed scope.",
    "/figma/icon-04.svg",
  ],
  [
    "05",
    "Receive delivery",
    "The provider completes the work or delivers the agreed product.",
    "/figma/icon-05.svg",
  ],
  [
    "06",
    "Confirm & release",
    "Confirm the result and release payment, or raise an issue.",
    "/figma/icon-06.svg",
  ],
];

const categories = [
  ["Agriculture", "/figma/agriculture.jpg", "A green agricultural field"],
  ["Fabrication", "/figma/digital-services.jpg", "A fabrication workshop"],
  [
    "Skilled Trades",
    
    "/figma/fabrication.jpg",
    "A skilled professional at work",
  ],
  [
    "Digital Services",
    "/figma/skilled-trades.jpg",
    "A digital services workspace",
  ],
];

const faqs = [
  [
    "What is Requote?",
    "Requote is a request-and-offer marketplace. You describe what you need, capable providers submit offers, and you choose the option that best matches your requirements.",
  ],
  [
    "How does escrow work?",
    "Once both sides agree on scope, price, and timing, funds are held within the protected transaction process and released when the agreed outcome is confirmed.",
  ],
  [
    "What happens if the delivery is not what we agreed?",
    "The original request, accepted offer, messages, and delivery evidence establish the agreement. Those records support a fair review when an issue is raised.",
  ],
  [
    "Can I be both a requester and a provider?",
    "Yes. Requote is designed so one account can request products or services and also provide work where the user is qualified.",
  ],
  [
    "Can employers, professionals, and investors join?",
    "Yes. Requote is opening dedicated early-access paths for employers building teams, professionals looking for meaningful work, and investors or partners following the network’s growth.",
  ],
  [
    "Does Requote provide delivery?",
    "Both parties may use their own transport arrangement or select Requote logistics partners where that option is available.",
  ],
];

const audiencePaths = [
  {
    number: "01",
    label: "Clients",
    title: "Turn a need into a clear brief.",
    copy: "Describe the outcome, compare capable offers, and keep every important detail visible.",
    action: "Start a request",
    href: requesterLink,
    tone: "client",
    featured: true,
  },
  {
    number: "02",
    label: "Providers",
    title: "Put expertise where it matters.",
    copy: "Join a network built around more context, more credible work, and clearer expectations.",
    action: "Join as a provider",
    href: providerLink,
    tone: "provider",
    featured: true,
  },
  {
    number: "03",
    label: "Employers",
    title: "Build teams with more intention.",
    copy: "Help shape how Requote supports the employers and roles that keep businesses moving.",
    action: "Join as an employer",
    href: employerLink,
    tone: "employer",
  },
  {
    number: "04",
    label: "Professionals",
    title: "Find work with a clearer fit.",
    copy: "Tell us your area, goals, and the opportunities you want to see more of.",
    action: "Join as a professional",
    href: employeeLink,
    tone: "employee",
  },
  {
    number: "05",
    label: "Investors",
    title: "See what a stronger work network can unlock.",
    copy: "Follow Requote’s early growth and explore strategic ways to support the ecosystem.",
    action: "Explore the investor path",
    href: investorLink,
    tone: "investor",
  },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const typedRequest = useTypingSequence(requestExamples);
  const currentYear = new Date().getFullYear();
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.body.classList.add("menu-open");
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <div className="site" id="top">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="topbar">
        <div className="layout topbar__inner">
          <Logo />
          <nav
            className={"desktop-nav " + (menuOpen ? "desktop-nav--open" : "")}
            id="main-navigation"
            aria-label="Main navigation"
          >
            <a className="is-active" href="#top" onClick={closeMenu}>
              Home
            </a>
            <a href="#how-it-works" onClick={closeMenu}>
              How it works
            </a>
            <a href="#paths" onClick={closeMenu}>
              Who it&apos;s for
            </a>
            <a href="#trust" onClick={closeMenu}>
              Trust &amp; safety
            </a>
            <div className="mobile-nav-actions">
              <a className="text-button" href={earlyAccessLink}>
                Join waitlist
              </a>
              <a className="button button--primary" href="#paths">
                Choose your path
              </a>
            </div>
          </nav>
          <div className="topbar__actions">
            <a className="text-button" href={earlyAccessLink}>
              Join waitlist
            </a>
            <a
              className="button button--primary button--compact"
              href="#paths"
            >
              Choose your path
            </a>
          </div>
          <button
            className={"menu-button " + (menuOpen ? "menu-button--open" : "")}
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-controls="main-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>
      {menuOpen && (
        <button
          className="nav-backdrop"
          type="button"
          aria-label="Close navigation"
          onClick={closeMenu}
        />
      )}

      <main id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="layout hero__inner">
            <div className="hero__content">
              <p className="pill">
                <AssetIcon src="/figma/badge-escrow.svg" />
                Work, talent &amp; opportunity
              </p>
              <h1 id="hero-title">
                Build better work connections.<span>Move forward with clarity.</span>
              </h1>
              <p className="hero__lead">
                Requote brings clients, providers, employers, professionals,
                and investors into a clearer network for work, growth, and
                trusted opportunity.
              </p>
              <div className="hero__actions">
                <a
                  className="button button--primary button--wide"
                  href="#paths"
                >
                  Find your path
                  <AssetIcon src="/figma/arrow.svg" className="button__arrow" />
                </a>
                <a
                  className="button button--outline button--wide"
                  href={requesterLink}
                >
                  Start a request
                </a>
              </div>
            </div>
            <div
              className="deal-visual"
              role="img"
              aria-label="An example provider offer protected by Requote escrow"
              onPointerMove={moveDealVisual}
              onPointerLeave={resetDealVisual}
            >
              <div className="deal-visual__skeleton" aria-hidden="true">
                <span />
                <div>
                  <i />
                  <i />
                </div>
              </div>
              <article className="offer-preview">
                <div className="offer-preview__head">
                  <span className="offer-preview__avatar">
                    <AssetIcon src="/figma/hero-provider.svg" />
                  </span>
                  <div>
                    <strong>Aliyu Agro Supplies</strong>
                    <small>4.9 (12 reviews)</small>
                  </div>
                  <b>₦1.2M</b>
                </div>
                <p>
                  Can deliver to Kano by Friday. Premium quality guaranteed.
                </p>
                <div className="escrow-ready">
                  <AssetIcon src="/figma/lock.svg" />
                  <span>
                    <strong>Escrow Ready:</strong> Funds protected until
                    delivery confirmed.
                  </span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="How Requote works">
          <div className="layout trust-strip__grid">
            <article>
              <span className="round-icon">
                <AssetIcon src="/figma/trust-describe.svg" />
              </span>
              <h2>Describe what you need</h2>
              <p>
                Post your exact specifications, location, and optional budget in
                minutes.
              </p>
            </article>
            <article>
              <span className="round-icon">
                <AssetIcon src="/figma/trust-compare.svg" />
              </span>
              <h2>Compare provider offers</h2>
              <p>
                Review bids from capable providers, check their history, and
                choose the best fit.
              </p>
            </article>
            <article>
              <span className="round-icon">
                <AssetIcon src="/figma/trust-protect.svg" />
              </span>
              <h2>Pay through protection</h2>
              <p>
                Funds are held in escrow. Providers only get paid when the
                agreed work is delivered.
              </p>
            </article>
          </div>
        </section>

        <section className="audience-paths section" id="paths">
          <div className="layout">
            <div className="audience-paths__heading">
              <div>
                <p className="section-kicker">Choose your route</p>
                <h2>Find the Requote path that moves you forward.</h2>
              </div>
              <p>
                Requote is built around the next move you want to make. Start
                with the role that sounds most like you and we will shape the
                right early-access experience around it.
              </p>
            </div>

            <div className="audience-paths__signal">
              <div className="audience-paths__signal-copy">
                <div className="audience-paths__signal-label">
                  <span>01</span>
                  <strong>Start with context</strong>
                </div>
                <h3>One network. A clearer next move.</h3>
                <p>
                  The best connections begin when everyone understands the
                  outcome. Tell Requote where you fit, then help us build the
                  tools that make that journey feel simpler.
                </p>
                <div className="audience-paths__signal-points" aria-label="What your path shapes">
                  <span>Better briefs</span>
                  <span>Better matches</span>
                  <span>Better momentum</span>
                </div>
              </div>
              <div className="audience-network" aria-hidden="true">
                <span className="audience-network__ring audience-network__ring--one" />
                <span className="audience-network__ring audience-network__ring--two" />
                <span className="audience-network__line audience-network__line--one" />
                <span className="audience-network__line audience-network__line--two" />
                <span className="audience-network__node audience-network__node--client">
                  Client
                </span>
                <span className="audience-network__node audience-network__node--provider">
                  Provider
                </span>
                <span className="audience-network__node audience-network__node--employer">
                  Employer
                </span>
                <span className="audience-network__node audience-network__node--employee">
                  Talent
                </span>
                <span className="audience-network__node audience-network__node--investor">
                  Investor
                </span>
                <span className="audience-network__core">
                  <img src="/requote-mark.png" alt="" />
                </span>
              </div>
            </div>

            <div className="audience-paths__grid">
                {audiencePaths.map((path) => (
                  <a
                    className={
                      "audience-path audience-path--" + path.tone +
                      (path.featured ? " audience-path--featured" : "")
                    }
                    href={path.href}
                    key={path.label}
                  >
                    <div className="audience-path__topline">
                      <span className="audience-path__number">{path.number}</span>
                      <small>{path.label}</small>
                    </div>
                    <div className="audience-path__content">
                      <h3>{path.title}</h3>
                      <p>{path.copy}</p>
                    </div>
                    <b className="audience-path__action">{path.action} <i aria-hidden="true">↗</i></b>
                  </a>
                ))}
            </div>
          </div>
        </section>

        <section className="process section" id="how-it-works">
          <div className="layout">
            <div className="section-heading">
              <p className="section-kicker">How it works</p>
              <h2>The Requote Process</h2>
              <p>
                A clear, documented transaction from request to protected
                payment.
              </p>
            </div>
            <ol className="process__grid">
              {processSteps.map(([number, title, copy, icon], index) => (
                <li
                  className={
                    "process-card " +
                    (index === 3 ? "process-card--featured" : "")
                  }
                  key={number}
                >
                  <span className="process-card__number">{number}</span>
                  <AssetIcon src={icon} className="process-card__icon" />
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="story section" id="requesters">
          <div className="layout story__grid">
            <div className="story__copy">
              <p className="section-kicker">For clients</p>
              <h2>Turn the work you need into a brief people can act on.</h2>
              <p>
                One clear request becomes the source of truth for every offer,
                payment, delivery, and review.
              </p>
              <ul className="feature-list">
                <li>
                  <AssetIcon src="/figma/icon-07.svg" />
                  <span>
                    <strong>Detailed job requirements</strong>Set the scope,
                    location, timing, and quality you expect.
                  </span>
                </li>
                <li>
                  <AssetIcon src="/figma/icon-07.svg" />
                  <span>
                    <strong>Choose with confidence</strong>Compare provider
                    offers against the same clear request.
                  </span>
                </li>
                <li>
                  <AssetIcon src="/figma/icon-07.svg" />
                  <span>
                    <strong>Secure funds in escrow</strong>Keep payment
                    protected until the agreed outcome is confirmed.
                  </span>
                </li>
              </ul>
              <a className="button button--dark" href={requesterLink}>
                Post your first request
              </a>
            </div>
            <div
              className="request-ui"
              role="img"
              aria-label="Example request form showing the kinds of services you can request on Requote"
            >
              <div className="request-ui__toolbar">
                <span>New request</span>
                <small>Step 2 of 4</small>
              </div>
              <div className="request-ui__body">
                <label>
                  What do you need?
                  <span className="request-ui__typed" aria-hidden="true">
                    {typedRequest}
                    <i className="request-ui__caret" />
                  </span>
                </label>
                <label>
                  Delivery location<span>Lagos, Nigeria</span>
                </label>
                <div className="request-ui__range">
                  <span>Budget range</span>
                  <i />
                </div>
                <button type="button">Review request</button>
              </div>
            </div>
          </div>
        </section>

        <section className="story story--provider section" id="providers">
          <div className="layout story__grid story__grid--reverse">
            <div
              className="provider-offer"
              role="img"
              aria-label="Example accepted provider offer"
            >
              <div className="provider-offer__top">
                <span className="provider-offer__avatar">VF</span>
                <div>
                  <strong>Victoria’s Tailoring Hub</strong>
                  <small>Verified provider · Lagos</small>
                </div>
              </div>
              <p>
                Complete corporate uniform production with fittings and
                delivery.
              </p>
              <div className="provider-offer__amount">
                <span>Accepted offer</span>
                <strong>₦485,000</strong>
              </div>
              <button type="button">View agreement</button>
            </div>
            <div className="story__copy">
              <p className="section-kicker">For providers and experts</p>
              <h2>Find real work. Know you’ll get paid.</h2>
              <p>
                Respond to legitimate requests, agree on the details, and start
                with payment already protected.
              </p>
              <ul className="feature-list feature-list--provider">
                <li>
                  <AssetIcon src="/figma/icon-07.svg" />
                  <span>
                    <strong>Respond to real requests</strong>Spend time on
                    buyers who have already described what they need.
                  </span>
                </li>
                <li>
                  <AssetIcon src="/figma/icon-07.svg" />
                  <span>
                    <strong>Clear scope of work</strong>Price against documented
                    requirements, not vague expectations.
                  </span>
                </li>
                <li>
                  <AssetIcon src="/figma/icon-07.svg" />
                  <span>
                    <strong>Guaranteed funds</strong>Begin once payment is
                    secured in the protected process.
                  </span>
                </li>
              </ul>
              <a className="button button--outline" href={providerLink}>
                Become a provider
              </a>
            </div>
          </div>
        </section>

        <section className="escrow section" id="trust">
          <div className="layout escrow__inner">
            <div className="escrow__heading">
              <p className="section-kicker section-kicker--light">
                Trust &amp; safety
              </p>
              <h2>Escrow protects the agreement, not subjective preference.</h2>
              <p>
                We protect the clear scope and acceptance criteria agreed by
                both sides. Evidence—not shifting expectations—guides every
                resolution.
              </p>
            </div>
            <div className="escrow__grid">
              <article>
                <AssetIcon src="/figma/icon-11.svg" />
                <h3>Identity &amp; Verification</h3>
                <p>
                  Profiles, business details, and activity help both sides
                  transact with greater confidence.
                </p>
              </article>
              <article className="escrow-card--featured">
                <AssetIcon src="/figma/lock.svg" />
                <h3>Escrowed Funds</h3>
                <p>
                  Payment is secured before work begins and released when the
                  documented outcome is confirmed.
                </p>
              </article>
              <article className="escrow-card--light-icon">
                <AssetIcon src="/figma/icon-09.svg" />
                <h3>Evidence-Based Disputes</h3>
                <p>
                  Requests, offers, messages, photos, and delivery records
                  establish what happened.
                </p>
              </article>
              <article className="escrow-card--light-icon">
                <AssetIcon src="/figma/icon-08.svg" />
                <h3>Fair Outcomes</h3>
                <p>
                  Resolution follows the accepted agreement and the evidence
                  supplied by both parties.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="categories section" id="categories">
          <div className="layout">
            <div className="section-heading section-heading--left">
              <p className="section-kicker">Marketplace categories</p>
              <h2>Designed for any request</h2>
              <p>
                Requote starts where real work happens and expands with the
                needs of its users.
              </p>
            </div>
            <div className="categories__grid">
              {categories.map(([title, image, alt]) => (
                <a className="category-tile" href={requesterLink} key={title}>
                  <img src={image} alt={alt} />
                  <span>{title}</span>
                </a>
              ))}
            </div>
            <aside className="logistics-note">
              <span>
                <AssetIcon src="/figma/logistics.svg" />
              </span>
              <div>
                <h3>Flexible Logistics</h3>
                <p>
                  Parties can agree to use their own transport arrangements or
                  choose Requote logistics partners where available in pilot
                  cities.
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className="faq section" id="faq">
          <div className="layout">
            <div className="section-heading">
              <p className="section-kicker">Good to know</p>
              <h2>Frequently Asked Questions</h2>
            </div>
            <div className="faq__list">
              {faqs.map(([question, answer], index) => {
                const isOpen = openFaq === index;
                const answerId = `faq-answer-${index}`;
                return (
                  <article
                    className={"faq-item " + (isOpen ? "faq-item--open" : "")}
                    key={question}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                    >
                      <span>{question}</span>
                      <AssetIcon src="/figma/icon-17.svg" />
                    </button>
                    <div className="faq-item__answer" id={answerId}>
                      <p>{answer}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="closing section" id="request">
          <div className="layout">
            <h2>Ready to make your next move with more clarity?</h2>
            <div className="closing__grid">
              <article>
                <h3>Need work done?</h3>
                <p>Turn your need into a clear request.</p>
                <a className="button button--primary" href={requesterLink}>
                  Post a request
                </a>
              </article>
              <article>
                <h3>Looking to build, grow, or invest?</h3>
                <p>Find the Requote path that matches your next step.</p>
                <a className="button button--light" href="#paths">
                  Explore your path
                </a>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="layout">
          <div className="footer__grid">
            <div className="footer__brand">
              <Logo />
              <p>
                A clearer network for clients, providers, teams, professionals,
                and investors in Nigeria.
              </p>
            </div>
            <div className="footer__column">
              <strong>Product</strong>
              <a href={requesterLink}>Post a Request</a>
              <a href={providerLink}>Become a Provider</a>
              <a href={employerLink}>For Employers</a>
              <a href={employeeLink}>For Professionals</a>
              <a href={investorLink}>For Investors</a>
              <a href="/how-it-works">How it Works</a>
              <span>Pricing (TBA)</span>
            </div>
            <div className="footer__column">
              <strong>Trust &amp; Safety</strong>
              <a href="/trust-safety">Escrow Protection</a>
              <a href="/trust-safety#disputes">Dispute Resolution</a>
              <a href="/trust-safety#verification">Provider Verification</a>
            </div>
            <div className="footer__column">
              <strong>Support</strong>
              <a href="mailto:info@requote.cc">Help Center</a>
              <a href="mailto:info@requote.cc">Contact Us</a>
              <a href="/terms">Terms of Service</a>
              <a href="/privacy">Privacy Policy</a>
              <a href="/cookies">Cookie Policy</a>
            </div>
          </div>
          <div className="footer__bottom">
            <span>
              © {currentYear} Requote Marketplace. All rights reserved.
            </span>
            <span>Built for trusted transactions in Nigeria.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
