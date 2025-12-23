import { NextResponse } from "next/server";
import verifyAuth from "@/lib/client/verifyAuth";

export async function requireAuth(request?: Request) {
  try {
    const user = await verifyAuth();
    if (!user?.email)
      return {
        error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      };
    console.log("Authenticated user:", user);
    return { user };
  } catch (err) {
    return {
      error: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
    };
  }
}
