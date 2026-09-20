"use client";

import Link from "next/link";
import { useState } from "react";

type ProfileTab = "Overview" | "Work" | "Posts";

const requestHref = "/post-a-request?journey=request&source=home";

const workSamples = [
  {
    title: "Commercial steel stair and handrail system",
    type: "Fabrication · Lagos",
    note: "Designed for a high-traffic commercial entry with a durable powder-coated finish.",
    tone: "steel",
  },
  {
    title: "Custom retail display framework",
    type: "Fit-out · Victoria Island",
    note: "Modular frame system built to support seasonal merchandising and quick reconfiguration.",
    tone: "blueprint",
  },
] as const;

const profilePosts = [
  {
    label: "Shared request",
    time: "2h ago",
    title: "Need a professional lead photographer for a 3-day Lagos wedding in November",
    copy: "Sharing a well-scoped request from the network for providers who may be a strong fit.",
  },
  {
    label: "Project update",
    time: "Yesterday",
    title: "What helps a commercial fabrication brief move faster",
    copy: "Clear dimensions, site context, and the intended finish give a project team a much better place to start.",
  },
] as const;

export function ProviderProfile() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("Overview");
  const [following, setFollowing] = useState(false);
  const [notice, setNotice] = useState("");

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  function toggleFollow() {
    const nextValue = !following;
    setFollowing(nextValue);
    showNotice(nextValue ? "You are now following Chinedu Works Ltd." : "You unfollowed Chinedu Works Ltd.");
  }

  return (
    <div className="provider-profile-page">
      <header className="provider-profile-topbar">
        <div className="provider-profile-topbar__inner">
          <Link className="feed-brand" href="/home" aria-label="Requote home feed">
            <img src="/requote-logo.png" alt="Requote" />
          </Link>
          <nav className="provider-profile-nav" aria-label="Workspace navigation">
            <Link href="/home">Home</Link>
            <Link href={requestHref}>Requests</Link>
            <button type="button" onClick={() => showNotice("Network discovery is part of the next product milestone.")}>Network</button>
          </nav>
          <div className="provider-profile-topbar__actions">
            <Link className="provider-profile-back" href="/home">← Back to feed</Link>
            <Link className="provider-profile-post" href={requestHref}>Post a request</Link>
          </div>
        </div>
      </header>

      <main className="provider-profile-shell">
        <nav className="provider-profile-breadcrumb" aria-label="Breadcrumb">
          <Link href="/home">Home</Link><span>/</span><span>Provider profile</span>
        </nav>

        <section className="provider-profile-hero" aria-labelledby="provider-profile-name">
          <div className="provider-profile-hero__surface" aria-hidden="true"><span /><span /><span /></div>
          <div className="provider-profile-hero__content">
            <span className="provider-profile-avatar" aria-hidden="true">CW</span>
            <div className="provider-profile-hero__identity">
              <p>Provider profile</p>
              <h1 id="provider-profile-name">Chinedu Works Ltd.</h1>
              <div className="provider-profile-hero__meta"><span>Fabrication &amp; commercial fit-out</span><span>Lagos, Nigeria</span><span>Availability self-reported</span></div>
              <p className="provider-profile-hero__intro">A project-focused fabrication team working on commercial metalwork, structural detailing, and practical finishing for spaces that need to perform every day.</p>
            </div>
            <div className="provider-profile-hero__actions">
              <button className={"provider-profile-follow " + (following ? "is-following" : "")} type="button" aria-pressed={following} onClick={toggleFollow}>{following ? "Following" : "Follow"}</button>
              <button className="provider-profile-message" type="button" onClick={() => showNotice("Messaging will be available when the communication layer is connected.")}>Message</button>
              <Link className="provider-profile-request" href={requestHref}>Request a quote</Link>
            </div>
          </div>
        </section>

        <div className="provider-profile-layout">
          <section className="provider-profile-main" aria-label="Chinedu Works profile content">
            <div className="provider-profile-tabs" role="tablist" aria-label="Profile content">
              {(["Overview", "Work", "Posts"] as ProfileTab[]).map((tab) => (
                <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? "is-active" : ""} onClick={() => setActiveTab(tab)}>{tab}</button>
              ))}
            </div>

            {activeTab === "Overview" && (
              <div className="provider-profile-overview">
                <section className="provider-profile-panel">
                  <div className="provider-profile-panel__heading"><p>ABOUT</p><h2>Built for briefs that need precision.</h2></div>
                  <p>Chinedu Works Ltd. supports commercial projects from early fabrication planning through site-ready installation. Their work is organized around clear scope, practical materials, and delivery expectations that teams can coordinate around.</p>
                </section>
                <section className="provider-profile-panel">
                  <div className="provider-profile-panel__heading"><p>SERVICES</p><h2>What they work on</h2></div>
                  <div className="provider-profile-service-list"><span>Commercial metalwork</span><span>Structural fabrication</span><span>Retail &amp; office fit-out</span><span>Custom handrails &amp; frames</span></div>
                </section>
                <section className="provider-profile-panel">
                  <div className="provider-profile-panel__heading"><p>SELECTED WORK</p><button type="button" onClick={() => setActiveTab("Work")}>See all work →</button></div>
                  <div className="provider-profile-work-grid">
                    {workSamples.map((sample) => <WorkCard key={sample.title} sample={sample} onView={() => showNotice("Work sample details will open in the next milestone.")} />)}
                  </div>
                </section>
              </div>
            )}

            {activeTab === "Work" && (
              <section className="provider-profile-panel provider-profile-panel--work">
                <div className="provider-profile-panel__heading"><p>WORK SAMPLES</p><h2>Recent project context</h2></div>
                <div className="provider-profile-work-grid">
                  {workSamples.map((sample) => <WorkCard key={sample.title} sample={sample} onView={() => showNotice("Work sample details will open in the next milestone.")} />)}
                  <article className="provider-profile-work-empty"><span>+</span><strong>More work coming soon</strong><p>This preview keeps the portfolio focused while more samples are added.</p></article>
                </div>
              </section>
            )}

            {activeTab === "Posts" && (
              <section className="provider-profile-post-list" aria-label="Chinedu Works posts">
                {profilePosts.map((post) => (
                  <article className="provider-profile-post-card" key={post.title}>
                    <header><span className="provider-profile-post-avatar">CW</span><div><strong>Chinedu Works Ltd.</strong><small>{post.time} · {post.label}</small></div></header>
                    <h2>{post.title}</h2><p>{post.copy}</p>
                    <footer><button type="button" onClick={() => showNotice("Post details will open in the next milestone.")}>View post</button><button type="button" onClick={() => showNotice("Sharing will be available when posts are connected.")}>Share</button></footer>
                  </article>
                ))}
              </section>
            )}
          </section>

          <aside className="provider-profile-sidebar" aria-label="Provider details">
            <section className="provider-profile-side-card">
              <p>WORKING TOGETHER</p><h2>Start with one clear request.</h2><span>Share scope, location, timing, and the outcome you need. Chinedu can respond if the work fits.</span><Link href={requestHref}>Create a request →</Link>
            </section>
            <section className="provider-profile-side-card">
              <p>PROFILE DETAILS</p><dl><div><dt>Primary category</dt><dd>Fabrication</dd></div><div><dt>Service area</dt><dd>Lagos and nearby</dd></div><div><dt>Preferred work</dt><dd>Commercial projects</dd></div></dl>
            </section>
            <section className="provider-profile-side-note"><span>✦</span><p>Contact details are kept private. Use a request or message context to start a conversation.</p></section>
          </aside>
        </div>
      </main>
      {notice && <div className="provider-profile-toast" role="status">{notice}</div>}
    </div>
  );
}

function WorkCard({ sample, onView }: { sample: (typeof workSamples)[number]; onView: () => void }) {
  return <article className="provider-profile-work-card"><div className={`provider-profile-work-card__visual provider-profile-work-card__visual--${sample.tone}`}><span>{sample.type}</span><strong>Project context, kept clear.</strong></div><div><small>{sample.type}</small><h3>{sample.title}</h3><p>{sample.note}</p><button type="button" onClick={onView}>View work sample</button></div></article>;
}
