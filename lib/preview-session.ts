"use client";

import {
  PENDING_REQUEST_KEY,
  PREVIEW_SESSION_KEY,
  SAVED_REQUESTS_KEY,
  type RequestSubmission,
  type SavedRequest,
} from "@/lib/request";

export type PreviewUser = {
  name: string;
  email: string;
  role: "requester" | "provider";
};

export function setPreviewSession(user: PreviewUser) {
  window.sessionStorage.setItem(PREVIEW_SESSION_KEY, JSON.stringify(user));
}

export function getPreviewSession(): PreviewUser | null {
  const stored = window.sessionStorage.getItem(PREVIEW_SESSION_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as PreviewUser;
  } catch {
    window.sessionStorage.removeItem(PREVIEW_SESSION_KEY);
    return null;
  }
}

export function storePendingRequest(submission: RequestSubmission) {
  window.sessionStorage.setItem(
    PENDING_REQUEST_KEY,
    JSON.stringify(submission),
  );
}

export function getPendingRequest(): RequestSubmission | null {
  const stored = window.sessionStorage.getItem(PENDING_REQUEST_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as RequestSubmission;
  } catch {
    window.sessionStorage.removeItem(PENDING_REQUEST_KEY);
    return null;
  }
}

export async function submitPreviewRequest(
  submission: RequestSubmission,
): Promise<SavedRequest> {
  const response = await fetch("/api/preview/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submission),
  });
  const result = (await response.json()) as {
    request?: SavedRequest;
    message?: string;
  };

  if (!response.ok || !result.request) {
    throw new Error(result.message ?? "The request could not be processed.");
  }

  const existing = window.localStorage.getItem(SAVED_REQUESTS_KEY);
  const requests = existing ? (JSON.parse(existing) as SavedRequest[]) : [];
  window.localStorage.setItem(
    SAVED_REQUESTS_KEY,
    JSON.stringify([result.request, ...requests]),
  );
  window.sessionStorage.removeItem(PENDING_REQUEST_KEY);
  return result.request;
}
