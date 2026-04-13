/** Set `VITE_API_BASE_URL` in production if the API is on another origin; otherwise same-origin `/api/...` is used. */
export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const envBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (envBase && envBase.trim() !== "") {
    return `${envBase.replace(/\/$/, "")}${normalized}`;
  }
  if (import.meta.env.DEV) {
    return `http://localhost:5000${normalized}`;
  }
  return normalized;
}
