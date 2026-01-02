"use client";

import { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";

import Footer from "@/components/ui/footer";
import { Toaster } from "react-hot-toast";
import { useStore } from "@/lib/zustand/store";
import { verifyToken } from "@/lib/server/auth";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setLoggedIn } = useStore();

  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });

    if (localStorage) {
      const token = localStorage.getItem("admin_token");
      if (!token) return setLoggedIn(false);

      verifyToken(token).then((res) => 
        setLoggedIn(!!res?.email)
      );
    }
  }, [setLoggedIn]);

  return (
    <>
      <main className="grow">
        {children}
        <Toaster position="top-right" />
      </main>

      <Footer />
    </>
  );
}
