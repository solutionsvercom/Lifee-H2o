/** Set `VITE_API_URL` (or legacy `VITE_API_BASE_URL`) to override API host. */
export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const envBase =
    (import.meta.env.VITE_API_URL as string | undefined) ||
    (import.meta.env.VITE_API_BASE_URL as string | undefined);
  if (envBase && envBase.trim() !== "") {
    return `${envBase.replace(/\/$/, "")}${normalized}`;
  }
  // Local/LAN fallback: always target backend on port 5000.
  // This covers localhost and private network IPs even outside Vite dev mode.
  if (typeof window !== "undefined") {
    const host = window.location.hostname || "localhost";
    const isLocalHost = host === "localhost" || host === "127.0.0.1";
    const isPrivateLan =
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(host);
    if (isLocalHost || isPrivateLan) {
      const protocol = window.location.protocol === "https:" ? "https:" : "http:";
      return `${protocol}//${host}:5000${normalized}`;
    }
  }

  // Otherwise assume API is served from same origin (deployed setup).
  if (import.meta.env.DEV && typeof window !== "undefined") {
    const host = window.location.hostname || "localhost";
    const protocol = window.location.protocol === "https:" ? "https:" : "http:";
    return `${protocol}//${host}:5000${normalized}`;
  }
  return normalized;
}
