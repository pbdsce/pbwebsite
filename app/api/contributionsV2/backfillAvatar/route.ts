import { NextRequest, NextResponse } from "next/server";
import { backfillOrgAndUserAvatars } from "@/lib/server/contributionsV2";

// POST /api/admin/backfill-avatars?key=<SCRAPE_SECRET>
//
// Fills orgAvatarUrl, orgHtmlUrl, and userAvatarUrl on existing contributions
// that are missing those fields. Safe to run with the site live — it only
// touches empty fields, never overwrites good data.
//
// Fire-and-forget (same pattern as the scrape route): returns 202 immediately
// and logs progress to the server console.

export async function POST(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key || key !== process.env.SCRAPE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  backfillOrgAndUserAvatars()
    .then((r) => console.log("[Backfill/avatars] Done:", JSON.stringify(r)))
    .catch((err) => console.error("[Backfill/avatars] Error:", err));

  return NextResponse.json({ message: "Avatar backfill started" }, { status: 202 });
}