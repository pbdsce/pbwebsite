import { NextRequest, NextResponse } from "next/server";
import { backfillDescriptions } from "@/lib/server/contributionsV2";

export async function POST(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key || key !== process.env.SCRAPE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  backfillDescriptions()
    .then(r => console.log("[Backfill] Done:", r))
    .catch(err => console.error("[Backfill] Error:", err));

  return NextResponse.json({ message: "Backfill started" }, { status: 202 });
}