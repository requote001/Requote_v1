import { act, useState, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProfileEditor } from "@/components/profile/profile-editor";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { PublicProfilePreview } from "@/components/profile/public-profile-preview";
import { PROFILE_KEY, publicProfileView, type PreviewProfileMember } from "@/lib/profile-preview";
import { normaliseSetup } from "@/lib/account-setup";

vi.mock("next/link", () => ({ default: ({ children, href, ...props }: { children: ReactNode; href: string }) => <a href={href} {...props}>{children}</a> }));

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
const member: PreviewProfileMember = {
  authenticated: true, name: "Alex Morgan", email: "private@example.invalid",
  location: "Lagos, Nigeria", headline: "Designer", professionalFocus: "Product design",
  roles: ["provider"], role: "Provider", publicProfile: true,
};
let container: HTMLDivElement;
let root: Root;
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem(PROFILE_KEY, JSON.stringify(member));
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  // jsdom has no native dialog implementation: test our lifecycle, not browser focus trapping.
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.restoreAllMocks();
});
async function render(element: ReactNode) { await act(async () => root.render(element)); }
async function change(name: string, value: string) {
  const field = container.querySelector<HTMLInputElement>(`input[name="${name}"]`)!;
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(field, value);
    field.dispatchEvent(new Event("input", { bubbles: true }));
  });
}
async function submit() { await act(async () => container.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))); }

describe("profile editor component", () => {
  it("opens a labelled dialog and saves edited data without closing on validation errors", async () => {
    const onSaved = vi.fn(), onClose = vi.fn();
    await render(<ProfileEditor member={member} onSaved={onSaved} onClose={onClose} />);
    expect(container.querySelector("dialog")?.hasAttribute("open")).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");
    await change("name", "");
    await submit();
    expect(onSaved).not.toHaveBeenCalled();
    expect(container.querySelector('[name="name"]')?.getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(container.querySelector('[name="name"]'));
    await change("name", "Alex Doe");
    await submit();
    expect(onSaved).toHaveBeenCalledWith(expect.objectContaining({ name: "Alex Doe", email: member.email }));
    expect(JSON.parse(localStorage.getItem(PROFILE_KEY)!).name).toBe("Alex Doe");
  });
  it("guards Escape and page exits when edits are unsaved", async () => {
    const onClose = vi.fn();
    await render(<ProfileEditor member={member} onSaved={vi.fn()} onClose={onClose} />);
    await change("headline", "A new headline");
    const exit = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(exit);
    expect(exit.defaultPrevented).toBe(true);
    await act(async () => container.querySelector("dialog")!.dispatchEvent(new Event("cancel", { cancelable: true })));
    expect(onClose).not.toHaveBeenCalled();
    expect(container.textContent).toContain("Discard your unsaved changes?");
    const discard = [...container.querySelectorAll("button")].find((button) => button.textContent === "Discard changes")!;
    await act(async () => discard.click());
    expect(onClose).toHaveBeenCalledOnce();
  });
  it("retains input and shows an error when browser storage fails", async () => {
    const onSaved = vi.fn();
    await render(<ProfileEditor member={member} onSaved={onSaved} onClose={vi.fn()} />);
    await change("name", "Alex Doe");
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Storage is full"); });
    await submit();
    expect(onSaved).not.toHaveBeenCalled();
    expect(container.querySelector('[role="alert"]')?.textContent).toContain("Storage is full");
    expect(container.querySelector<HTMLInputElement>('[name="name"]')!.value).toBe("Alex Doe");
  });
  it("does not overwrite a profile changed while the editor is open", async () => {
    const onSaved = vi.fn();
    await render(<ProfileEditor member={member} onSaved={onSaved} onClose={vi.fn()} />);
    await change("name", "Alex Doe");
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...member, name: "Newer name" }));
    await submit();
    expect(onSaved).not.toHaveBeenCalled();
    expect(container.querySelector('[role="alert"]')?.textContent).toContain("another view");
    expect(JSON.parse(localStorage.getItem(PROFILE_KEY)!).name).toBe("Newer name");
  });
});
describe("public-view and navigation components", () => {
  it("shows public context without leaking private account details", async () => {
    const profile = publicProfileView(normaliseSetup(member));
    await render(<PublicProfilePreview profile={profile} />);
    expect(container.textContent).toContain(member.name);
    expect(container.textContent).not.toContain(member.email);
    expect(container.textContent).toContain("not a shareable public page");
    expect(container.querySelector("input")).toBeNull();
  });
  it("has a private-profile state without identity details", async () => {
    await render(<PublicProfilePreview profile={null} />);
    expect(container.textContent).toContain("This profile is private.");
    expect(container.textContent).not.toContain(member.name);
  });
  it("supports roving keyboard focus on profile tabs", async () => {
    function Tabs() {
      const [active, setActive] = useState<"Overview" | "Work" | "Activity">("Overview");
      return <ProfileTabs tabs={["Overview", "Work", "Activity"] as const} active={active} onChange={setActive} prefix="test-profile" className="tabs" />;
    }
    await render(<Tabs />);
    const first = container.querySelector<HTMLButtonElement>('[role="tab"]')!;
    first.focus();
    await act(async () => first.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, cancelable: true })));
    expect(document.activeElement?.id).toBe("test-profile-tab-activity");
    expect(document.activeElement?.getAttribute("aria-selected")).toBe("true");
    expect(first.tabIndex).toBe(-1);
  });
});
