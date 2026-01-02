"use client";
import { useState } from "react";
import { useStore } from "@/lib/zustand/store";

export default function DocsPage() {
  const { isLoggedIn } = useStore();

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#191818' }}>
      <div className="w-full h-[calc(100vh-8rem)]">
        <iframe
          src={process.env.NEXT_PUBLIC_NOTION_DOC}
          width="100%"
          height="100%"
          allowFullScreen
          style={{ display: "block" }}
        />
      </div>
    </div>
  );
}
