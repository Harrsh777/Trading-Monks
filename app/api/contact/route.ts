import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Log the contact inquiry on server console
    console.log("[Trading Monks] Contact form inquiry received:", {
      name: data.name || `${data.firstName || ""} ${data.lastName || ""}`.trim(),
      email: data.email,
      company: data.company,
      inquiry: data.inquiry,
      message: data.message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, message: "Inquiry received" });
  } catch (error) {
    console.error("[Trading Monks] Contact API error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to process inquiry" },
      { status: 500 },
    );
  }
}
