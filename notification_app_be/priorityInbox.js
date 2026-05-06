/**
 * Stage 1 – Priority Inbox
 * Fetches campus notifications from the evaluation API and surfaces the top‑N
 * most important ones using a composite score of type‑weight + recency.
 *
 * Priority weight:  Placement (3)  >  Result (2)  >  Event (1)
 * Recency factor:   newer notifications score higher within the same weight tier
 */

const path = require("path");
const Log = require(path.join(__dirname, "../logging_middleware/logger.js"));

const API_BASE = "http://20.207.122.201/evaluation-service";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJha3NoYXlhcHV0dGk3QGdtYWlsLmNvbSIsImV4cCI6MTc3ODA2NjcwNCwiaWF0IjoxNzc4MDY1ODA0LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZDU2MTc0NzUtYzU2Ni00ODczLWFmODMtYjY1YTQ3MTI1M2Q2IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoicC5ha3NoYXlhIiwic3ViIjoiMzk1NzBlNjEtODBiNi00NzU0LTljMTQtZWUwY2ZmNDFkMTE3In0sImVtYWlsIjoiYWtzaGF5YXB1dHRpN0BnbWFpbC5jb20iLCJuYW1lIjoicC5ha3NoYXlhIiwicm9sbE5vIjoiYXYuc2MudTRhaWUyMzEzNSIsImFjY2Vzc0NvZGUiOiJQVEJNbVEiLCJjbGllbnRJRCI6IjM5NTcwZTYxLTgwYjYtNDc1NC05YzE0LWVlMGNmZjQxZDExNyIsImNsaWVudFNlY3JldCI6InZhVXFtdktnVWZRalF5aEEifQ.CkjEOPEPKOK70TcuvWdsjFUNTfvOvFyHPrXlba0SocM";

// Weight map – higher means more important
const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

/**
 * Compute a composite priority score for a single notification.
 * Score = (typeWeight * 1e12) + epochMilliseconds
 * This ensures type dominates, and within the same type newer items win.
 */
function computeScore(notification) {
  const weight = TYPE_WEIGHT[notification.Type] ?? 0;
  const epochMs = new Date(notification.Timestamp).getTime();
  return weight * 1e12 + epochMs;
}

/**
 * Fetch ALL notifications from the API (single call – no pagination needed
 * for the scoring step; new items are re‑fetched on every invocation).
 */
async function fetchAllNotifications() {
  await Log("backend", "info", "service", "Fetching notifications from evaluation API");

  const { default: axios } = await import("axios");
  const response = await axios.get(`${API_BASE}/notifications`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  const notifications = response.data.notifications || [];
  await Log(
    "backend",
    "info",
    "service",
    `Fetched ${notifications.length} notifications successfully`
  );
  return notifications;
}

/**
 * Return the top‑N priority notifications.
 * Every call re‑fetches and re‑ranks so the inbox always reflects current state.
 *
 * @param {number} topN  – how many to return (default 10)
 */
async function getTopPriorityNotifications(topN = 10) {
  await Log(
    "backend",
    "info",
    "handler",
    `Computing top ${topN} priority notifications`
  );

  const all = await fetchAllNotifications();

  // Attach score, sort descending, slice to topN
  const scored = all
    .map((n) => ({ ...n, _score: computeScore(n) }))
    .sort((a, b) => b._score - a._score)
    .slice(0, topN);

  await Log(
    "backend",
    "info",
    "handler",
    `Top ${topN} notifications identified successfully`
  );

  return scored;
}

// ─── Main ────────────────────────────────────────────────────────────────────
(async () => {
  try {
    await Log("backend", "info", "controller", "Priority Inbox service started");

    const TOP_N = 10;
    const topNotifications = await getTopPriorityNotifications(TOP_N);

    console.log(`\n${"═".repeat(60)}`);
    console.log(`   🔔  Top ${TOP_N} Priority Notifications`);
    console.log(`${"═".repeat(60)}\n`);

    topNotifications.forEach((n, idx) => {
      const typeEmoji =
        n.Type === "Placement" ? "💼" : n.Type === "Result" ? "📊" : "🎉";
      console.log(`  ${String(idx + 1).padStart(2, "0")}. ${typeEmoji} [${n.Type}] ${n.Message}`);
      console.log(`       ID: ${n.ID}   |   Time: ${n.Timestamp}\n`);
    });

    console.log(`${"═".repeat(60)}\n`);
    await Log(
      "backend",
      "info",
      "controller",
      "Priority Inbox output completed successfully"
    );
  } catch (err) {
    await Log(
      "backend",
      "error",
      "controller",
      `Priority Inbox failed: ${err.message || err}`
    ).catch(() => {});
    console.error("Error:", err.message || err);
    process.exit(1);
  }
})();
