"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendSignInLinkToEmail,
} from "firebase/auth";
import { auth } from "../Firebase";
import "../app/globals.css";
import toast from "react-hot-toast";

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonLocked, setIsButtonLocked] = useState(false);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();

    if(isButtonLocked) return;
    setIsButtonLocked(true);

    try{
      const res = await fetch('/api/signin_validation',{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email}),
      });
      
      if(!res.ok){
        const {error} = await res.json();
        toast.error(error || "Email validation failed");
        setTimeout(() => {setIsButtonLocked(false)}, 2000);
        return;
      }

      setIsLoading(true);

      const actionCodeSettings = {
        url: "https://www.pointblank.club/admin",
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      toast.success("Verification link sent to your email!");
    } catch (signupErr: any) {
      toast.error(signupErr.message || "Failed to sign up");
      console.error("Email link error:", signupErr);
    }finally{
      setTimeout(() => {setIsButtonLocked(false)}, 2000);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const signInWithEmail = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem("emailForSignIn");

        if (!email) {
          toast.error("Email is required to complete sign-in.");
          return;
        }

        try {
          await signInWithEmailLink(auth, email, window.location.href);
          window.localStorage.removeItem("emailForSignIn");
          toast.success("Signed in successfully!");
          router.push("/");
        } catch (err) {
          console.error("Sign-in failed:", err);
          toast.error("Sign-in failed. Try again.");
        }
      }
    };

    signInWithEmail();
  }, []);

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
