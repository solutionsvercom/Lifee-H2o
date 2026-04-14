/** Set `VITE_API_BASE_URL` in production if the API is on another origin; otherwise same-origin `/api/...` is used. */
export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const envBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (envBase && envBase.trim() !== "") {
    return `${envBase.replace(/\/$/, "")}${normalized}`;
  }
  if (import.meta.env.DEV) {
    const host =
      typeof window !== "undefined" && window.location?.hostname
        ? window.location.hostname
        : "localhost";
    const protocol =
      typeof window !== "undefined" && window.location?.protocol === "https:"
        ? "https:"
        : "http:";
    return `${protocol}//${host}:5000${normalized}`;
  }
  return normalized;
}
