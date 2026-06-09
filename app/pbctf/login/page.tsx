import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import LoginForm from "@/components/forms/LoginForm";
import verifyAccessToken from "@/lib/pbctf/verifyAccessToken";

export default async function LoginPage() {
  const cookieStore = await cookies();

  const accessToken =
    cookieStore.get("pbctf_access")?.value;
  const refreshToken =
    cookieStore.get("pbctf_refresh")?.value;

  if (accessToken) {
    const payload =
      verifyAccessToken(accessToken);

    if (payload) {
      redirect("/pbctf/dashboard");
    }
  }

  if (refreshToken) {
    redirect(
      "/api/pbctf/refresh?next=/pbctf/dashboard"
    );
  }

  return <LoginForm />;
}
