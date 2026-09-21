"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type MockMember = {
  authenticated?: boolean;
  name?: string;
  email?: string;
  role?: string;
  profileComplete?: boolean;
  location?: string;
  headline?: string;
  about?: string;
  isAvailable?: boolean;
  publicProfile?: boolean;
  professionalFocus?: string;
  professionalLevel?: string;
  professionalOverview?: string;
  emailVerified?: boolean;
  nameVerified?: boolean;
};

type ProfileTab = "Overview" | "Work" | "Activity";

const roleOptions = ["Client", "Provider", "Employer", "Professional", "Investor"];
const requestHref = "/post-a-request?journey=request&source=home";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "RM";
}

function profileSummary(role: string) {
  const summaries: Record<string, string> = {
    Client: "Share clear requirements, keep conversations in one place, and find the people who fit the work.",
    Provider: "Use your profile to show the work you do, the context you need, and the opportunities that suit you.",
    Employer: "Build a sharper hiring signal by sharing the teams, roles, and outcomes you are working toward.",
    Professional: "Make it easier for the right people to understand your strengths, availability, and work direction.",
    Investor: "Keep a concise public presence for the sectors, conversations, and opportunities you want to explore.",
  };

  return summaries[role] || summaries.Client;
}

function roleFocus(role: string) {
  const focus: Record<string, string[]> = {
    Client: ["Clear briefs", "Relevant offers", "Saved requests"],
    Provider: ["Relevant requests", "Work samples", "Better-fit leads"],
    Employer: ["Team opportunities", "Relevant talent", "Clearer context"],
    Professional: ["Work direction", "Availability", "Useful connections"],
    Investor: ["Market signals", "Company context", "Thoughtful introductions"],
  };

  return focus[role] || focus.Client;
}

export function MyProfile() {
  const searchParams = useSearchParams();
  const [member, setMember] = useState<MockMember | null>(null);
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>("Overview");
  const [role, setRole] = useState("Client");
  const [profileComplete, setProfileComplete] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const [nameVerified, setNameVerified] = useState(false);
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef<number | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stored = window.localStorage.getItem("requote_mock_auth");
      if (!stored) {
        window.location.replace("/login?next=/profile");
        return;
      }

      try {
        const parsed = JSON.parse(stored) as MockMember;
        if (!parsed.authenticated) {
          window.location.replace("/login?next=/profile");
          return;
        }
        setMember(parsed);
        setRole(parsed.role || "Client");
        setProfileComplete(parsed.profileComplete ?? true);
        setIsAvailable(parsed.isAvailable ?? true);
        setIsPublic(parsed.publicProfile ?? true);
        setEmailVerified(parsed.emailVerified ?? false);
        setNameVerified(searchParams.get("verification") === "verified" || (parsed.nameVerified ?? false));
        setReady(true);
      } catch {
        window.location.replace("/login?next=/profile");
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [searchParams]);

  useEffect(() => {
    return () => {
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    };
  }, []);

  function showNotice(message: string) {
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    setNotice(message);
    noticeTimer.current = window.setTimeout(() => setNotice(""), 3600);
  }

  function updateRole(nextRole: string) {
    setRole(nextRole);
    const stored = window.localStorage.getItem("requote_mock_auth");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as MockMember;
      window.localStorage.setItem("requote_mock_auth", JSON.stringify({ ...parsed, role: nextRole }));
    } catch {
      // The preview continues in memory if local storage is unavailable.
    }
  }

  if (!ready || !member) {
    return <main className="my-profile-loading" aria-label="Loading your profile"><span /><span /><span /></main>;
  }

  const memberName = member.name || "Requote member";
  const focus = roleFocus(role);
  const memberLocation = member.location || "Add your location";
  const profileIntro = member.professionalOverview || member.about || member.headline || "This is the public context people use to understand how to work with you. You stay in control of what is shared.";

  return (
    <div className="my-profile-page">
      <header className="my-profile-topbar">
        <div className="my-profile-topbar__inner">
          <Link className="my-profile-brand" href="/" aria-label="Requote home">
            <img src="/requote-logo.png" alt="Requote" />
          </Link>
          <nav className="my-profile-nav" aria-label="Workspace navigation">
            <Link href="/home">Home</Link>
            <Link href={requestHref}>Requests</Link>
            <button type="button" onClick={() => showNotice("Your network will grow as connections are added.")}>My network</button>
          </nav>
          <div className="my-profile-topbar__actions">
            <Link className="my-profile-back" href="/home">Back to home</Link>
            <Link className="my-profile-post" href={requestHref}>Post a request</Link>
          </div>
        </div>
      </header>

      <main className="my-profile-shell">
        <div className="my-profile-breadcrumb"><Link href="/home">Home</Link><span>/</span><span>Your profile</span></div>

        <section className="my-profile-hero" aria-labelledby="my-profile-title">
          <div className="my-profile-hero__surface"><span /><span /><span /></div>
          <div className="my-profile-hero__content">
            <div className="my-profile-avatar" aria-hidden="true">{getInitials(memberName)}</div>
            <div className="my-profile-hero__identity">
              <p>Your Requote profile</p>
              <h1 id="my-profile-title">{memberName}</h1>
              <div className="my-profile-hero__meta"><span>{member.headline || role}</span><span>{memberLocation}</span><span>{isAvailable ? "Open to relevant opportunities" : "Availability paused"}</span>{nameVerified && <strong className="my-profile-verified-badge">✓ Name verified</strong>}</div>
              <p className="my-profile-hero__intro">{profileIntro}</p>
            </div>
            <div className="my-profile-hero__actions">
              {profileComplete ? <><button type="button" onClick={() => showNotice("Profile editing will be connected in the next account milestone.")}>Edit profile</button><button type="button" onClick={() => showNotice("Your shareable profile link is ready in the production flow.")}>Share profile</button></> : <Link href="/account-setup?return=/profile">Continue setup <span>→</span></Link>}
            </div>
          </div>
        </section>

        {!profileComplete && <section className="my-profile-setup-banner"><div><small>ACCOUNT SETUP IN PROGRESS</small><strong>Finish a few details to make your profile ready to share.</strong><p>Add your location, role context, and visibility preferences. You can change them later.</p></div><Link href="/account-setup?return=/profile">Continue setup <span>→</span></Link></section>}

        <div className="my-profile-layout">
          <div className="my-profile-main">
            <div className="my-profile-tabs" role="tablist" aria-label="Profile content">
              {(["Overview", "Work", "Activity"] as ProfileTab[]).map((tab) => (
                <button
                  className={activeTab === tab ? "is-active" : ""}
                  id={`my-profile-tab-${tab.toLowerCase()}`}
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  aria-controls={`my-profile-panel-${tab.toLowerCase()}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "Overview" && (
              <div className="my-profile-overview" id="my-profile-panel-overview" role="tabpanel" aria-labelledby="my-profile-tab-overview">
                <section className="my-profile-panel">
                  <div className="my-profile-panel__heading"><div><p>PROFILE SUMMARY</p><h2>Make the right first impression.</h2></div><button type="button" onClick={() => showNotice("Profile editing will be connected in the next account milestone.")}>Edit</button></div>
                  <p>{profileSummary(role)}</p>
                  <div className="my-profile-chip-list">{focus.map((item) => <span key={item}>{item}</span>)}</div>
                  {(member.professionalFocus || member.professionalLevel || member.professionalOverview) && <div className="my-profile-professional-context"><div><small>WHAT YOU DO</small><strong>{member.professionalFocus || "Not added yet"}</strong></div><div><small>PROFESSIONAL LEVEL</small><strong>{member.professionalLevel || "Not added yet"}</strong></div>{member.professionalOverview && <p>{member.professionalOverview}</p>}</div>}
                </section>

                <section className="my-profile-panel">
                  <div className="my-profile-panel__heading"><div><p>HOW YOU PARTICIPATE</p><h2>Your current role</h2></div></div>
                  <p>Select the point of view that best fits what you are doing now. This changes your preview context only.</p>
                  <label className="my-profile-role-select"><span>Working as</span><select value={role} onChange={(event) => updateRole(event.target.value)}>{roleOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
                </section>

                <section className="my-profile-panel">
                  <div className="my-profile-panel__heading"><div><p>VISIBILITY</p><h2>Control your profile presence.</h2></div></div>
                  <div className="my-profile-toggle-list">
                    <div className="my-profile-toggle-row"><div><strong>Public profile</strong><p>Let people see your name, public role, and any work you choose to share.</p></div><button className={`my-profile-switch ${isPublic ? "is-on" : ""}`} type="button" role="switch" aria-checked={isPublic} aria-label="Toggle public profile" onClick={() => setIsPublic((value) => !value)}><span /></button></div>
                    <div className="my-profile-toggle-row"><div><strong>Open to relevant opportunities</strong><p>Show that you are available for requests, work, or conversations that fit your role.</p></div><button className={`my-profile-switch ${isAvailable ? "is-on" : ""}`} type="button" role="switch" aria-checked={isAvailable} aria-label="Toggle opportunity availability" onClick={() => setIsAvailable((value) => !value)}><span /></button></div>
                  </div>
                  <small className="my-profile-preview-note">These controls are interactive preview settings. They are not yet saved to your account.</small>
                </section>
              </div>
            )}

            {activeTab === "Work" && (
              <section className="my-profile-panel my-profile-panel--empty" id="my-profile-panel-work" role="tabpanel" aria-labelledby="my-profile-tab-work">
                <div className="my-profile-empty-icon" aria-hidden="true">▧</div><p>WORK SAMPLES</p><h2>Give people a little more context.</h2><span>When you are ready, add examples that show the type of work, outcomes, or opportunities you want to be known for.</span><button type="button" onClick={() => showNotice("Adding work samples will be connected in the next profile milestone.")}>Add a work sample</button>
              </section>
            )}

            {activeTab === "Activity" && (
              <section className="my-profile-panel my-profile-panel--empty" id="my-profile-panel-activity" role="tabpanel" aria-labelledby="my-profile-tab-activity">
                <div className="my-profile-empty-icon" aria-hidden="true">◌</div><p>ACTIVITY</p><h2>Your activity will appear here.</h2><span>Requests, updates, offers, and helpful contributions will stay organised on your profile as the product is connected.</span><Link href={requestHref}>Create your first request</Link>
              </section>
            )}
          </div>

          <aside className="my-profile-sidebar" aria-label="Profile guidance">
            <section className="my-profile-side-card my-profile-side-card--status">
              <p>PROFILE STATUS</p><h2>{profileComplete ? "Ready to share" : "Setup in progress"}</h2><span>{profileComplete ? "Your core details are in place. Add work when it helps people understand your fit." : "Add the essentials so people have enough context to begin the right conversation."}</span><div className="my-profile-progress"><span style={{ width: profileComplete ? "100%" : "42%" }} /></div><small>{profileComplete ? "Core profile complete" : "2 of 4 setup steps"}</small>
            </section>
            <section className="my-profile-side-card my-profile-verification-card">
              <p>VERIFICATION</p>
              <div className={`my-profile-verification-row ${emailVerified ? "is-verified" : ""}`}><i>{emailVerified ? "✓" : "@"}</i><span><strong>{emailVerified ? "Email confirmed" : "Email confirmation needed"}</strong><small>{emailVerified ? "Your account email is confirmed." : "Complete account setup to confirm this email."}</small></span></div>
              <div className={`my-profile-verification-row ${nameVerified ? "is-verified" : ""}`}><i>{nameVerified ? "✓" : "○"}</i><span><strong>{nameVerified ? "Name verified" : "Name not verified"}</strong><small>{nameVerified ? "Your profile has a name-verification trust signal." : "Name verification will be available as a separate identity check."}</small></span></div>
              {!nameVerified && <button type="button" onClick={() => showNotice("Name verification will be available after the identity-check flow is connected.")}>Verify your name <b>→</b></button>}
            </section>
            <section className="my-profile-side-card">
              <p>NEXT STEPS</p><ul>{!profileComplete && <li><Link href="/account-setup?return=/profile">Finish account setup <b>→</b></Link></li>}<li><button type="button" onClick={() => setActiveTab("Work")}>Add a work sample <b>→</b></button></li><li><button type="button" onClick={() => setIsAvailable(true)}>Confirm availability <b>→</b></button></li><li><Link href={requestHref}>Post a clear request <b>→</b></Link></li></ul>
            </section>
            <section className="my-profile-side-note"><span>✦</span><p>Contact details stay private. Requote is designed to start conversations with the right context.</p></section>
          </aside>
        </div>
      </main>
      {notice && <div className="my-profile-toast" role="status">{notice}</div>}
    </div>
  );
}
