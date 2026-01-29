import { NextResponse } from "next/server";
import verifyAuth from "@/lib/client/verifyAuth";
import logger from "@/lib/server/logger";
export async function requireAuth(request?: Request) {
  logger.info(
    { module: "auth", action: "auth_guard_invoked" },
    "Auth guard invoked"
  );
  try {
    const user = await verifyAuth();
    if (!user?.email) {
      logger.warn(
        { module: "auth", action: "unauthorized_access" },
        "Unauthorized access attempt"
      );
      return {
        error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      };
    }
    logger.info(
      { module: "auth", action: "user_authenticated" },
      "User authenticated"
    );


    return { user };
  } catch (err) {
    logger.error(
      { module: "auth", err },
      "Auth verification failed"
    );
    return {
      error: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
    };
  }
}
