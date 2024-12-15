"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "../Firebase"; // Update the path
import Image from "next/image";
const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState(""); // State for reset message

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // Redirect to a home-page after successful login
    } catch (error) {
      setError("Failed to log in");
      console.error(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/"); // Redirect to a home-page after successful login
    } catch (error: any) {
      setError(error.message || "Failed to sign in with Google");
      console.error(error);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setResetMessage("Please enter your email address");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage("Password reset email sent!");
    } catch (error) {
      setResetMessage("Failed to send password reset email");
      console.error(error);
    }
  };

  return (
    <div className="max-w-md bg-[#151916] p-12 rounded-xl shadow-lg shadow-green-500/100">
      <div className="text-3xl font-semibold text-center mb-8 text-white">
        Login
      </div>
      <form onSubmit={handleLogin}>
        <div className="relative mb-6">
          <input
            type="email"
            id="email"
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="peer w-full bg-transparent border-0 border-b-2 border-green-500 text-white placeholder-transparent focus:border-green-400 focus:outline-none focus:ring-0 autofill:shadow-[inset_0_0_0px_1000px_rgba(0,0,0,0)] autofill:text-white pt-2 m-1"
            required
          />
          <label
            htmlFor="email"
            className="absolute left-0 top-0 text-white text-base transition-all duration-500 transform -translate-y-3 scale-75 origin-left cursor-text peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-base peer-focus:-translate-y-3 peer-focus:scale-75 "
          >
            Email Address
          </label>
        </div>
        <div className="relative mb-6">
          <input
            type="password"
            id="password"
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="peer w-full bg-transparent border-0 border-b-2 border-green-500 text-white placeholder-transparent focus:border-green-400 focus:outline-none focus:ring-0 autofill:shadow-[inset_0_0_0px_1000px_rgba(0,0,0,0.8)] autofill:text-white  pt-2 m-1"
            required
          />
          <label
            htmlFor="password"
            className="absolute left-0 top-0 text-white text-base transition-all duration-500 transform -translate-y-3 scale-75 origin-left cursor-text peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-base peer-focus:-translate-y-3 peer-focus:scale-75"
          >
            Password
          </label>
        </div>
        <div className="text-right mb-4">
          <a
            href="#"
            className="text-green-500 hover:underline"
            onClick={handlePasswordReset}
          >
            Forgot password?
          </a>
        </div>
        <div className="mb-4">
          <button
            type="submit"
            className="w-full p-3 bg-green-600 text-white rounded-md hover:bg-green-500 "
          >
            Login
          </button>
        </div>
        <div className="mb-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full p-3 bg-white text-black rounded-md hover:bg-[#aaabad] flex items-center justify-center"
          >
            <Image
              height={32}
              width={32}
              src="/images/google_logo.png"
              alt="Google Logo"
              className="w-8 h-8 mr-2"
            />
            Sign in with Google
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {resetMessage && <p className="text-green-500">{resetMessage}</p>}
      </form>
    </div>
  );
};

export default Login;
