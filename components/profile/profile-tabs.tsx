"use client";

import { nextProfileTab } from "@/lib/profile-preview";

export function ProfileTabs<T extends string>({ tabs, active, onChange, prefix, className }: {
  tabs: readonly T[]; active: T; onChange: (tab: T) => void; prefix: string; className: string;
}) {
  return <div className={className} role="tablist" aria-label="Profile content">
    {tabs.map((tab) => <button key={tab} type="button" role="tab"
      id={`${prefix}-tab-${tab.toLowerCase()}`}
      aria-controls={`${prefix}-panel-${tab.toLowerCase()}`}
      aria-selected={active === tab} tabIndex={active === tab ? 0 : -1}
      className={active === tab ? "is-active" : ""}
      onClick={() => onChange(tab)}
      onKeyDown={(event) => {
        const next = nextProfileTab(tabs, tab, event.key);
        if (!next) return;
        event.preventDefault(); onChange(next);
        document.getElementById(`${prefix}-tab-${next.toLowerCase()}`)?.focus();
      }}>{tab}</button>)}
  </div>;
}
