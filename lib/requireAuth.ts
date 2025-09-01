import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseToken } from "./firebaseAdmin";

export async function requireAuth(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = await verifyFirebaseToken(token);
    return { user: decodedToken };
  } catch (err) {
    return { error: NextResponse.json({ error: "Invalid token" }, { status: 401 }) };
  }
}
