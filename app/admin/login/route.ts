import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyLoginToken } from "@/lib/server/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  const login = await verifyLoginToken(token || "");
  if (!login) return new Response("Invalid or expired token.", { status: 401 });

  const cookieStore = await cookies();
  cookieStore.set("admin_token", login as string);

  return NextResponse.redirect(new URL(`/admin?token=${login}`, request.url));
}
