export function getBackendUrl() {
  const value = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (value) return value.replace(/\/$/, "");
  if (typeof window !== "undefined") {
    const configured = (window as Window & { __PIYU_BACKEND_URL__?: string }).__PIYU_BACKEND_URL__;
    if (configured) return configured.replace(/\/$/, "");
  }
  return "";
}

export function backendUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getBackendUrl()}${normalized}`;
}
