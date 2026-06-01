"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

const LoginForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const canResend = otpSent && resendTimer === 0;
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');

  const resetOTPState = () => {
    setOtp('');
    setOtpSent(false);
    setResendTimer(0);
    setOtpError('');
    setOtpSuccess('');
  };

  useEffect(() => {
    if (!otpSent || resendTimer <= 0)  return;

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () =>
      clearInterval(interval);
  }, [otpSent, resendTimer]);

  const validateEmail = (email: string): boolean => {
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const sendOtp = async () => {
    setOtpError('');
    setOtpSuccess('');

    if (!email) {
      setOtpError("Email required");  return;
    }

    if (!validateEmail(email)) {
      setOtpError("Invalid email address");  return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/pbctf?action=sendLoginOTP",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setOtpError(data.error);
        return;
      }

      setOtpSent(true);
      setResendTimer(120);
      setOtpSuccess(
        "OTP sent successfully"
      );
    } catch (error) {
      console.error(error);

      setOtpError(
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setOtpError("");
    setOtpSuccess("");

    if (otp.length !== 6) {
      setOtpError(
        "Please enter valid OTP"
      );

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/pbctf?action=verifyOTP",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setOtpError(data.error);
        return;
      }

      setOtpSuccess(
        "Login successful"
      );

      window.location.href = "/pbctf/dashboard";
    } catch (error) {
      console.error(error);

      setOtpError(
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center px-6">
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="w-full max-w-md bg-gray-900/40 border border-green-400/20 rounded-lg p-8"
      >
        <h1 className="text-3xl text-center text-green-300 mb-6">
          PBCTF Login
        </h1>
      
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Registered Email"
            value={email}
            onChange={(e) => {
              setEmail(
                e.target.value
              );

              if (otpSent) {
                resetOTPState();
              }
            }}
            disabled={otpSent}
            className="w-full bg-gray-900/50 border border-green-400/30 rounded px-4 py-3 text-green-300 placeholder-gray-500 focus:border-green-400 focus:outline-none"
          />

          {!otpSent ? (
            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 py-3 rounded text-white disabled:opacity-50"
            >
              {loading
                ? "Sending..."
                : "Send OTP"}
            </button>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6)
                  )
                }
                maxLength={6}
                className="w-full bg-gray-900/50 border border-green-400/30 rounded px-4 py-3 text-green-300 placeholder-gray-500 focus:border-green-400 focus:outline-none"
              />

              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 py-3 rounded text-white disabled:opacity-50"
              >
                {loading
                  ? "Verifying..."
                  : "Verify OTP"}
              </button>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={
                    !canResend
                  }
                  className="text-green-400 text-sm disabled:opacity-50"
                >
                  {canResend
                    ? "Resend OTP"
                    : `Resend in ${formatTime(
                        resendTimer
                      )}`}
                </button>

                <button
                  type="button"
                  onClick={
                    resetOTPState
                  }
                  className="text-gray-400 text-sm"
                >
                  Change Email
                </button>
              </div>
            </>
          )}

          {otpError && (
            <div className="bg-red-900/20 border border-red-400/30 rounded p-3">
              <p className="text-red-400 text-sm">
                {otpError}
              </p>
            </div>
          )}

          {otpSuccess && (
            <div className="bg-green-900/20 border border-green-400/30 rounded p-3">
              <p className="text-green-400 text-sm">
                {otpSuccess}
              </p>
            </div>
          )}

          <div className="text-center pt-4">
            <p className="text-gray-400 text-sm">
              New user?{" "}
              <Link
                href="/pbctf"
                className="text-green-400 underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;