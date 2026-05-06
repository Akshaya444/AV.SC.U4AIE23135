// API utility – routes all notification requests through the local Next.js proxy
// (/api/notifications) which adds the Bearer token server-side, avoiding CORS issues.

// When running on the client the proxy is at the same origin (localhost:3000)
const PROXY_BASE = "/api/notifications";

export interface Notification {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
}

export interface FetchParams {
  limit?: number;
  page?: number;
  notification_type?: string;
}

export async function fetchNotifications(params: FetchParams = {}): Promise<Notification[]> {
  const query = new URLSearchParams();
  if (params.limit) query.set("limit", String(params.limit));
  if (params.page) query.set("page", String(params.page));
  if (params.notification_type && params.notification_type !== "All") {
    query.set("notification_type", params.notification_type);
  }

  const url = `${PROXY_BASE}${query.toString() ? "?" + query.toString() : ""}`;

  const res = await fetch(url, {
    // Always fetch fresh – no caching
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.notifications ?? [];
}

// Priority scoring – same logic as Stage 1 backend
const TYPE_WEIGHT: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export function scoreNotification(n: Notification): number {
  const weight = TYPE_WEIGHT[n.Type] ?? 0;
  const epochMs = new Date(n.Timestamp).getTime();
  return weight * 1e12 + epochMs;
}

export function sortByPriority(notifications: Notification[]): Notification[] {
  return [...notifications].sort((a, b) => scoreNotification(b) - scoreNotification(a));
}
