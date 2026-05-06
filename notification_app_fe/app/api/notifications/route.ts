// Next.js API route – proxies all notification requests to the evaluation service
// This avoids any CORS issues when the browser calls the external API directly.
//
// Usage: GET /api/notifications?limit=10&page=1&notification_type=Placement

import { NextRequest, NextResponse } from "next/server";

const API_BASE = "http://20.207.122.201/evaluation-service";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJha3NoYXlhcHV0dGk3QGdtYWlsLmNvbSIsImV4cCI6MTc3ODA2NjcwNCwiaWF0IjoxNzc4MDY1ODA0LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZDU2MTc0NzUtYzU2Ni00ODczLWFmODMtYjY1YTQ3MTI1M2Q2IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoicC5ha3NoYXlhIiwic3ViIjoiMzk1NzBlNjEtODBiNi00NzU0LTljMTQtZWUwY2ZmNDFkMTE3In0sImVtYWlsIjoiYWtzaGF5YXB1dHRpN0BnbWFpbC5jb20iLCJuYW1lIjoicC5ha3NoYXlhIiwicm9sbE5vIjoiYXYuc2MudTRhaWUyMzEzNSIsImFjY2Vzc0NvZGUiOiJQVEJNbVEiLCJjbGllbnRJRCI6IjM5NTcwZTYxLTgwYjYtNDc1NC05YzE0LWVlMGNmZjQxZDExNyIsImNsaWVudFNlY3JldCI6InZhVXFtdktnVWZRalF5aEEifQ.CkjEOPEPKOK70TcuvWdsjFUNTfvOvFyHPrXlba0SocM";

export async function GET(request: NextRequest) {
  try {
    // Forward any query params the client sends
    const { searchParams } = new URL(request.url);
    const upstreamUrl = new URL(`${API_BASE}/notifications`);

    for (const [key, value] of searchParams.entries()) {
      upstreamUrl.searchParams.set(key, value);
    }

    const upstreamResponse = await fetch(upstreamUrl.toString(), {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      // Never cache – notifications are always live
      cache: "no-store",
    });

    if (!upstreamResponse.ok) {
      const errorBody = await upstreamResponse.text();
      return NextResponse.json(
        { error: `Upstream API error: ${upstreamResponse.status}`, detail: errorBody },
        { status: upstreamResponse.status }
      );
    }

    const data = await upstreamResponse.json();
    return NextResponse.json(data, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
