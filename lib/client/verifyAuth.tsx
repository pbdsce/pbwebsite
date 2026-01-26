import { cookies } from "next/headers";
import { verifyToken, type JwtPayload } from "@/lib/server/auth";

export default async function Verify(): Promise<JwtPayload | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("admin_token");
  if (!cookie?.value) return null;
  const auth = await verifyToken(cookie.value);
  if (!auth?.email) return null;
  return auth;
}
