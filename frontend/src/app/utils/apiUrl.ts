/** Set `VITE_API_URL` (or legacy `VITE_API_BASE_URL`) to override API host. */
export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const envBase =
    (import.meta.env.VITE_API_URL as string | undefined) ||
    (import.meta.env.VITE_API_BASE_URL as string | undefined);
  if (envBase && envBase.trim() !== "") {
    const trimmedBase = envBase.trim().replace(/\/$/, "");

    // If env is localhost but UI is opened via LAN IP on a phone,
    // rewrite host to current hostname so requests hit the laptop backend.
    if (typeof window !== "undefined") {
      const browserHost = window.location.hostname || "localhost";
      const isBrowserLanHost =
        /^10\./.test(browserHost) ||
        /^192\.168\./.test(browserHost) ||
        /^172\.(1[6-9]|2\d|3[0-1])\./.test(browserHost);

      if (isBrowserLanHost) {
        try {
          const parsed = new URL(trimmedBase);
          if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
            const protocol = window.location.protocol === "https:" ? "https:" : "http:";
            const port = parsed.port || "5000";
            return `${protocol}//${browserHost}:${port}${normalized}`;
          }
        } catch {
          // Ignore parse failures and keep original env URL.
        }
      }
    }

    return `${trimmedBase}${normalized}`;
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
