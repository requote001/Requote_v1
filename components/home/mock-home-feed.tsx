"use client";

import Link from "next/link";
import {
  safeAvatar,
  selectedSetupRoles,
  setupRole,
  setupRoleLabel,
} from "@/lib/account-setup";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  feedFilters,
  filterPreviewPosts,
  isPreviewProfileComplete,
  type FeedFilter,
  type FeedPost,
} from "@/lib/home-preview";
import "./home-dashboard.css";

type MockMember = {
  authenticated?: boolean;
  name?: string;
  email?: string;
  role?: string;
  profileComplete?: boolean;
  location?: string;
  headline?: string;
  roles?: string[];
  avatarDataUrl?: string;
};
type IconName =
  | "home"
  | "people"
  | "request"
  | "message"
  | "bell"
  | "profile"
  | "save"
  | "settings"
  | "help"
  | "shield"
  | "search"
  | "close"
  | "chevron"
  | "arrow"
  | "plus"
  | "check"
  | "image"
  | "logout";
const paths: Record<IconName, string> = {
  home: "m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z",
  people:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  request: "M9 5H5v16h14V5h-4M9 3h6v4H9Zm-1 9h8m-8 4h5",
  message: "M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 1 1 17-5Z",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
  profile: "M20 21v-2a7 7 0 0 0-14 0v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  save: "M6 3h12v18l-6-4-6 4Z",
  settings:
    "m9 3-1 3-3 1-2 4 2 2v4l4 3 3-1 3 1 4-3v-4l2-2-2-4-3-1-1-3Zm6 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  help: "M9 9a3 3 0 1 1 5 2c-2 1-2 2-2 3m0 3h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z",
  shield: "m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6Zm-4 10 3 3 5-6",
  search: "m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
  close: "m6 6 12 12M6 18 18 6",
  chevron: "m6 9 6 6 6-6",
  arrow: "M4 12h16m-6-6 6 6-6 6",
  plus: "M12 5v14M5 12h14",
  check: "m5 12 4 4L19 6",
  image: "M3 3h18v18H3Zm0 13 6-6 8 11m-3-6 3-3 4 4M16 7h.01",
  logout: "M9 3H4v18h5m5-14 5 5-5 5m-5-5h12",
};
function Icon({ name }: { name: IconName }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
function Avatar({
  name,
  tone = "blue",
  photo,
}: {
  name: string;
  tone?: string;
  photo?: string;
}) {
  return (
    <span className={`mock-avatar mock-avatar--${tone}`}>
      {safeAvatar(photo) ? (
        <img
          src={safeAvatar(photo)}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "inherit",
            objectFit: "cover",
          }}
        />
      ) : (
        name
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((p) => p[0]?.toUpperCase())
          .join("") || "RM"
      )}
    </span>
  );
}

const requestHref = "/post-a-request?journey=request&source=home";
const setupHref = "/account-setup?return=/home";
const people = [
  {
    name: "Kelechi Okafor",
    detail: "Electrical contracting",
    slug: "kelechi-okafor",
  },
  { name: "Tunde Alabi", detail: "Catering & logistics", slug: "tunde-alabi" },
  {
    name: "Bilikisu Sani",
    detail: "Agriculture & supply",
    slug: "bilikisu-sani",
  },
];
const navItems: { icon: IconName; label: string }[] = [
  { icon: "home", label: "Home" },
  { icon: "people", label: "My network" },
  { icon: "request", label: "Requests" },
  { icon: "message", label: "Messages" },
  { icon: "bell", label: "Notifications" },
  { icon: "profile", label: "Profile" },
];
type Panel = { title: string; content: ReactNode };

function PreviewDialog({
  panel,
  onClose,
}: {
  panel: Panel;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    dialog?.showModal();
    return () => {
      dialog?.close();
      requestAnimationFrame(() => {
        if (opener?.isConnected) opener.focus();
      });
    };
  }, []);
  return (
    <dialog
      className="dashboard-dialog"
      ref={ref}
      aria-labelledby="dashboard-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dashboard-dialog__inner">
        <header>
          <span className="dashboard-eyebrow">REQUOTE · PRODUCT PREVIEW</span>
          <button
            type="button"
            className="dashboard-icon-button"
            aria-label="Close panel"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </header>
        <h2 id="dashboard-dialog-title">{panel.title}</h2>
        {panel.content}
      </div>
    </dialog>
  );
}

export function MockHomeFeed({
  profileMode,
}: {
  profileMode?: "complete" | "incomplete";
}) {
  const [member, setMember] = useState<MockMember | null>(null);
  const [role, setRole] = useState("Client");
  const [profileComplete, setProfileComplete] = useState(false);
  const [followed, setFollowed] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [filter, setFilter] = useState<FeedFilter>("For you");
  const [savedOnly, setSavedOnly] = useState(false);
  const [notice, setNotice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [panel, setPanel] = useState<Panel | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const parsed = JSON.parse(
          localStorage.getItem("requote_mock_auth") || "null",
        ) as MockMember | null;
        if (!parsed?.authenticated) {
          window.location.replace("/login?next=/home");
          return;
        }
        setMember(parsed);
        setRole(parsed.role || "Client");
        setProfileComplete(
          isPreviewProfileComplete(parsed.profileComplete, profileMode),
        );
      } catch {
        window.location.replace("/login?next=/home");
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [profileMode]);
  useEffect(
    () => () => {
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    },
    [],
  );
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node))
        setProfileMenuOpen(false);
      if (!searchRef.current?.contains(event.target as Node))
        setSearchOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (profileMenuOpen) {
        setProfileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
      setSearchOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [profileMenuOpen]);

  function showNotice(message: string) {
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    setNotice(message);
    noticeTimerRef.current = setTimeout(() => setNotice(""), 4000);
  }
  function toggleFollow(slug: string, name: string) {
    const exists = followed.includes(slug);
    setFollowed((current) =>
      exists ? current.filter((value) => value !== slug) : [...current, slug],
    );
    showNotice(
      `${exists ? "Unfollowed" : "Following"} ${name} in this preview.`,
    );
  }
  function toggleSave(post: FeedPost) {
    const exists = saved.includes(post.id);
    setSaved((current) =>
      exists ? current.filter((id) => id !== post.id) : [...current, post.id],
    );
    showNotice(
      exists
        ? "Removed from your saved preview posts."
        : "Saved for this preview session.",
    );
  }
  function signOut() {
    localStorage.removeItem("requote_mock_auth");
    window.location.assign("/login");
  }
  function updateRole(next: string) {
    if (
      member?.roles?.length &&
      !selectedSetupRoles(member).includes(
        setupRole(next) as ReturnType<typeof selectedSetupRoles>[number],
      )
    )
      return;
    setRole(next);
    try {
      localStorage.setItem(
        "requote_mock_auth",
        JSON.stringify({ ...member, role: next, activeRole: setupRole(next) }),
      );
    } catch {
      showNotice("Role updated for this visit only.");
    }
  }
  function showSaved() {
    setSavedOnly(true);
    setProfileMenuOpen(false);
    feedRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }
  function chooseFilter(next: FeedFilter, scroll = false) {
    setFilter(next);
    setSavedOnly(false);
    if (scroll)
      feedRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }
  function openUnavailable(title: string, message: string) {
    setProfileMenuOpen(false);
    setPanel({
      title,
      content: (
        <>
          <p>{message}</p>
          <div className="dashboard-panel-note">
            <Icon name="help" />
            <span>
              This is a frontend preview. No message, notification, application,
              or offer is sent.
            </span>
          </div>
          <button
            className="dashboard-action"
            type="button"
            onClick={() => setPanel(null)}
          >
            Back to your feed <Icon name="arrow" />
          </button>
        </>
      ),
    });
  }
  function openPost(post: FeedPost) {
    setPanel({
      title: post.title,
      content: (
        <>
          <p className="dashboard-eyebrow">{post.type} · EXAMPLE CONTENT</p>
          <Link
            className="dashboard-panel-author"
            href={`/profiles/${post.slug}`}
          >
            <Avatar name={post.author} tone={post.tone} />
            <span>
              {post.author}
              <small>{post.role}</small>
            </span>
            <Icon name="arrow" />
          </Link>
          <p>{post.description}</p>
          <div className="feed-meta">
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="dashboard-panel-note">
            <Icon name="shield" />
            <span>
              Illustrative content, not a live {post.type.toLowerCase()}. No
              provider availability, payment protection, or verification is
              implied.
            </span>
          </div>
          <Link className="dashboard-action" href={`/profiles/${post.slug}`}>
            View {post.type === "Work sample" ? "portfolio" : "author profile"}{" "}
            <Icon name="arrow" />
          </Link>
        </>
      ),
    });
  }
  function openNetwork() {
    setPanel({
      title: "Build a useful network.",
      content: (
        <>
          <p>
            Explore these example profiles. Follow actions on the feed update
            the Following filter for this preview session.
          </p>
          <div className="dashboard-network-list">
            {people.map((person) => (
              <Link href={`/profiles/${person.slug}`} key={person.slug}>
                <Avatar name={person.name} />
                <span>
                  <strong>{person.name}</strong>
                  <small>{person.detail}</small>
                </span>
                <Icon name="arrow" />
              </Link>
            ))}
          </div>
        </>
      ),
    });
  }
  function handleNav(label: string) {
    setProfileMenuOpen(false);
    if (label === "Home") {
      chooseFilter("For you", true);
      return;
    }
    if (label === "Requests") {
      chooseFilter("Requests", true);
      return;
    }
    if (label === "Profile") {
      window.location.assign("/profile");
      return;
    }
    if (label === "My network") {
      openNetwork();
      return;
    }
    if (label === "Messages") {
      openUnavailable(
        "Your conversations, in one place.",
        "Messaging is not connected yet. When available, your project conversations and quote discussions will live here.",
      );
      return;
    }
    openUnavailable(
      "You’re up to date in this preview.",
      "Live notifications are not connected. Important changes to your requests, offers, and network will appear here when the service is available.",
    );
  }

  if (!member)
    return (
      <main className="feed-loading" aria-label="Loading your Requote feed">
        <span />
        <span />
        <span />
      </main>
    );
  const name = member.name?.trim() || "Requote member";
  const firstName = name.split(" ")[0];
  const posts = filterPreviewPosts(filter, followed, saved, savedOnly);
  const emptyTitle = savedOnly
    ? "Keep something for later."
    : filter === "Following"
      ? followed.length
        ? "Your connections have room to grow."
        : "Your network starts with a follow."
      : "Your activity will start here.";
  const filterTitle = savedOnly ? "Saved posts" : filter;

  return (
    <div className="feed-app dashboard">
      <a href="#feed-main" className="dashboard-skip">
        Skip to feed
      </a>
      <header className="feed-topbar">
        <div className="feed-topbar__inner">
          <Link className="feed-brand" href="/home" aria-label="Requote home">
            <img
              src="/requote-logo.png"
              alt="Requote"
              width="124"
              height="38"
            />
          </Link>
          <div className="feed-search" ref={searchRef} role="search">
            <Icon name="search" />
            <input
              ref={searchInputRef}
              type="search"
              aria-label="Search Requote"
              aria-controls={
                searchOpen && searchQuery.trim()
                  ? "feed-search-results"
                  : undefined
              }
              value={searchQuery}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              placeholder="Search Requote"
            />
            {searchQuery && (
              <button
                className="dashboard-icon-button"
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setSearchQuery("");
                  searchInputRef.current?.focus();
                }}
              >
                <Icon name="close" />
              </button>
            )}
            {searchOpen && searchQuery.trim() && (
              <div
                className="feed-search-popover"
                id="feed-search-results"
                role="status"
              >
                <Icon name="search" />
                <strong>No results for “{searchQuery.trim()}”</strong>
                <p>
                  Live search isn’t connected in this preview. No people or
                  requests have been searched.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    searchInputRef.current?.focus();
                  }}
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
          <nav className="feed-topnav" aria-label="Account navigation">
            <button
              type="button"
              className="dashboard-header-tool"
              aria-label="Messages"
              onClick={() => handleNav("Messages")}
            >
              <Icon name="message" />
            </button>
            <button
              type="button"
              className="dashboard-header-tool"
              aria-label="Notifications"
              onClick={() => handleNav("Notifications")}
            >
              <Icon name="bell" />
            </button>
            <div className="feed-profile-menu" ref={menuRef}>
              <button
                className="feed-user-button"
                ref={menuButtonRef}
                type="button"
                aria-label="Open account menu"
                aria-expanded={profileMenuOpen}
                aria-controls="profile-menu"
                onClick={() => setProfileMenuOpen((value) => !value)}
              >
                <Avatar name={name} tone="navy" photo={member?.avatarDataUrl} />
                <span>{firstName}</span>
                <span className="feed-chevron">
                  <Icon name="chevron" />
                </span>
              </button>
              {profileMenuOpen && (
                <div className="feed-profile-dropdown" id="profile-menu">
                  <div className="feed-profile-dropdown__identity">
                    <Avatar
                      name={name}
                      tone="navy"
                      photo={member?.avatarDataUrl}
                    />
                    <span>
                      <strong>{name}</strong>
                      <small>{member.email || "Preview account"}</small>
                    </span>
                  </div>
                  <Link href="/profile">
                    <Icon name="profile" />
                    View profile
                  </Link>
                  <Link href={setupHref}>
                    <Icon name="settings" />
                    {profileComplete
                      ? "Edit profile details"
                      : "Continue account setup"}
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      openUnavailable(
                        "Account settings",
                        "Profile details can be edited in account setup. Privacy, security, and notification settings are planned for the connected account experience.",
                      )
                    }
                  >
                    <Icon name="settings" />
                    Account settings
                  </button>
                  <a href="mailto:info@requote.cc">
                    <Icon name="help" />
                    Help & support
                  </a>
                  <button type="button" onClick={showSaved}>
                    <Icon name="save" />
                    Saved posts ({saved.length})
                  </button>
                  <div className="dashboard-menu-role">
                    <label htmlFor="dashboard-menu-role">Preview role</label>
                    <select
                      id="dashboard-menu-role"
                      value={role}
                      onChange={(e) => updateRole(e.target.value)}
                    >
                      {(member?.roles?.length
                        ? selectedSetupRoles(member).map(setupRoleLabel)
                        : [role]
                      ).map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </div>
                  <button type="button" onClick={signOut}>
                    <Icon name="logout" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      <div className="feed-layout">
        <aside className="feed-sidebar" aria-label="Workspace navigation">
          <section className="feed-profile-card">
            <div className="dashboard-profile-cover" />
            <Avatar name={name} tone="navy" photo={member?.avatarDataUrl} />
            <Link href="/profile" className="dashboard-profile-name">
              {name}
            </Link>
            <span className="feed-profile-meta">
              {member.headline || role}
              {member.location ? ` · ${member.location}` : ""}
            </span>
            {profileComplete ? (
              <Link className="dashboard-profile-link" href="/profile">
                View your profile <Icon name="arrow" />
              </Link>
            ) : (
              <>
                <div className="dashboard-setup-label">
                  <span>Profile setup</span>
                  <span>In progress</span>
                </div>
                <Link className="dashboard-profile-link" href={setupHref}>
                  Complete your profile <Icon name="arrow" />
                </Link>
              </>
            )}
          </section>
          <nav
            className="feed-side-nav"
            aria-label="Primary workspace navigation"
          >
            {navItems.map((item) => (
              <button
                className={
                  !savedOnly &&
                  item.label === (filter === "Requests" ? "Requests" : "Home")
                    ? "is-active"
                    : ""
                }
                key={item.label}
                type="button"
                aria-current={
                  !savedOnly &&
                  item.label === (filter === "Requests" ? "Requests" : "Home")
                    ? "page"
                    : undefined
                }
                onClick={() => handleNav(item.label)}
              >
                <Icon name={item.icon} />
                {item.label}
              </button>
            ))}
          </nav>
          <nav
            className="feed-side-nav feed-side-nav--secondary"
            aria-label="Support navigation"
          >
            <button
              type="button"
              className={savedOnly ? "is-active" : ""}
              onClick={() => {
                setSavedOnly(true);
                feedRef.current?.scrollIntoView({
                  block: "start",
                  behavior: "instant",
                });
              }}
            >
              <Icon name="save" />
              Saved posts
              {saved.length > 0 && (
                <span className="dashboard-count">{saved.length}</span>
              )}
            </button>
            <Link href="/trust-safety">
              <Icon name="shield" />
              Trust & safety
            </Link>
            <a href="mailto:info@requote.cc">
              <Icon name="help" />
              Help & support
            </a>
          </nav>
          <section className="feed-role-switcher">
            <label htmlFor="dashboard-role">Preview role</label>
            <select
              id="dashboard-role"
              value={role}
              onChange={(e) => updateRole(e.target.value)}
            >
              {(member?.roles?.length
                ? selectedSetupRoles(member).map(setupRoleLabel)
                : [role]
              ).map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
            <p>
              Switch between your selected roles.{" "}
              <Link href={setupHref}>Manage roles</Link>
            </p>
          </section>
          <p className="dashboard-preview-note">
            Frontend preview
            <br />
            Example content · not live activity
          </p>
        </aside>

        <main className="feed-main" id="feed-main" aria-labelledby="feed-title">
          <div className="feed-welcome">
            <div>
              <p className="feed-kicker">YOUR WORK. YOUR NETWORK.</p>
              <h1 id="feed-title">A little momentum, {firstName}.</h1>
              <p>Good people. Clearer briefs. Your next opportunity.</p>
            </div>
            <Link className="feed-primary-button" href={requestHref}>
              <Icon name="plus" />
              Post a request
            </Link>
          </div>
          <div className="dashboard-preview-banner">
            <span>PRODUCT PREVIEW</span>
            <p>
              A look at your Requote network. Posts and actions below are
              examples.
            </p>
          </div>
          {!profileComplete && (
            <section className="dashboard-mobile-setup">
              <Icon name="profile" />
              <div>
                <strong>Make your profile feel like you.</strong>
                <p>Add your experience, location, and professional focus.</p>
                <Link href={setupHref}>
                  Continue setup <Icon name="arrow" />
                </Link>
              </div>
            </section>
          )}
          <section className="feed-composer" aria-label="Create a post">
            <div className="feed-composer__row">
              <Avatar name={name} photo={member?.avatarDataUrl} />
              <button
                type="button"
                onClick={() =>
                  openUnavailable(
                    "What would you like to share?",
                    "Social updates aren’t connected yet. You can explore the in-platform request builder now, or add professional details to your profile.",
                  )
                }
              >
                What are you working on?
              </button>
            </div>
            <div className="feed-composer__actions">
              <Link href={requestHref}>
                <Icon name="request" />
                Request
              </Link>
              <button
                type="button"
                onClick={() =>
                  openUnavailable(
                    "Share an update",
                    "The update composer will be available when social posting is connected. Nothing you type or see in this feed is published.",
                  )
                }
              >
                <Icon name="message" />
                Update
              </button>
              <Link href="/profile">
                <Icon name="image" />
                Work sample
              </Link>
            </div>
          </section>
          <div className="dashboard-filter-heading" ref={feedRef}>
            <div className="feed-tabs" role="group" aria-label="Feed filters">
              {feedFilters.map((tab) => (
                <button
                  className={!savedOnly && filter === tab ? "is-active" : ""}
                  key={tab}
                  type="button"
                  aria-pressed={!savedOnly && filter === tab}
                  onClick={() => chooseFilter(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            {savedOnly && (
              <div className="dashboard-saved-heading">
                <h2>
                  Saved posts <span>{saved.length}</span>
                </h2>
                <button type="button" onClick={() => chooseFilter("For you")}>
                  Back to feed
                </button>
              </div>
            )}
          </div>
          <div
            className="feed-stream"
            aria-label={savedOnly ? "Saved posts" : `${filterTitle} posts`}
          >
            {posts.map((post) => (
              <article className="feed-card" key={post.id}>
                <header className="feed-card__header">
                  <Link
                    className="feed-author-avatar-link"
                    href={`/profiles/${post.slug}`}
                    aria-label={`View ${post.author} profile`}
                  >
                    <Avatar name={post.author} tone={post.tone} />
                  </Link>
                  <div>
                    <Link
                      className="feed-author-name-link"
                      href={`/profiles/${post.slug}`}
                    >
                      {post.author}
                    </Link>
                    <span>{post.role}</span>
                    <small>Example {post.type.toLowerCase()}</small>
                  </div>
                  <button
                    type="button"
                    className="dashboard-icon-button dashboard-save"
                    aria-label={`${saved.includes(post.id) ? "Unsave" : "Save"} ${post.title}`}
                    aria-pressed={saved.includes(post.id)}
                    onClick={() => toggleSave(post)}
                  >
                    <Icon name={saved.includes(post.id) ? "check" : "save"} />
                  </button>
                </header>
                <span
                  className={`feed-pill feed-pill--${post.type === "Work sample" ? "green" : post.type === "Opportunity" ? "orange" : "blue"}`}
                >
                  {post.type}
                </span>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
                {post.type === "Work sample" && (
                  <div className="dashboard-work-image">
                    <img
                      src="/figma/digital-services.jpg"
                      alt="A fabricator at work in a steel workshop"
                      loading="lazy"
                      width="640"
                      height="360"
                    />
                    <small>Illustrative workshop image</small>
                  </div>
                )}
                <div className="feed-meta">
                  {post.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <footer className="feed-card__footer">
                  <button
                    className="feed-small-button"
                    type="button"
                    onClick={() => openPost(post)}
                  >
                    {post.action}
                    <Icon name="arrow" />
                  </button>
                  {post.type === "Work sample" ? (
                    <button
                      type="button"
                      className="feed-follow-button"
                      aria-pressed={followed.includes(post.slug)}
                      onClick={() => toggleFollow(post.slug, "Fatima")}
                    >
                      <Icon
                        name={followed.includes(post.slug) ? "check" : "plus"}
                      />
                      {followed.includes(post.slug)
                        ? "Following Fatima"
                        : "Follow Fatima"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        openUnavailable(
                          post.type === "Request"
                            ? "Make an offer"
                            : "Express interest",
                          post.type === "Request"
                            ? "Offers will be enabled when live requests and provider profiles are connected. This example request cannot receive an offer."
                            : "Applications and expressions of interest aren’t connected yet. This opportunity is an example, not an open position.",
                        )
                      }
                    >
                      {post.type === "Request"
                        ? "Make an offer"
                        : "Express interest"}
                    </button>
                  )}
                </footer>
              </article>
            ))}
            {!posts.length && (
              <section className="dashboard-empty">
                <span>
                  <Icon
                    name={
                      savedOnly
                        ? "save"
                        : filter === "Following"
                          ? "people"
                          : "message"
                    }
                  />
                </span>
                <h2>{emptyTitle}</h2>
                <p>
                  {savedOnly
                    ? "Use the bookmark on any example post to save it for this visit."
                    : filter === "Following"
                      ? followed.length
                        ? "The people you follow do not have posts in this example feed yet. Try following Fatima from her work sample."
                        : "Follow Fatima from her work sample to see her posts here. Your choices stay in this preview session."
                      : "There are no posts from you in this preview. Explore the request builder to see how your next brief comes together."}
                </p>
                <button
                  type="button"
                  className="dashboard-action"
                  onClick={() => chooseFilter("For you")}
                >
                  Explore the feed <Icon name="arrow" />
                </button>
              </section>
            )}
            <article className="feed-guidance-card">
              <Icon name="shield" />
              <div>
                <small>THE REQUOTE WAY</small>
                <strong>Clear scope. A shared understanding.</strong>
                <p>The best work starts when everyone understands the brief.</p>
                <Link href="/trust-safety">
                  Explore our approach <Icon name="arrow" />
                </Link>
              </div>
            </article>
            <p className="dashboard-feed-end">
              You’ve reached the end of this preview.
              <br />
              <span>A little context goes a long way.</span>
            </p>
          </div>
        </main>

        <aside className="feed-rightbar" aria-label="Feed support panels">
          {!profileComplete && (
            <section className="feed-right-card feed-setup-card">
              <div className="feed-right-card__heading">
                <small>YOUR NEXT STEP</small>
                <Icon name="profile" />
              </div>
              <h2>A stronger first impression.</h2>
              <p>
                Tell people what you do, the experience you bring, and where you
                work.
              </p>
              <Link className="dashboard-setup-button" href={setupHref}>
                Continue profile setup <Icon name="arrow" />
              </Link>
              <small className="dashboard-quiet">
                You can keep exploring while you set up.
              </small>
            </section>
          )}
          <section className="feed-right-card">
            <div className="feed-right-card__heading">
              <small>PEOPLE TO DISCOVER</small>
              <button type="button" onClick={openNetwork}>
                View all
              </button>
            </div>
            <p className="dashboard-quiet">Meet a few example profiles.</p>
            {people.map((person) => (
              <div className="feed-suggestion" key={person.slug}>
                <Link
                  className="feed-author-avatar-link"
                  href={`/profiles/${person.slug}`}
                  aria-label={`View ${person.name} profile`}
                >
                  <Avatar name={person.name} tone="muted" />
                </Link>
                <div>
                  <Link
                    className="feed-author-name-link"
                    href={`/profiles/${person.slug}`}
                  >
                    {person.name}
                  </Link>
                  <small>{person.detail}</small>
                </div>
                <button
                  type="button"
                  aria-label={`${followed.includes(person.slug) ? "Unfollow" : "Follow"} ${person.name}`}
                  aria-pressed={followed.includes(person.slug)}
                  onClick={() => toggleFollow(person.slug, person.name)}
                >
                  <Icon
                    name={followed.includes(person.slug) ? "check" : "plus"}
                  />
                  <span>
                    {followed.includes(person.slug) ? "Following" : "Follow"}
                  </span>
                </button>
              </div>
            ))}
          </section>
          <section className="feed-right-card dashboard-opportunity-card">
            <div className="feed-right-card__heading">
              <small>FIND YOUR NEXT PROJECT</small>
              <Icon name="request" />
            </div>
            <h2>Start with a clearer brief.</h2>
            <p>Explore example requests and see the context behind the work.</p>
            <button
              className="dashboard-text-action"
              type="button"
              onClick={() => chooseFilter("Requests", true)}
            >
              Explore requests <Icon name="arrow" />
            </button>
          </section>
          <section className="feed-trust-card">
            <Icon name="shield" />
            <small>BUILT ON CLARITY</small>
            <h2>Good work starts with trust.</h2>
            <p>
              Understand the scope, keep the details together, and agree on the
              next step.
            </p>
            <Link href="/trust-safety">
              Our approach <Icon name="arrow" />
            </Link>
          </section>
          <footer className="dashboard-rail-footer">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <a href="mailto:info@requote.cc">Support</a>
            <span>© {new Date().getFullYear()} Requote</span>
          </footer>
        </aside>
      </div>
      <nav
        className="dashboard-mobile-nav"
        aria-label="Mobile workspace navigation"
      >
        {navItems
          .filter((item) =>
            ["Home", "Requests", "My network", "Profile"].includes(item.label),
          )
          .map((item) => (
            <button
              key={item.label}
              type="button"
              aria-current={
                item.label === (filter === "Requests" ? "Requests" : "Home")
                  ? "page"
                  : undefined
              }
              onClick={() => handleNav(item.label)}
            >
              <Icon name={item.icon} />
              <span>
                {item.label === "My network" ? "Network" : item.label}
              </span>
            </button>
          ))}
      </nav>
      {notice && (
        <div className="feed-toast" role="status">
          {notice}
        </div>
      )}
      {panel && <PreviewDialog panel={panel} onClose={() => setPanel(null)} />}
    </div>
  );
}
