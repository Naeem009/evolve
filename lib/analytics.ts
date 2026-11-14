export function track(event: string, params: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem("evolve-consent") !== "granted") return;
  const payload = { event, event_id: crypto.randomUUID(), ...params };
  const target = window as Window & { dataLayer?: unknown[] };
  target.dataLayer = target.dataLayer ?? [];
  target.dataLayer.push(payload);
}
