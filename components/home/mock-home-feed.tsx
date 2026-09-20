"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type MockMember = {
  authenticated?: boolean;
  name?: string;
  email?: string;
  role?: string;
  profileComplete?: boolean;
};

const navItems = [
  ["⌂", "Home"],
  ["⌁", "My network"],
  ["▤", "Requests"],
  ["✉", "Messages"],
  ["♧", "Notifications"],
  ["◎", "Profile"],
] as const;

const roleOptions = ["Client", "Provider", "Employer", "Professional", "Investor"];
const requestHref = "/post-a-request?journey=request&source=home";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "RM";
}

function MockAvatar({ name, tone = "blue" }: { name: string; tone?: string }) {
  return <span className={`mock-avatar mock-avatar--${tone}`}>{initials(name)}</span>;
}

function Pill({ children, tone = "blue" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`feed-pill feed-pill--${tone}`}>{children}</span>;
}

type MockHomeFeedProps = {
  profileMode: "complete" | "incomplete";
};

export function MockHomeFeed({ profileMode }: MockHomeFeedProps) {
  const [member, setMember] = useState<MockMember | null>(null);
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState("Client");
  const [profileComplete, setProfileComplete] = useState(false);
  const [fatimaFollowed, setFatimaFollowed] = useState(false);
  const [notice, setNotice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const noticeTimerRef = useRef<number | null>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stored = window.localStorage.getItem("requote_mock_auth");
      if (!stored) {
        window.location.replace("/login?next=/home");
        return;
      }

      try {
        const parsed = JSON.parse(stored) as MockMember;
        if (!parsed.authenticated) {
          window.location.replace("/login?next=/home");
          return;
        }
        setMember(parsed);
        setRole(parsed.role || "Client");
        setProfileComplete(profileMode === "complete");
        setReady(true);
      } catch {
        window.location.replace("/login?next=/home");
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [profileMode]);

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!profileMenuOpen) return;

    function closeOnOutsideClick(event: MouseEvent) {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setProfileMenuOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [profileMenuOpen]);

  function showNotice(message: string) {
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    setNotice(message);
    noticeTimerRef.current = window.setTimeout(() => setNotice(""), 3600);
  }

  function updateProfileCompletion(nextValue: boolean) {
    setProfileComplete(nextValue);
    const stored = window.localStorage.getItem("requote_mock_auth");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as MockMember;
        window.localStorage.setItem(
          "requote_mock_auth",
          JSON.stringify({ ...parsed, profileComplete: nextValue }),
        );
      } catch {
        // The preview can still show the state even if local storage is unavailable.
      }
    }
    showNotice(
      nextValue
        ? "Profile completed in this preview state."
        : "Profile setup reopened in this preview state.",
    );
  }

  function updateRole(nextRole: string) {
    setRole(nextRole);
    const stored = window.localStorage.getItem("requote_mock_auth");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as MockMember;
      window.localStorage.setItem(
        "requote_mock_auth",
        JSON.stringify({ ...parsed, role: nextRole }),
      );
    } catch {
      // Keep the selected role in memory for this preview session.
    }
  }

  function signOut() {
    window.localStorage.removeItem("requote_mock_auth");
    window.location.assign("/login");
  }

  function handleNav(label: string) {
    if (label === "Home") return;
    if (label === "Requests") {
      window.location.assign(requestHref);
      return;
    }
    showNotice(`${label} is part of the next product build milestone.`);
  }

  if (!ready || !member) {
    return <main className="feed-loading" aria-label="Loading your Requote feed"><span /><span /><span /></main>;
  }

  const memberName = member.name || "Requote member";
  const firstName = memberName.split(" ")[0];

  return (
    <div className="feed-app">
      <header className="feed-topbar">
        <div className="feed-topbar__inner">
          <Link className="feed-brand" href="/" aria-label="Requote home">
            <img src="/requote-logo.png" alt="Requote" />
          </Link>
            <div className="feed-search">
            <span aria-hidden="true">⌕</span>
            <input
              ref={searchInputRef}
              aria-label="Search Requote"
              aria-controls="feed-search-results"
              aria-expanded={Boolean(searchQuery.trim())}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setSearchQuery("");
                  event.currentTarget.blur();
                }
              }}
              placeholder="Search people, requests, and opportunities"
            />
            {searchQuery && (
              <button
                className="feed-search-clear"
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setSearchQuery("");
                  searchInputRef.current?.focus();
                }}
              >
                ×
              </button>
            )}
            {searchQuery.trim() && (
              <div
                className="feed-search-popover"
                id="feed-search-results"
                role="status"
                aria-live="polite"
              >
                <small>SEARCH RESULTS</small>
                <strong>No results for “{searchQuery.trim()}”</strong>
                <p>Nothing in this preview matches yet. Try another keyword.</p>
                <button type="button" onClick={() => setSearchQuery("")}>Clear search</button>
              </div>
            )}
          </div>
          <nav className="feed-topnav" aria-label="Account navigation">
            <button type="button" onClick={() => searchInputRef.current?.focus()}>Search</button>
            <button type="button" onClick={() => showNotice("Messages will appear here as the communication layer is connected.")}>Messages</button>
            <button type="button" onClick={() => showNotice("You have no new notifications in this preview.")}>Notifications</button>
            <div className="feed-profile-menu" ref={profileMenuRef}>
              <button
                className={"feed-user-button " + (profileMenuOpen ? "is-open" : "")}
                type="button"
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
                aria-controls="profile-menu"
                onClick={() => setProfileMenuOpen((open) => !open)}
              >
                <MockAvatar name={memberName} />
                <span>{firstName}</span>
                <span className="feed-chevron" aria-hidden="true">⌄</span>
              </button>
              {profileMenuOpen && (
                <div className="feed-profile-dropdown" id="profile-menu" role="menu" aria-label="Profile menu">
                  <div className="feed-profile-dropdown__identity">
                    <MockAvatar name={memberName} tone="navy" />
                    <span><strong>{memberName}</strong><small>{member.email || "Requote member"}</small></span>
                  </div>
                  <div className="feed-profile-dropdown__divider" />
                  <button className="feed-profile-dropdown__item" type="button" role="menuitem" onClick={() => { setProfileMenuOpen(false); handleNav("Profile"); }}>
                    <span className="feed-profile-dropdown__icon">◎</span>
                    <span><strong>View profile</strong><small>See your public profile</small></span>
                    <b aria-hidden="true">→</b>
                  </button>
                  <button className="feed-profile-dropdown__item" type="button" role="menuitem" onClick={() => { setProfileMenuOpen(false); showNotice("Settings will be available after account setup."); }}>
                    <span className="feed-profile-dropdown__icon">⚙</span>
                    <span><strong>Account settings</strong><small>Manage your preferences</small></span>
                    <b aria-hidden="true">→</b>
                  </button>
                  <div className="feed-profile-dropdown__divider" />
                  <button className="feed-profile-dropdown__signout" type="button" role="menuitem" onClick={signOut}>Sign out</button>
                </div>
              )}
            </div>
          </nav>
          <button
            className="feed-mobile-toggle"
            type="button"
            aria-expanded={mobileNavOpen}
            aria-controls="feed-mobile-nav"
            onClick={() => setMobileNavOpen((open) => !open)}
          >
            Menu
          </button>
        </div>
        {mobileNavOpen && (
          <nav className="feed-mobile-nav" id="feed-mobile-nav" aria-label="Mobile account navigation">
            <button type="button" onClick={() => showNotice("Search is ready for the next feed milestone.")}>Search</button>
            <button type="button" onClick={() => showNotice("Messages are coming next.")}>Messages</button>
            <button type="button" onClick={signOut}>Sign out</button>
          </nav>
        )}
      </header>

      <div className="feed-layout">
        <aside className="feed-sidebar" aria-label="Workspace navigation">
          <section className="feed-profile-card">
            <MockAvatar name={memberName} tone="navy" />
            {profileComplete ? (
              <>
                <small className="feed-profile-label">YOUR PROFILE</small>
                <strong>{memberName}</strong>
                <span className="feed-profile-meta">{role} · Lagos, Nigeria</span>
                <button type="button" onClick={() => handleNav("Profile")}>
                  View your profile <b>→</b>
                </button>
              </>
            ) : (
              <>
                <strong>{memberName}</strong>
                <span>{member.email || "Requote member"}</span>
                <div className="feed-progress"><span style={{ width: "42%" }} /></div>
                <small>Profile setup 42%</small>
                <button type="button" onClick={() => updateProfileCompletion(true)}>
                  Complete profile <b>→</b>
                </button>
              </>
            )}
          </section>

          <nav className="feed-side-nav" aria-label="Primary workspace navigation">
            {navItems.map(([icon, label]) => (
              <button className={label === "Home" ? "is-active" : ""} key={label} type="button" onClick={() => handleNav(label)}>
                <span aria-hidden="true">{icon}</span>{label}
                {label === "Messages" && <i aria-label="2 unread messages">2</i>}
              </button>
            ))}
          </nav>

          <nav className="feed-side-nav feed-side-nav--secondary" aria-label="Support navigation">
            <button type="button" onClick={() => showNotice("Saved posts will be available with the feed actions.")}><span>☆</span>Saved posts</button>
            <button type="button" onClick={() => showNotice("Settings will be available after account setup.")}><span>⚙</span>Settings</button>
            <button type="button" onClick={() => showNotice("Help centre content is coming next.")}><span>?</span>Help centre</button>
            <button type="button" onClick={() => showNotice("Trust & safety guidance is available on the public site.")}><span>♢</span>Trust &amp; safety</button>
          </nav>

          <section className="feed-role-switcher">
            <small>Working as</small>
            <select value={role} onChange={(event) => updateRole(event.target.value)} aria-label="Current Requote role">
              {roleOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
            <p>Your feed will adapt as you add roles to your profile.</p>
          </section>
          <button className="feed-signout" type="button" onClick={signOut}>Sign out</button>
        </aside>

        <main className="feed-main" aria-labelledby="feed-title">
          <div className="feed-welcome">
            <div>
              <p className="feed-kicker">Your Requote workspace</p>
              <h1 id="feed-title">Good morning, {firstName}.</h1>
              <p>Here is what is moving across your network today.</p>
            </div>
            <Link className="feed-primary-button" href={requestHref}>Post a request <span>↗</span></Link>
          </div>

          <section className="feed-composer" aria-label="Create a post">
            <div className="feed-composer__row">
              <MockAvatar name={memberName} />
              <button type="button" onClick={() => showNotice("The post composer will be connected in the next milestone.")}>Share something useful with your network…</button>
            </div>
            <div className="feed-composer__actions">
              <button type="button" onClick={() => window.location.assign(requestHref)}><span className="composer-icon composer-icon--blue">+</span>Post a request</button>
              <button type="button" onClick={() => showNotice("Updates will be available when posting is connected.")}><span className="composer-icon composer-icon--green">▣</span>Share an update</button>
              <button type="button" onClick={() => showNotice("Work samples will be available from your profile.")}><span className="composer-icon composer-icon--orange">▤</span>Add work sample</button>
            </div>
          </section>

          <div className="feed-tabs" role="tablist" aria-label="Feed filters">
            {['For you', 'Following', 'Requests', 'Opportunities', 'My activity'].map((tab, index) => (
              <button className={index === 0 ? "is-active" : ""} key={tab} type="button" onClick={() => index === 0 ? undefined : showNotice(`${tab} will be connected as the feed grows.`)}>{tab}</button>
            ))}
          </div>

          <div className="feed-stream">
            <article className="feed-card">
              <header className="feed-card__header">
                <Link className="feed-author-avatar-link" href="/profiles/chinedu-works-ltd" aria-label="View Chinedu Works Ltd. profile"><MockAvatar name="Chinedu Works Ltd" tone="green" /></Link>
                <div><Link className="feed-author-name-link" href="/profiles/chinedu-works-ltd">Chinedu Works Ltd.</Link><span>Provider · Lagos</span><small>2h ago · Shared request</small></div>
                <Pill>Request</Pill>
              </header>
              <h2>Need a professional lead photographer for a 3-day Lagos wedding in November</h2>
              <div className="feed-meta"><span>300 guests</span><span>Nov 18–20</span><span>Budget shared</span></div>
              <p>Looking for a documentary-style wedding photographer with a calm process, fast communication, and a portfolio that feels natural and considered.</p>
              <footer className="feed-card__footer"><button className="feed-small-button" type="button" onClick={() => showNotice("Request preview opened for the next milestone.")}>View request</button><button type="button" onClick={() => showNotice("Offer flow will open after request details are connected.")}>Make an offer</button><span className="feed-card__quiet">Context first · details available in the request</span></footer>
            </article>

            <article className="feed-card feed-card--sample">
              <header className="feed-card__header">
                <MockAvatar name="Fatima Bello" tone="orange" />
                <div><strong>Fatima Bello</strong><span>Architectural Metalwork</span><small>4h ago · Work sample</small></div>
                <Pill tone="green">Work sample</Pill>
              </header>
              <h2>Structural steel partitioning with a finish designed for everyday use.</h2>
              <div className="feed-sample-visual"><span>Commercial interior fit-out</span><strong>Built for the brief.</strong><small>Preview work sample · scope and delivery details stay attached.</small></div>
              <footer className="feed-card__footer"><button className="feed-small-button" type="button" onClick={() => showNotice("Work sample preview opened for the next milestone.")}>View work sample</button><button className={"feed-follow-button " + (fatimaFollowed ? "is-following" : "")} type="button" aria-pressed={fatimaFollowed} onClick={() => { const nextValue = !fatimaFollowed; setFatimaFollowed(nextValue); showNotice(nextValue ? "You are now following Fatima." : "You unfollowed Fatima."); }}>{fatimaFollowed ? "Following" : "Follow Fatima"}</button></footer>
            </article>

            <article className="feed-card">
              <header className="feed-card__header">
                <MockAvatar name="Lagos Build Collective" tone="purple" />
                <div><strong>Lagos Build Collective</strong><span>Contractor / PM</span><small>Yesterday · Opportunity</small></div>
                <Pill tone="orange">Opportunity</Pill>
              </header>
              <h2>Looking for two certified structural welders for a 4-week commercial warehouse build</h2>
              <div className="feed-meta"><span>Contract · 4 weeks</span><span>Oregun, Ikeja</span><span>Daily PPE provided</span></div>
              <p>Project starts Monday. Experience in commercial structural work and a safety-first approach are important for this team.</p>
              <footer className="feed-card__footer"><button className="feed-small-button" type="button" onClick={() => showNotice("Opportunity preview opened for the next milestone.")}>View opportunity</button><button type="button" onClick={() => showNotice("Interest flow will be connected after profiles are ready.")}>Express interest</button></footer>
            </article>

            <article className="feed-guidance-card"><span className="guidance-mark">✦</span><div><small>REQUote guidance</small><strong>A clear agreement starts before the work begins.</strong><p>Keep scope, timing, evidence, and acceptance criteria visible so every next step is easier to understand.</p><button type="button" onClick={() => window.location.assign("/trust-safety")}>Read trust &amp; safety guidance →</button></div></article>
          </div>
        </main>

        <aside className="feed-rightbar" aria-label="Feed support panels">
          {!profileComplete && (
            <section className="feed-right-card feed-setup-card">
              <div className="feed-right-card__heading"><small>ACCOUNT SETUP</small><b>2 of 5</b></div>
              <h2>Complete your profile</h2>
              <p>Add a photo, your location, and the work you want to be known for.</p>
              <div className="feed-progress"><span style={{ width: "42%" }} /></div>
              <button type="button" onClick={() => updateProfileCompletion(true)}>Continue setup <span>→</span></button>
            </section>
          )}

          <section className="feed-right-card">
            <div className="feed-right-card__heading"><small>PEOPLE TO DISCOVER</small><button type="button" onClick={() => showNotice("Network discovery will be connected soon.")}>See all</button></div>
            {[['Kelechi Okafor', 'Electrical contracting', 'KO'], ['Tunde Alabi', 'Catering & logistics', 'TA'], ['Bilikisu Sani', 'Agro-supply', 'BS']].map(([name, detail, avatar]) => <div className="feed-suggestion" key={name}><span className="mock-avatar mock-avatar--muted">{avatar}</span><div><strong>{name}</strong><small>{detail}</small></div><button type="button" onClick={() => showNotice(`Follow ${name} will be connected soon.`)}>Follow</button></div>)}
          </section>

          <section className="feed-right-card">
            <div className="feed-right-card__heading"><small>RELEVANT REQUESTS</small><button type="button" onClick={() => showNotice("Request discovery will be connected soon.")}>Explore</button></div>
            <button className="feed-mini-request" type="button" onClick={() => showNotice("Request preview opened for the next milestone.")}><span>Supply &amp; delivery</span><strong>50 bags of fertilizer delivered to Kano</strong><small>Budget shared · View →</small></button>
            <button className="feed-mini-request" type="button" onClick={() => showNotice("Request preview opened for the next milestone.")}><span>Web &amp; software</span><strong>E-commerce UI for Shopify store</strong><small>Remote · 2 weeks · View →</small></button>
          </section>

          <section className="feed-right-card feed-next-card"><div className="feed-right-card__heading"><small>YOUR NEXT ACTIONS</small></div><button type="button" onClick={() => showNotice("Action details will be connected soon.")}><i>•</i><span><strong>Finish your profile</strong><small>Add what you do and where you work.</small></span></button><button type="button" onClick={() => showNotice("Saved request actions will be connected soon.")}><i>•</i><span><strong>Save a request</strong><small>Keep a brief ready for the right moment.</small></span></button></section>

          <section className="feed-trust-card"><small>REQUOTE PRINCIPLE</small><h2>Context before momentum.</h2><p>A better work network starts with people seeing the same brief.</p><Link href="/trust-safety">Learn how Requote works →</Link></section>
        </aside>
      </div>
      {notice && <div className="feed-toast" role="status">{notice}</div>}
    </div>
  );
}
