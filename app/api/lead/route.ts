import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const webhookUrl = process.env.MAKE_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("MAKE_WEBHOOK_URL is not set");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const body = await request.json();

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.error("Make webhook error", response.status, await response.text());
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
