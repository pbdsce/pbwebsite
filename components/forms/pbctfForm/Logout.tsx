"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setLoading(true);

      const response = await fetch("/api/pbctf/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        router.push("/pbctf/login");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="
        border border-green-500
        text-green-400
        px-4 py-2
        font-mono
        hover:bg-green-500
        hover:text-black
        transition-all duration-200
        disabled:opacity-50
      "
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}