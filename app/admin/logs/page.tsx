import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogsViewer from "@/components/LogsViewer";
import verifyAuth from "@/lib/verifyAuth";
import { getLogs } from "@/lib/server/logs";
import connectDB from "@/lib/db/connection";

export const metadata = {
  title: "Activity Logs - Point Blank Admin",
};

export default async function AdminLogsPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie || !(await verifyAuth(sessionCookie.value))) {
    redirect("/admin");
  }

  await connectDB();
  const logs = await getLogs();

  return <LogsViewer initialLogs={logs} />;
}
