import test from "node:test";
import assert from "node:assert/strict";
import {
  normaliseSetup,
  SETUP_ROLES,
  ROLE_FIELDS,
  changeSetupRole,
  setupIssues,
  allSetupIssues,
  setupDraftKey,
  readSetupDraft,
  writeSetupDraft,
  completeLocalSetup,
  safeAvatar,
  avatarFileIssue,
} from "./account-setup.ts";

function storage() {
  const map = new Map();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => map.set(key, value),
  };
}
function validForm(roles = ["requester"]) {
  const form = normaliseSetup({
    name: "Alex Morgan",
    location: "Lagos, Nigeria",
    professionalFocus: "Product design",
    professionalLevel: "Senior specialist",
    roles,
    primaryRole: roles[0],
  });
  for (const role of roles)
    for (const field of ROLE_FIELDS[role])
      form.roleDetails[role][field.key] =
        field.options?.[0] || "Relevant context";
  return form;
}
test("fresh setup has no guessed location or default visibility consent", () => {
  const form = normaliseSetup();
  assert.equal(form.location, "");
  assert.equal(form.publicProfile, false);
  assert.equal(form.isAvailable, false);
  assert.deepEqual(form.roles, []);
});
test("legacy labels migrate into stable, deduplicated role IDs", () => {
  assert.deepEqual(normaliseSetup({ role: "Professional" }).roles, [
    "employee",
  ]);
  assert.deepEqual(
    normaliseSetup({ roles: ["Client", "requester", "unknown", "investor"] })
      .roles,
    ["requester", "investor"],
  );
});
test("all five role branches validate independently", () => {
  for (const { id } of SETUP_ROLES)
    assert.deepEqual(allSetupIssues(validForm([id]), true), {}, id);
});
test("multi-role details survive deselection and primary role stays selected", () => {
  const form = validForm(["provider", "investor"]);
  const deselected = changeSetupRole(form, "provider");
  assert.equal(deselected.primaryRole, "investor");
  assert.deepEqual(
    changeSetupRole(deselected, "provider").roleDetails.provider,
    form.roleDetails.provider,
  );
});
test("registered businesses require a business name, individuals do not", () => {
  const form = validForm(["provider"]);
  form.roleDetails.provider.businessName = "";
  assert.deepEqual(setupIssues(form, 2), {});
  form.roleDetails.provider.businessType = "Registered business";
  assert.ok(setupIssues(form, 2)["provider.businessName"]);
});
test("empty roles, missing basics and unconfirmed email block completion", () => {
  const form = normaliseSetup();
  assert.ok(setupIssues(form, 0).name);
  assert.ok(setupIssues(form, 0).location);
  assert.ok(setupIssues(form, 2).roles);
  assert.ok(setupIssues(form, 3).email);
});
test("save/resume restores partial data, all roles and current step", () => {
  const db = storage();
  const form = validForm([
    "provider",
    "employer",
    "employee",
    "requester",
    "investor",
  ]);
  writeSetupDraft(db, "A@Example.com", form, 2);
  const draft = readSetupDraft(db, "a@example.com");
  assert.deepEqual(draft.form, form);
  assert.equal(draft.step, 2);
});
test("drafts are scoped to account email and malformed drafts fail explicitly", () => {
  const db = storage();
  writeSetupDraft(db, "a@example.com", validForm(), 1);
  assert.equal(readSetupDraft(db, "b@example.com"), null);
  db.setItem(setupDraftKey("a@example.com"), "bad json");
  assert.throws(() => readSetupDraft(db, "a@example.com"));
});
test("completion rereads email status and rejects a switched account", () => {
  const db = storage();
  db.setItem(
    "auth",
    JSON.stringify({
      authenticated: true,
      email: "a@example.com",
      emailVerified: false,
    }),
  );
  assert.throws(() =>
    completeLocalSetup(db, "auth", "a@example.com", validForm()),
  );
  db.setItem(
    "auth",
    JSON.stringify({
      authenticated: true,
      email: "b@example.com",
      emailVerified: true,
    }),
  );
  assert.throws(() =>
    completeLocalSetup(db, "auth", "a@example.com", validForm()),
  );
});
test("completion commits selected roles only and never changes identity verification", () => {
  const db = storage();
  db.setItem(
    "auth",
    JSON.stringify({
      authenticated: true,
      email: "a@example.com",
      emailVerified: true,
      nameVerified: false,
    }),
  );
  const form = validForm(["provider", "investor"]);
  form.roleDetails.employer.companyName = "Draft-only organisation";
  const member = completeLocalSetup(db, "auth", "a@example.com", form);
  assert.equal(member.profileComplete, true);
  assert.equal(member.nameVerified, false);
  assert.equal(member.role, "Provider");
  assert.deepEqual(Object.keys(member.roleDetails), ["provider", "investor"]);
  assert.equal(member.activeRole, "provider");
});
test("failed draft writes leave the existing profile untouched", () => {
  const db = storage();
  const auth = JSON.stringify({
    authenticated: true,
    email: "a@example.com",
    emailVerified: true,
  });
  db.setItem("auth", auth);
  const failing = {
    getItem: db.getItem,
    setItem() {
      throw new Error("Quota exceeded");
    },
  };
  assert.throws(() =>
    completeLocalSetup(failing, "auth", "a@example.com", validForm()),
  );
  assert.equal(db.getItem("auth"), auth);
});
test("avatar input accepts small raster data only, never SVG or remote URLs", () => {
  assert.equal(safeAvatar("https://example.com/avatar.png"), "");
  assert.equal(safeAvatar("data:image/svg+xml;base64,AAAA"), "");
  assert.equal(
    safeAvatar("data:image/png;base64,AAAA"),
    "data:image/png;base64,AAAA",
  );
  assert.ok(avatarFileIssue("image/svg+xml", 10));
  assert.ok(avatarFileIssue("image/png", 600000));
  assert.equal(avatarFileIssue("image/webp", 40000), "");
});
test("invalid draft step numbers fall back to a valid step", () => {
  const db = storage();
  writeSetupDraft(db, "a@example.com", validForm(), NaN);
  assert.equal(readSetupDraft(db, "a@example.com").step, 0);
  writeSetupDraft(db, "a@example.com", validForm(), 100);
  assert.equal(readSetupDraft(db, "a@example.com").step, 4);
});
