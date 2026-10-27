"use client";

import Link from "next/link";
import {
  safeAvatar,
  normaliseSetup,
  selectedSetupRoles,
  setupRole,
  setupRoleLabel,
} from "@/lib/account-setup";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PROFILE_KEY, publicProfileView, readLocalProfile, saveLocalPreference, type PreviewProfileMember as MockMember } from "@/lib/profile-preview";
import { ProfileEditor } from "./profile-editor";
import { ProfileTabs } from "./profile-tabs";
import { ProfileRoleSections } from "./profile-role-sections";
import { PublicProfilePreview } from "./public-profile-preview";
import "./profile-features.css";

type ProfileTab = "Overview" | "Work" | "Activity";

const requestHref = "/post-a-request?journey=request&source=home";

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "RM"
  );
}

function profileSummary(role: string) {
  const summaries: Record<string, string> = {
    Client:
      "Share clear requirements, keep conversations in one place, and find the people who fit the work.",
    Provider:
      "Use your profile to show the work you do, the context you need, and the opportunities that suit you.",
    Employer:
      "Build a sharper hiring signal by sharing the teams, roles, and outcomes you are working toward.",
    Professional:
      "Make it easier for the right people to understand your strengths, availability, and work direction.",
    Investor:
      "Keep a concise public presence for the sectors, conversations, and opportunities you want to explore.",
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
  const [profileComplete, setProfileComplete] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [nameVerified, setNameVerified] = useState(false);
  const [notice, setNotice] = useState("");
  const [loadError, setLoadError] = useState("");
  const [editing, setEditing] = useState(false);
  const noticeTimer = useRef<number | null>(null);

  useEffect(() => {
    const load = () => {
      try {
        if (!window.localStorage.getItem(PROFILE_KEY)) {
          window.location.replace("/login?next=/profile");
          return;
        }
        const parsed = readLocalProfile(window.localStorage);
        setLoadError("");
        setMember(parsed);
        setRole(parsed.role || "Client");
        setProfileComplete(parsed.profileComplete ?? false);
        setIsAvailable(parsed.isAvailable === true);
        setIsPublic(parsed.publicProfile === true);
        setEmailVerified(parsed.emailVerified ?? false);
        setNameVerified(
          (searchParams.get("preview") === "1" && searchParams.get("verification") === "verified") ||
            (parsed.nameVerified ?? false),
        );
        setReady(true);
      } catch (issue) {
        setLoadError(issue instanceof Error ? issue.message : "Your local profile could not be loaded.");
      }
    };
    const frame = window.requestAnimationFrame(load);
    const changed = (event: StorageEvent) => {
      if (event.key === PROFILE_KEY || event.key === null) load();
    };
    window.addEventListener("storage", changed);
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener("storage", changed); };
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
    if (
      member?.roles?.length &&
      !selectedSetupRoles(member).map(setupRoleLabel).includes(nextRole)
    )
      return;
    try {
      const parsed = readLocalProfile(window.localStorage);
      if (parsed.email !== member?.email) throw new Error("Your preview account changed. Reload before switching roles.");
      const nextRoleId = setupRole(nextRole);
      if (!nextRoleId || !selectedSetupRoles(parsed).includes(nextRoleId)) return;
      const next = {
          ...parsed,
          role: nextRole,
          activeRole: setupRole(nextRole),
        };
      window.localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
      setMember(next); setRole(nextRole);
    } catch (issue) {
      showNotice(issue instanceof Error ? issue.message : "Your role could not be saved. Try again.");
    }
  }

  function updatePreference(key: "publicProfile" | "isAvailable", value: boolean) {
    if (!member) return;
    try {
      const next = saveLocalPreference(window.localStorage, member, key, value);
      setMember(next); setIsPublic(next.publicProfile === true); setIsAvailable(next.isAvailable === true);
      showNotice("Preference saved in this browser preview.");
    } catch (issue) {
      showNotice(issue instanceof Error ? issue.message : "Preference could not be saved. Please try again.");
    }
  }

  if (loadError) return <div className="my-profile-page"><main className="my-profile-shell"><section className="my-profile-panel profile-unavailable"><h1>We couldn’t load your profile.</h1><p role="alert">{loadError}</p><button type="button" onClick={() => window.location.reload()}>Try again</button><Link href="/login?next=/profile">Back to sign in</Link></section></main></div>;

  if (!ready || !member) {
    return (
      <main className="my-profile-loading" aria-label="Loading your profile">
        <span />
        <span />
        <span />
      </main>
    );
  }

  const memberName = member.name || "Requote member";
  const setup = normaliseSetup(member);
  const publicView = publicProfileView(setup);
  if (searchParams.get("view") === "public") return <PublicProfilePreview profile={publicView} />;
  const roleOptions = member.roles?.length
    ? selectedSetupRoles(member).map(setupRoleLabel)
    : [role];
  const focus = roleFocus(role);
  const memberLocation = member.location || "Add your location";
  const profileIntro =
    member.professionalOverview ||
    member.about ||
    member.headline ||
    "This is the public context people use to understand how to work with you. You stay in control of what is shared.";

  return (
    <div className="my-profile-page">
      <header className="my-profile-topbar">
        <div className="my-profile-topbar__inner">
          <Link
            className="my-profile-brand"
            href="/home"
            aria-label="Requote home"
          >
            <img src="/requote-logo.png" alt="Requote" />
          </Link>
          <nav className="my-profile-nav" aria-label="Workspace navigation">
            <Link href="/home">Home</Link>
            <Link href={requestHref}>Requests</Link>
            <button
              type="button"
              onClick={() =>
                showNotice("Your network will grow as connections are added.")
              }
            >
              My network
            </button>
          </nav>
          <div className="my-profile-topbar__actions">
            <Link className="my-profile-back" href="/home">
              Back to home
            </Link>
            <Link className="my-profile-post" href={requestHref}>
              Post a request
            </Link>
          </div>
        </div>
      </header>

      <main className="my-profile-shell">
        <div className="profile-preview-banner"><div><strong>Profile workspace · preview</strong><p>Edits and preferences are saved in this browser only. Live profiles and verification are not connected.</p></div><Link href="/profile?view=public">Preview public view ↗</Link></div>
        <div className="my-profile-breadcrumb">
          <Link href="/home">Home</Link>
          <span>/</span>
          <span>Your profile</span>
        </div>

        <section className="my-profile-hero" aria-labelledby="my-profile-title">
          <div className="my-profile-hero__surface">
            <span />
            <span />
            <span />
          </div>
          <div className="my-profile-hero__content">
            <div className="my-profile-avatar" aria-hidden="true">
              {safeAvatar(member.avatarDataUrl) ? (
                <img
                  src={safeAvatar(member.avatarDataUrl)}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "12px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                getInitials(memberName)
              )}
            </div>
            <div className="my-profile-hero__identity">
              <p>Your Requote profile</p>
              <h1 id="my-profile-title">{memberName}</h1>
              <div className="my-profile-hero__meta">
                <span>{member.headline || role}</span>
                <span>{memberLocation}</span>
                <span>
                  {isAvailable
                    ? "Open to relevant opportunities"
                    : "Availability paused"}
                </span>
                {nameVerified && (
                  <strong className="my-profile-verified-badge">
                    ✓ Name verified
                  </strong>
                )}
              </div>
              <p className="my-profile-hero__intro">{profileIntro}</p>
            </div>
            <div className="my-profile-hero__actions">
              {profileComplete ? (
                <>
                  <button type="button" onClick={() => setEditing(true)}>
                    Edit profile
                  </button>
                  <Link href="/profile?view=public">Preview public profile</Link>
                </>
              ) : (
                <Link href="/account-setup?return=/profile">
                  Continue setup <span>→</span>
                </Link>
              )}
            </div>
          </div>
        </section>

        {!profileComplete && (
          <section className="my-profile-setup-banner">
            <div>
              <small>ACCOUNT SETUP IN PROGRESS</small>
              <strong>
                Finish a few details to make your profile ready to share.
              </strong>
              <p>
                Add your location, role context, and visibility preferences. You
                can change them later.
              </p>
            </div>
            <Link href="/account-setup?return=/profile">
              Continue setup <span>→</span>
            </Link>
          </section>
        )}

        <div className="my-profile-layout">
          <div className="my-profile-main">
            <ProfileTabs tabs={["Overview", "Work", "Activity"] as const} active={activeTab} onChange={setActiveTab} prefix="my-profile" className="my-profile-tabs" />

            {activeTab === "Overview" && (
              <div
                className="my-profile-overview"
                id="my-profile-panel-overview"
                role="tabpanel"
                aria-labelledby="my-profile-tab-overview"
                tabIndex={0}
              >
                <section className="my-profile-panel">
                  <div className="my-profile-panel__heading">
                    <div>
                      <p>PROFILE SUMMARY</p>
                      <h2>Make the right first impression.</h2>
                    </div>
                    <button type="button" onClick={() => setEditing(true)}>Edit</button>
                  </div>
                  <p>{profileSummary(role)}</p>
                  <div className="my-profile-chip-list">
                    {focus.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  {member.skills && (
                    <>
                      <p>Skills and strengths</p>
                      <div className="my-profile-chip-list">
                        {member.skills
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean)
                          .map((item, index) => (
                            <span key={item + index}>{item}</span>
                          ))}
                      </div>
                    </>
                  )}
                  {(member.professionalFocus ||
                    member.professionalLevel ||
                    member.professionalOverview) && (
                    <div className="my-profile-professional-context">
                      <div>
                        <small>WHAT YOU DO</small>
                        <strong>
                          {member.professionalFocus || "Not added yet"}
                        </strong>
                      </div>
                      <div>
                        <small>PROFESSIONAL LEVEL</small>
                        <strong>
                          {member.professionalLevel || "Not added yet"}
                        </strong>
                      </div>
                      {member.professionalOverview && (
                        <p>{member.professionalOverview}</p>
                      )}
                    </div>
                  )}
                </section>

                <section className="my-profile-panel">
                  <div className="my-profile-panel__heading">
                    <div>
                      <p>HOW YOU PARTICIPATE</p>
                      <h2>Your current role</h2>
                    </div>
                  </div>
                  <p>
                    Select the point of view that best fits what you are doing
                    now. This changes your preview context only.
                  </p>
                  <label className="my-profile-role-select">
                    <span>Working as</span>
                    <select
                      value={role}
                      onChange={(event) => updateRole(event.target.value)}
                    >
                      {roleOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                  <div className="my-profile-chip-list">
                    {roleOptions.map((option) => (
                      <span key={option}>
                        {option}
                        {setupRole(member.primaryRole) &&
                        setupRoleLabel(member.primaryRole!) === option
                          ? " · Primary"
                          : ""}
                      </span>
                    ))}
                  </div>
                  <p>
                    <Link href="/account-setup?return=/profile">
                      Manage your roles and details
                    </Link>
                  </p>
                </section>

                <section className="my-profile-panel">
                  <div className="my-profile-panel__heading">
                    <div>
                      <p>VISIBILITY</p>
                      <h2>Control your profile presence.</h2>
                    </div>
                  </div>
                  <div className="my-profile-toggle-list">
                    <div className="my-profile-toggle-row">
                      <div>
                        <strong>Public profile</strong>
                        <p>
                          Let people see your name, public role, and any work
                          you choose to share.
                        </p>
                      </div>
                      <button
                        className={`my-profile-switch ${isPublic ? "is-on" : ""}`}
                        type="button"
                        role="switch"
                        aria-checked={isPublic}
                        aria-label="Toggle public profile"
                        onClick={() => updatePreference("publicProfile", !isPublic)}
                      >
                        <span />
                      </button>
                    </div>
                    <div className="my-profile-toggle-row">
                      <div>
                        <strong>Open to relevant opportunities</strong>
                        <p>
                          Show that you are available for requests, work, or
                          conversations that fit your role.
                        </p>
                      </div>
                      <button
                        className={`my-profile-switch ${isAvailable ? "is-on" : ""}`}
                        type="button"
                        role="switch"
                        aria-checked={isAvailable}
                        aria-label="Toggle opportunity availability"
                        onClick={() => updatePreference("isAvailable", !isAvailable)}
                      >
                        <span />
                      </button>
                    </div>
                  </div>
                  <small className="my-profile-preview-note">
                    Saved in this browser only. These are preview preferences,
                    not server-enforced privacy controls.
                  </small>
                </section>
                <ProfileRoleSections profile={publicView || { roles: setup.roles, roleDetails: setup.roleDetails }} />
              </div>
            )}

            {activeTab === "Work" && (
              <section
                className="my-profile-panel my-profile-panel--empty"
                id="my-profile-panel-work"
                role="tabpanel"
                aria-labelledby="my-profile-tab-work"
                tabIndex={0}
              >
                <div className="my-profile-empty-icon" aria-hidden="true">
                  ▧
                </div>
                <p>WORK SAMPLES</p>
                <h2>Give people a little more context.</h2>
                <span>
                  When you are ready, add examples that show the type of work,
                  outcomes, or opportunities you want to be known for.
                </span>
                <button
                  type="button"
                  onClick={() =>
                    showNotice(
                      "Adding work samples will be connected in the next profile milestone.",
                    )
                  }
                >
                  Add a work sample
                </button>
              </section>
            )}

            {activeTab === "Activity" && (
              <section
                className="my-profile-panel my-profile-panel--empty"
                id="my-profile-panel-activity"
                role="tabpanel"
                aria-labelledby="my-profile-tab-activity"
                tabIndex={0}
              >
                <div className="my-profile-empty-icon" aria-hidden="true">
                  ◌
                </div>
                <p>ACTIVITY</p>
                <h2>Your activity will appear here.</h2>
                <span>
                  Requests, updates, offers, and helpful contributions will stay
                  organised on your profile as the product is connected.
                </span>
                <Link href={requestHref}>Create your first request</Link>
              </section>
            )}
          </div>

          <aside className="my-profile-sidebar" aria-label="Profile guidance">
            <section className="my-profile-side-card my-profile-side-card--status">
              <p>PROFILE STATUS</p>
              <h2>
                {profileComplete
                  ? "Core details complete"
                  : "Setup in progress"}
              </h2>
              <span>
                {profileComplete
                  ? "Your preview details are saved in this browser. Add work when it helps people understand your fit."
                  : "Add the essentials so people have enough context to begin the right conversation."}
              </span>
              <small>
                {profileComplete
                  ? "Local profile preview"
                  : "Continue setup to review your progress"}
              </small>
            </section>
            <section className="my-profile-side-card my-profile-verification-card">
              <p>VERIFICATION</p>
              <div
                className={`my-profile-verification-row ${emailVerified ? "is-verified" : ""}`}
              >
                <i>{emailVerified ? "✓" : "@"}</i>
                <span>
                  <strong>
                    {emailVerified
                      ? "Email confirmed"
                      : "Email confirmation needed"}
                  </strong>
                  <small>
                    {emailVerified
                      ? "Your account email is confirmed."
                      : "Complete account setup to confirm this email."}
                  </small>
                </span>
              </div>
              <div
                className={`my-profile-verification-row ${nameVerified ? "is-verified" : ""}`}
              >
                <i>{nameVerified ? "✓" : "○"}</i>
                <span>
                  <strong>
                    {nameVerified ? "Name verified" : "Name not verified"}
                  </strong>
                  <small>
                    {nameVerified
                      ? "Your profile has a name-verification trust signal."
                      : "Name verification will be available as a separate identity check."}
                  </small>
                </span>
              </div>
              {!nameVerified && (
                <button
                  type="button"
                  onClick={() =>
                    showNotice(
                      "Name verification will be available after the identity-check flow is connected.",
                    )
                  }
                >
                  Verify your name <b>→</b>
                </button>
              )}
            </section>
            <section className="my-profile-side-card">
              <p>NEXT STEPS</p>
              <ul>
                {!profileComplete && (
                  <li>
                    <Link href="/account-setup?return=/profile">
                      Finish account setup <b>→</b>
                    </Link>
                  </li>
                )}
                <li>
                  <button type="button" onClick={() => setActiveTab("Work")}>
                    Add a work sample <b>→</b>
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => updatePreference("isAvailable", true)}>
                    Confirm availability <b>→</b>
                  </button>
                </li>
                <li>
                  <Link href={requestHref}>
                    Post a clear request <b>→</b>
                  </Link>
                </li>
              </ul>
            </section>
            <section className="my-profile-side-note">
              <span>✦</span>
              <p>
                Contact details stay private. Requote is designed to start
                conversations with the right context.
              </p>
            </section>
          </aside>
        </div>
      </main>
      {editing && <ProfileEditor member={member} onClose={() => setEditing(false)} onSaved={(next) => { setMember(next); setEditing(false); showNotice("Profile changes saved in this browser."); }} />}
      {notice && (
        <div className="my-profile-toast" role="status">
          {notice}
        </div>
      )}
    </div>
  );
}
