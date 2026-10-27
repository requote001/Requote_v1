import test from "node:test";
import assert from "node:assert/strict";
import { normaliseSetup, mergeSavedProfileEdits, readSetupDraft, setupDraftKey } from "./account-setup.ts";
import { getProfilePlaceholder } from "./profile-placeholders.ts";
import { PROFILE_KEY, profileEditValues, profileEditIssues, readLocalProfile,
  saveLocalProfile, saveLocalPreference, publicProfileView, nextProfileTab } from "./profile-preview.ts";

const member = {
  authenticated: true, name: "Alex Morgan", email: "alex@example.invalid",
  headline: "Product designer", location: "Lagos, Nigeria", professionalOverview: "Designing useful tools.", professionalFocus: "Product design",
  roles: ["provider", "investor"], primaryRole: "provider", role: "Provider",
  profileComplete: true, emailVerified: true, nameVerified: false,
  publicProfile: true, isAvailable: false,
  roleDetails: { provider: { businessType: "Independent professional", businessName: "Old name", services: "Design", categories: "Creative", serviceAreas: "Remote", email: "private@example.invalid" }, investor: { sectors: "Technology", interests: "Partnerships" }, employer: { companyName: "Private draft" } },
};
function storage(initial = member) {
  const map = new Map([[PROFILE_KEY, JSON.stringify(initial)]]);
  return { getItem: (key) => map.get(key) ?? null, setItem: (key, value) => map.set(key, value) };
}
test("profile edits persist only approved fields and preserve roles and trust state", () => {
  const local = storage();
  const values = { ...profileEditValues(member), name: "  Alex Doe  ", email: "hijack@x.invalid", nameVerified: true, profileComplete: false, roles: ["employer"] };
  const next = saveLocalProfile(local, member, values);
  assert.equal(next.name, "Alex Doe");
  assert.equal(readLocalProfile(local).name, "Alex Doe");
  for (const key of ["email", "roles", "primaryRole", "roleDetails", "nameVerified", "emailVerified", "profileComplete"])
    assert.deepEqual(next[key], member[key], key);
});
test("profile validation catches required blanks and length limits", () => {
  const values = profileEditValues(member);
  assert.deepEqual(profileEditIssues(values), {});
  const issues = profileEditIssues({ ...values, name: "  ", location: "", headline: "a".repeat(141), skills: "a".repeat(301) });
  assert.deepEqual(Object.keys(issues), ["name", "headline", "location", "skills"]);
  const local = storage();
  assert.throws(() => saveLocalProfile(local, member, { ...values, name: "" }), /highlighted/);
  assert.equal(readLocalProfile(local).name, member.name);
});
test("preference changes persist after reload and leave other profile fields intact", () => {
  const local = storage();
  const privateMember = saveLocalPreference(local, member, "publicProfile", false);
  const available = saveLocalPreference(local, privateMember, "isAvailable", true);
  assert.equal(readLocalProfile(local).publicProfile, false);
  assert.equal(available.isAvailable, true);
  assert.equal(available.nameVerified, false);
  assert.throws(() => saveLocalPreference(local, available, "nameVerified", true), /not supported/);
});
test("storage failures never return a saved result or overwrite previous data", () => {
  const local = storage();
  const broken = { getItem: local.getItem, setItem() { throw new Error("Storage is full"); } };
  assert.throws(() => saveLocalProfile(broken, member, { ...profileEditValues(member), name: "Changed" }), /Storage is full/);
  assert.throws(() => saveLocalPreference(broken, member, "publicProfile", false), /Storage is full/);
  assert.equal(readLocalProfile(local).name, member.name);
  assert.equal(readLocalProfile(local).publicProfile, true);
});
test("account changes and sign-out prevent writes from a stale editor", () => {
  for (const next of [{ ...member, email: "other@example.invalid" }, { ...member, authenticated: false }, null]) {
    const local = storage(next);
    assert.throws(() => saveLocalProfile(local, member, profileEditValues(member)));
    assert.throws(() => saveLocalPreference(local, member, "publicProfile", false));
  }
  assert.throws(() => readLocalProfile({ getItem: () => "{", setItem() {} }));
  for (const patch of [{ name: {} }, { roles: [3] }, { nameVerified: "true" }])
    assert.throws(() => readLocalProfile(storage({ ...member, ...patch })), /could not be read/);
});
test("concurrent edits conflict while unrelated changes are preserved", () => {
  const local = storage({ ...member, headline: "Updated elsewhere" });
  assert.throws(() => saveLocalProfile(local, member, profileEditValues(member)), /another view/);
  const fresh = readLocalProfile(local);
  const changed = saveLocalPreference(local, fresh, "publicProfile", false);
  assert.throws(() => saveLocalPreference(local, fresh, "publicProfile", true), /another view/);
  const next = saveLocalProfile(local, fresh, { ...profileEditValues(fresh), name: "New name" });
  assert.equal(next.publicProfile, changed.publicProfile);
  assert.equal(next.headline, "Updated elsewhere");
});
test("private profiles expose no public projection and missing consent defaults private", () => {
  assert.equal(publicProfileView(normaliseSetup({ ...member, publicProfile: false })), null);
  assert.equal(publicProfileView(normaliseSetup({ name: "Private member" })), null);
});
test("public projection strips private contact details, unselected drafts and hidden business name", () => {
  const view = publicProfileView(normaliseSetup({ ...member, phone: "+234xxx", password: "secret", address: "Private address" }));
  assert.equal(view.name, member.name);
  assert.deepEqual(view.roles, member.roles);
  for (const key of ["email", "phone", "address", "password", "authenticated", "emailVerified", "nameVerified", "profileComplete"])
    assert.equal(Object.hasOwn(view, key), false, key);
  assert.equal(view.roleDetails.employer, undefined);
  assert.equal(view.roleDetails.provider.businessName, undefined);
  assert.equal(view.roleDetails.provider.email, undefined);
  assert.equal(view.roleDetails.investor.sectors, "Technology");
});
test("every role has a public branch without sharing arbitrary private keys", () => {
  const roles = ["requester", "provider", "employee", "employer", "investor"];
  const form = normaliseSetup({ ...member, roles });
  for (const role of roles) form.roleDetails[role].privateNote = "Do not share";
  const view = publicProfileView(form);
  assert.deepEqual(Object.keys(view.roleDetails), roles);
  assert.equal(JSON.stringify(view).includes("Do not share"), false);
});
test("fixture lookup preserves identity, does not fabricate missing profiles or reuse portfolios", () => {
  assert.equal(getProfilePlaceholder("fatima-bello").name, "Fatima Bello");
  for (const slug of ["missing-person", "__proto__", "constructor", "toString", ""]) assert.equal(getProfilePlaceholder(slug), null);
  for (const slug of ["kelechi-okafor", "tunde-alabi", "bilikisu-sani"]) {
    const fixture = getProfilePlaceholder(slug);
    assert.equal(fixture.slug, slug);
    assert.deepEqual(fixture.workSamples, []);
    assert.deepEqual(fixture.posts, []);
  }
});
test("profile tabs support arrow wraparound, Home and End without hijacking Tab", () => {
  const tabs = ["Overview", "Work", "Activity"];
  assert.equal(nextProfileTab(tabs, "Overview", "ArrowLeft"), "Activity");
  assert.equal(nextProfileTab(tabs, "Activity", "ArrowRight"), "Overview");
  assert.equal(nextProfileTab(tabs, "Work", "Home"), "Overview");
  assert.equal(nextProfileTab(tabs, "Work", "End"), "Activity");
  assert.equal(nextProfileTab(tabs, "Work", "Tab"), null);
});
test("newer profile edits survive older setup drafts without discarding role changes", () => {
  const local = storage();
  const draft = { version: 2, owner: member.email, step: 2, savedAt: "2020-01-01T00:00:00.000Z", form: normaliseSetup(member) };
  draft.form.roleDetails.provider.services = "An unfinished role edit";
  const edited = saveLocalProfile(local, member, { ...profileEditValues(member), name: "New name" });
  const hidden = saveLocalPreference(local, edited, "publicProfile", false);
  const merged = mergeSavedProfileEdits(draft, hidden);
  assert.equal(merged.name, "New name");
  assert.equal(merged.publicProfile, false);
  assert.equal(merged.roleDetails.provider.services, "An unfinished role edit");
  const newerDraft = { ...draft, savedAt: "2099-01-01T00:00:00.000Z" };
  assert.equal(mergeSavedProfileEdits(newerDraft, hidden).name, member.name);
  local.setItem(setupDraftKey(member.email), JSON.stringify({ ...draft, savedAt: "not a date" }));
  assert.throws(() => readSetupDraft(local, member.email), /could not be read/);
});
