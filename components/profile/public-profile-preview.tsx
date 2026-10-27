import Link from "next/link";
import { setupRoleLabel } from "@/lib/account-setup";
import type { PublicProfileView } from "@/lib/profile-preview";
import { ProfileRoleSections } from "./profile-role-sections";

/** Receives public fields only; never receives the local auth/account record. */
export function PublicProfilePreview({ profile }: { profile: PublicProfileView | null }) {
  return <div className="my-profile-page"><main className="my-profile-shell">
    <div className="profile-preview-banner"><div><strong>Public-view preview</strong><p>Only public profile fields are shown. This browser-only preview is not a shareable public page.</p></div><Link href="/profile">← Back to your profile</Link></div>
    {!profile ? <section className="my-profile-panel profile-unavailable"><span aria-hidden="true">○</span><h1>This profile is private.</h1><p>Other members would not see your profile details. You can change visibility from your profile.</p><Link href="/profile">Manage visibility</Link></section> : <>
      <section className="my-profile-hero" aria-labelledby="public-preview-name">
        <div className="my-profile-hero__surface" aria-hidden="true"><span /><span /><span /></div>
        <div className="my-profile-hero__content"><div className="my-profile-avatar" aria-hidden="true">{profile.name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "RM"}</div>
          <div className="my-profile-hero__identity"><p>Member profile · preview</p><h1 id="public-preview-name">{profile.name || "Requote member"}</h1>
            <div className="my-profile-hero__meta"><span>{profile.headline || "Introduction not added yet"}</span><span>{profile.location || "Location not shared"}</span><span>{profile.isAvailable ? "Open to relevant opportunities · self-reported" : "Availability not shared"}</span></div>
            <div className="my-profile-chip-list">{profile.roles.map((role) => <span key={role}>{setupRoleLabel(role)}{role === profile.primaryRole ? " · Primary" : ""}</span>)}</div>
          </div>
        </div>
      </section>
      <div className="my-profile-layout"><div className="my-profile-overview">
        <section className="my-profile-panel"><div className="my-profile-panel__heading"><div><p>ABOUT</p><h2>A little professional context.</h2></div></div><p>{profile.professionalOverview || "No overview shared yet."}</p>
          <dl className="profile-context-list">{profile.professionalFocus && <div><dt>Professional focus</dt><dd>{profile.professionalFocus}</dd></div>}{profile.professionalLevel && <div><dt>Professional level · self-reported</dt><dd>{profile.professionalLevel}</dd></div>}</dl>
          {profile.skills && <div className="my-profile-chip-list">{profile.skills.split(",").map((skill) => skill.trim()).filter(Boolean).map((skill, index) => <span key={index}>{skill}</span>)}</div>}
        </section>
        <ProfileRoleSections profile={profile} />
        <section className="my-profile-panel"><div className="my-profile-panel__heading"><div><p>SELECTED WORK</p><h2>No work samples shared yet.</h2></div></div><p>Work will appear here only when the owner adds and publishes it.</p></section>
      </div><aside className="my-profile-sidebar"><section className="my-profile-side-card"><p>YOUR PRIVACY</p><h2>Context, not contact details.</h2><span>Email, phone, account settings, and setup drafts are not part of this view. Profile completion does not mean verified identity.</span></section></aside></div>
    </>}
  </main></div>;
}
