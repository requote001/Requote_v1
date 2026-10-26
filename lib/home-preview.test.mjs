import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  filterPreviewPosts,
  isPreviewProfileComplete,
} from "./home-preview.ts";

describe("home preview feed", () => {
  it("shows all examples by default", () =>
    assert.equal(filterPreviewPosts("For you", [], []).length, 3));
  it("filters requests without opportunities", () =>
    assert.deepEqual(
      filterPreviewPosts("Requests", [], []).map((p) => p.type),
      ["Request"],
    ));
  it("filters opportunities", () =>
    assert.deepEqual(
      filterPreviewPosts("Opportunities", [], []).map((p) => p.type),
      ["Opportunity"],
    ));
  it("shows only followed authors", () =>
    assert.deepEqual(
      filterPreviewPosts("Following", ["fatima-bello"], []).map((p) => p.id),
      ["metalwork"],
    ));
  it("does not invent followed posts", () =>
    assert.equal(filterPreviewPosts("Following", [], []).length, 0));
  it("saved view ignores the active type filter", () =>
    assert.deepEqual(
      filterPreviewPosts("Requests", [], ["welders"], true).map((p) => p.id),
      ["welders"],
    ));
  it("does not invent personal activity", () =>
    assert.equal(filterPreviewPosts("My activity", [], []).length, 0));
});
describe("profile completion preview", () => {
  it("does not treat missing profile data as complete", () =>
    assert.equal(isPreviewProfileComplete(undefined), false));
  it("uses stored completion when no override exists", () => {
    assert.equal(isPreviewProfileComplete(true), true);
    assert.equal(isPreviewProfileComplete(false), false);
  });
  it("allows both explicit design instances", () => {
    assert.equal(isPreviewProfileComplete(false, "complete"), true);
    assert.equal(isPreviewProfileComplete(true, "incomplete"), false);
  });
});
