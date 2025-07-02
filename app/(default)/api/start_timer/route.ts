import { getSession } from "@/lib/session";

export async function POST() {
  const session = await getSession();
  session.timerStart = Date.now();
  await session.save();
  return new Response(JSON.stringify({ message: "Timer started" }), {
    status: 200,
  });
}
