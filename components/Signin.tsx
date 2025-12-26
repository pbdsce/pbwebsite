"use client";

import React, { useEffect, useState } from "react";
import "../app/globals.css";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  sendVerificationEmail,
  verifyToken,
} from "@/lib/server/auth";
import { useStore } from "@/lib/zustand/store";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonLocked, setIsButtonLocked] = useState(true);
  const { setLoggedIn, isLoggedIn} = useStore();
  const router = useRouter();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      verifyToken(token).then((auth) => {
        if (auth && auth.email) {
          localStorage.setItem("admin_token", token);
          setLoggedIn(true);
          toast.success("Successfully signed in!");
          router.push("/");
        } else {
          setIsButtonLocked(false);
          toast.error("Invalid or expired token.");
        }
      });
    } else {
      setIsButtonLocked(false);
    }
  }, [router, setLoggedIn]);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isButtonLocked) return;
    setIsButtonLocked(true);

    try {
      const eMailRegex = new RegExp(
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      );

      // Check if the email is valid
      if (!eMailRegex.test(email))
        return toast.error("Please enter a valid email address");

      const res = await sendVerificationEmail(email);
      if (!res) {
        setIsLoading(false);
        return toast.error("Acess denied");
      }
      setIsLoading(false);
      setEmail("");
      setIsButtonLocked(false);
      return toast.success("Verification link sent to your email!");
    } catch (err: any) {
      setIsLoading(false);
      toast.error(err.message || "Failed sign in");
      console.error("Email link error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md bg-[#151916] p-12 rounded-xl shadow-lg shadow-green-600/100">
      <div className="text-3xl font-semibold text-center mb-8 text-white">
        Sign In
      </div>
      <form onSubmit={handleSignIn}>
        <div className="relative mb-6">
          <input
            type="text"
            id="email"
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="peer w-full bg-transparent border-0 border-b-2 border-green-500 text-white placeholder-transparent focus:border-green-400 focus:outline-none focus:ring-0 autofill:shadow-[inset_0_0_0px_1000px_rgba(0,0,0,0.8)] autofill:text-white pt-2 m-1"
            required
          />
          <label
            htmlFor="email"
            className="absolute left-0 top-0 text-white text-base transition-all duration-500 transform -translate-y-3 scale-75 origin-left cursor-text peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-base peer-focus:-translate-y-3 peer-focus:scale-75"
          >
            Email Address
          </label>
        </div>
        <div className="mb-4">
      <button
          type="submit"
          disabled={isLoading || isButtonLocked}
          className={`w-full p-3 rounded-md text-white transition ${
            isLoading || isButtonLocked
              ? "bg-green-900 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-500"
          }`}>
        {isLoading ? "Sending..." : isButtonLocked ? "Please wait..." : "Sign In"}
      </button>

        </div>
      </form>
    </div>
  );
};
export default SignIn;
