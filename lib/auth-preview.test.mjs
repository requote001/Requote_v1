import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  authPreviewHref,
  maskPreviewEmail,
  safeAuthReturnPath,
} from "./auth-preview.ts";

describe("auth design return paths", () => {
  it("preserves an in-platform request destination through verification", () => {
    const next = "/post-a-request?journey=request&source=home";
    const verification = new URL(
      authPreviewHref("/verify-email", next, "verified"),
      "https://requote.cc",
    );
    assert.equal(verification.searchParams.get("next"), next);
    assert.equal(verification.searchParams.get("state"), "verified");
    assert.equal(
      safeAuthReturnPath(verification.searchParams.get("next")),
      next,
    );
  });
  for (const value of [
    "https://example.com",
    "//example.com",
    "/%2fexample.com",
    "/%5cexample.com",
    "/\\example.com",
    "/bad%00path",
    "/bad%",
    "",
  ]) {
    it("rejects unsafe return value " + JSON.stringify(value), () => {
      assert.equal(safeAuthReturnPath(value), "/home");
    });
  }
  it("uses the specified fallback", () => {
    assert.equal(safeAuthReturnPath(undefined, "/profile"), "/profile");
  });
});
describe("verification preview identity", () => {
  it("masks the address in confirmation screens", () => {
    const masked = maskPreviewEmail("designer@example.com");
    assert.match(masked, /^de•+@example\.com$/);
    assert.ok(!masked.includes("designer"));
  });
  it("does not invent an address if none is stored", () => {
    assert.equal(maskPreviewEmail(""), "your email address");
  });
});
