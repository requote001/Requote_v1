"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ProfilePlaceholder, ProfileWorkSample } from "@/lib/profile-placeholders";
import { ProfileDialog } from "./profile-dialog";
import { ProfileTabs } from "./profile-tabs";
import "./profile-features.css";

type ProfileTab = "Overview" | "Work" | "Posts";

const requestHref = "/post-a-request?journey=request&source=home";

export function ProviderProfile({ profile }: { profile: ProfilePlaceholder }) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("Overview");
  const [notice, setNotice] = useState("");
  const [work, setWork] = useState<ProfileWorkSample | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function showNotice(message: string) {
    setNotice(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(""), 4500);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(new URL(`/profiles/${encodeURIComponent(profile.slug)}`, window.location.origin).href);
      showNotice("Example profile link copied.");
    } catch { showNotice("The link could not be copied. You can copy this page’s address from your browser."); }
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
        <div className="profile-preview-banner"><div><strong>Example profile · product preview</strong><p>Names, projects, and posts here are sample content, not verified member credentials. Follow and messaging are not connected.</p></div><button type="button" onClick={copyLink}>Copy profile link ↗</button></div>
        <nav className="provider-profile-breadcrumb" aria-label="Breadcrumb">
          <Link href="/home">Home</Link><span>/</span><span>{profile.profileKind}</span>
        </nav>

        <section className="provider-profile-hero" aria-labelledby="provider-profile-name">
          <div className="provider-profile-hero__surface" aria-hidden="true"><span /><span /><span /></div>
          <div className="provider-profile-hero__content">
            <span className="provider-profile-avatar" aria-hidden="true">{profile.initials}</span>
            <div className="provider-profile-hero__identity">
              <p>{profile.profileKind}</p>
              <h1 id="provider-profile-name">{profile.name}</h1>
              <div className="provider-profile-hero__meta"><span>{profile.headline}</span><span>{profile.location}</span><span>{profile.availability}</span></div>
              <p className="provider-profile-hero__intro">{profile.intro}</p>
            </div>
            <div className="provider-profile-hero__actions">
              <button className="provider-profile-follow" type="button" aria-disabled="true" onClick={() => showNotice("Following is not available in this preview. No follow request has been sent.")}>Follow</button>
              <button className="provider-profile-message" type="button" aria-disabled="true" onClick={() => showNotice("Messaging will be available when the communication layer is connected. No message has been sent.")}>Message</button>
              <Link className="provider-profile-request" href={requestHref}>Post a request</Link>
            </div>
          </div>
        </section>

        <div className="provider-profile-layout">
          <section className="provider-profile-main" aria-label={`${profile.name} profile content`}>
            <ProfileTabs tabs={["Overview", "Work", "Posts"] as const} active={activeTab} onChange={setActiveTab} prefix="provider-profile" className="provider-profile-tabs" />

            {activeTab === "Overview" && (
              <div className="provider-profile-overview" id="provider-profile-panel-overview" role="tabpanel" aria-labelledby="provider-profile-tab-overview" tabIndex={0}>
                <section className="provider-profile-panel">
                  <div className="provider-profile-panel__heading"><p>ABOUT</p><h2>{profile.aboutTitle}</h2></div>
                  <p>{profile.about}</p>
                </section>
                <section className="provider-profile-panel">
                  <div className="provider-profile-panel__heading"><p>SERVICES</p><h2>What they work on</h2></div>
                  {profile.services.length ? <div className="provider-profile-service-list">{profile.services.map((service) => <span key={service}>{service}</span>)}</div> : <p>No services shared yet.</p>}
                </section>
                <section className="provider-profile-panel">
                  <div className="provider-profile-panel__heading"><p>SELECTED WORK</p><button type="button" onClick={() => setActiveTab("Work")}>See all work →</button></div>
                  <div className="provider-profile-work-grid">
                    {profile.workSamples.map((sample) => <WorkCard key={sample.title} sample={sample} onView={() => setWork(sample)} />)}
                  </div>
                  {!profile.workSamples.length && <p>No public work samples yet.</p>}
                </section>
              </div>
            )}

            {activeTab === "Work" && (
              <section className="provider-profile-panel provider-profile-panel--work" id="provider-profile-panel-work" role="tabpanel" aria-labelledby="provider-profile-tab-work" tabIndex={0}>
                <div className="provider-profile-panel__heading"><p>WORK SAMPLES</p><h2>Recent project context</h2></div>
                <div className="provider-profile-work-grid">
                  {profile.workSamples.map((sample) => <WorkCard key={sample.title} sample={sample} onView={() => setWork(sample)} />)}
                  {!profile.workSamples.length && <article className="provider-profile-work-empty"><strong>No public work samples yet</strong><p>Only work this member chooses to publish will appear here.</p></article>}
                </div>
              </section>
            )}

            {activeTab === "Posts" && (
              <section className="provider-profile-post-list" id="provider-profile-panel-posts" role="tabpanel" aria-labelledby="provider-profile-tab-posts" tabIndex={0}>
                {profile.posts.length > 0 ? profile.posts.map((post) => (
                  <article className="provider-profile-post-card" key={post.title}>
                    <header><span className="provider-profile-post-avatar">{profile.initials}</span><div><strong>{profile.name}</strong><small>{post.time} · {post.label}</small></div></header>
                    <h2>{post.title}</h2><p>{post.copy}</p>
                    <footer><button type="button" onClick={() => showNotice("Post details will open in the next milestone.")}>View post</button><button type="button" onClick={() => showNotice("Sharing will be available when posts are connected.")}>Share</button></footer>
                  </article>
                )) : <article className="provider-profile-post-card provider-profile-post-card--empty"><span>✦</span><h2>No public posts yet</h2><p>Public updates will appear here when this member shares them through Requote.</p></article>}
              </section>
            )}
          </section>

          <aside className="provider-profile-sidebar" aria-label="Provider details">
            <section className="provider-profile-side-card">
              <p>WORKING TOGETHER</p><h2>Start with one clear request.</h2><span>Share scope, location, timing, and the outcome you need. This preview does not send or notify {profile.name}.</span><Link href={requestHref}>Create a request →</Link>
            </section>
            <section className="provider-profile-side-card">
              <p>PROFILE DETAILS</p><dl><div><dt>Primary category</dt><dd>{profile.category}</dd></div><div><dt>Service area</dt><dd>{profile.serviceArea}</dd></div><div><dt>Preferred work</dt><dd>{profile.preferredWork}</dd></div></dl>
            </section>
            <section className="provider-profile-side-note"><span>✦</span><p>Contact details are kept private. Use a request or message context to start a conversation.</p></section>
          </aside>
        </div>
      </main>
      {work && <ProfileDialog title={work.title} onClose={() => setWork(null)}><div className="profile-work-detail"><p className="profile-work-detail__label">EXAMPLE WORK SAMPLE</p><h3>{work.type}</h3><p>{work.note}</p><p>This illustrates project context only. No completion, review, or identity verification is implied.</p></div></ProfileDialog>}
      {notice && <div className="provider-profile-toast" role="status">{notice}</div>}
    </div>
  );
}

function WorkCard({ sample, onView }: { sample: ProfileWorkSample; onView: () => void }) {
  return <article className="provider-profile-work-card"><div className={`provider-profile-work-card__visual provider-profile-work-card__visual--${sample.tone}`}><span>{sample.type}</span><strong>Project context, kept clear.</strong></div><div><small>{sample.type}</small><h3>{sample.title}</h3><p>{sample.note}</p><button type="button" onClick={onView}>View work sample</button></div></article>;
}
