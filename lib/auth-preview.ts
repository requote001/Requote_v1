/** UI-only values. These never authorize a real account. */
export const AUTH_PREVIEW_KEY = "requote_mock_auth";
export const AUTH_PREVIEW_EMAIL_KEY = "requote.authPreviewEmail";
export function safeAuthReturnPath(value?: string | null, fallback = "/home") {
  if (!value?.startsWith("/") || value.startsWith("//")) return fallback;
  try {
    const decoded = decodeURIComponent(value);
    if (
      decoded.startsWith("//") ||
      decoded.includes("\\") ||
      Array.from(decoded).some((char) => char.charCodeAt(0) <= 32)
    )
      return fallback;
    const base = "https://preview.requote.invalid";
    const target = new URL(value, base);
    return target.origin === base
      ? `${target.pathname}${target.search}${target.hash}`
      : fallback;
  } catch {
    return fallback;
  }
}
export function maskPreviewEmail(email: string) {
  const [name, domain] = email.split("@");
  return name && domain
    ? `${name.slice(0, 2)}${"•".repeat(Math.min(Math.max(name.length - 2, 3), 6))}@${domain}`
    : "your email address";
}
export function authPreviewHref(
  path: string,
  nextPath?: string,
  state?: string,
) {
  const params = new URLSearchParams();
  if (nextPath) params.set("next", safeAuthReturnPath(nextPath));
  if (state) params.set("state", state);
  return `${path}${params.size ? `?${params}` : ""}`;
}
