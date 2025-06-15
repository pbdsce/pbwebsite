import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  const start = session.timerStart || 0;
  const now = Date.now();
  const remaining = Math.max(0, 120000 - (now - start));
  return new Response(JSON.stringify({ remaining }), {
    status: 200,
  });
}
