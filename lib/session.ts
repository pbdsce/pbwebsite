import { getIronSession, IronSession } from "iron-session";
import type { SessionOptions } from "iron-session";
import { cookies } from "next/headers";

interface SessionData {
  timerStart?: number;
}
export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "signin_timer_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  return await getIronSession<SessionData>(await cookies(), sessionOptions);
}
