import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import LoginForm from "@/components/forms/LoginForm";
import verifyAccessToken from "@/lib/pbctf/verifyAccessToken";

export default async function LoginPage() {
  const cookieStore = await cookies();

  const accessToken =
    cookieStore.get("pbctf_access")?.value;

  if (accessToken) {
    const payload =
      verifyAccessToken(accessToken);

    if (payload) {
      redirect("/pbctf/dashboard");
    }
  }

  return <LoginForm />;
}