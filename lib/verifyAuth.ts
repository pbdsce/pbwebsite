import { verifyToken } from "@/lib/server/auth";

export default async function verifyAuth(token: string) {
  try {
    const user = await verifyToken(token);
    if (!user?.email) return false;
    return user;
  } catch (error) {
    console.error("Token verification error:", error);
    return false;
  }
}
