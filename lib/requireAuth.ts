import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseToken } from "./firebaseAdmin";

const ADMIN_DOMAIN = 'pointblank.club';

export async function requireAuth(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = await verifyFirebaseToken(token);
    const userEmail = decodedToken.email;

    if (!userEmail || !userEmail.endsWith(`@${ADMIN_DOMAIN}`)) {
          return {
              error: NextResponse.json({
                  error: "Forbidden"
              }, { status: 403 })
        };
    }  
    console.log("Decoded Token:", decodedToken);
    return { user: decodedToken };
  } catch (err) {
    return { error: NextResponse.json({ error: "Invalid token" }, { status: 401 }) };
  }
}
