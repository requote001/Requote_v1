import test from "node:test";
import assert from "node:assert/strict";
import {
  waitlistFieldIssues,
  waitlistPayload,
  waitlistRoleOptions,
  requestWaitlistJoin,
  rememberWaitlistJoin,
} from "./waitlist-form.ts";
import { validateWaitlistSubmission } from "./waitlist.ts";
const values = {
  fullName: "Alex Morgan",
  email: "alex@example.invalid",
  phone: "",
  city: "",
  role: "requester",
  profileInterest: "",
  consent: true,
};
test("waitlist validates required fields and full email shape", () => {
  const fields = waitlistFieldIssues({
    ...values,
    fullName: " ",
    email: "alex@",
    consent: false,
  });
  assert.deepEqual(Object.keys(fields), ["fullName", "email", "consent"]);
  assert.deepEqual(waitlistFieldIssues(values), {});
});
test("every visible role matches the existing server contract", () => {
  for (const option of waitlistRoleOptions) {
    const payload = waitlistPayload(
      { ...values, role: option.value },
      new URLSearchParams(),
    );
    assert.equal(
      validateWaitlistSubmission(payload).success,
      true,
      option.value,
    );
  }
});
test("provider interest and attribution are preserved in the payload", () => {
  const query = new URLSearchParams(
    "source=landing&utm_source=campaign&utm_campaign=launch&intent=draft",
  );
  const payload = waitlistPayload(
    {
      ...values,
      role: "provider",
      email: "  ALEX@example.invalid ",
      profileInterest: "Agriculture",
    },
    query,
    "bot.example",
  );
  assert.equal(payload.email, "alex@example.invalid");
  assert.equal(payload.serviceCategory, "Agriculture");
  assert.equal(payload.profileInterest, "Agriculture");
  assert.equal(payload.intent, "draft");
  assert.equal(payload.source, "landing");
  assert.equal(payload.utmSource, "campaign");
  assert.equal(payload.utmCampaign, "launch");
  assert.equal(payload.website, "bot.example");
});
test("non-provider interests do not populate service category and unknown intent is general", () => {
  const payload = waitlistPayload(
    { ...values, role: "investor", profileInterest: "Strategic partnership" },
    new URLSearchParams("intent=unknown"),
  );
  assert.equal(payload.serviceCategory, "");
  assert.equal(payload.profileInterest, "Strategic partnership");
  assert.equal(payload.intent, "general");
});
test("submission calls the unchanged endpoint and only accepts confirmed success", async () => {
  const payload = waitlistPayload(values, new URLSearchParams());
  let sent;
  await requestWaitlistJoin(payload, async (url, options) => {
    sent = { url, ...options };
    return { ok: true, status: 200, json: async () => ({ success: true }) };
  });
  assert.equal(sent.url, "/api/waitlist");
  assert.equal(sent.method, "POST");
  assert.deepEqual(JSON.parse(sent.body), payload);
  await assert.rejects(
    requestWaitlistJoin(payload, async () => ({
      ok: true,
      status: 200,
      json: async () => ({ success: false }),
    })),
    /couldn’t confirm/,
  );
});
test("service and rate-limit errors are actionable", async () => {
  const payload = waitlistPayload(values, new URLSearchParams());
  await assert.rejects(
    requestWaitlistJoin(payload, async () => ({
      ok: false,
      status: 503,
      json: async () => ({ message: "Please try again shortly." }),
    })),
    /try again shortly/,
  );
  await assert.rejects(
    requestWaitlistJoin(payload, async () => ({
      ok: false,
      status: 429,
      json: async () => ({}),
    })),
    /too many attempts/,
  );
});
test("network and invalid JSON errors never masquerade as success", async () => {
  const payload = waitlistPayload(values, new URLSearchParams());
  await assert.rejects(
    requestWaitlistJoin(payload, async () => {
      throw new TypeError("fetch failed");
    }),
    /same email/,
  );
  await assert.rejects(
    requestWaitlistJoin(payload, async () => ({
      ok: true,
      status: 200,
      json: async () => {
        throw new Error("Bad JSON");
      },
    })),
    /couldn’t confirm/,
  );
});
test("blocked browser storage does not invalidate successful signup", () => {
  assert.equal(
    rememberWaitlistJoin(
      {
        setItem() {
          throw new Error("Blocked");
        },
      },
      "provider",
    ),
    false,
  );
  let saved;
  assert.equal(
    rememberWaitlistJoin(
      {
        setItem(key, value) {
          saved = { key, value };
        },
      },
      "provider",
    ),
    true,
  );
  assert.equal(saved.key, "requote_waitlist");
  assert.equal(JSON.parse(saved.value).role, "provider");
  assert.equal(saved.value.includes("alex"), false);
});
