import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import verifyAccessToken from "@/lib/pbctf/verifyAccessToken";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("pbctf_access")?.value;

  if (!accessToken) {
    redirect("/pbctf/login");
  }

  const decoded =
    verifyAccessToken(
      accessToken
    );

  if (!decoded) {
    redirect("/pbctf/login");
  }
  return (
    <div className="min-h-screen bg-black text-green-400 flex items-center justify-center">
      <h1 className="text-4xl font-mono">
        Welcome to PBCTF Dashboard !!
      </h1>
    </div>
  );
}
