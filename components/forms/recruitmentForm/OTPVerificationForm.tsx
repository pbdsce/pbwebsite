"use client";
import { motion } from "framer-motion";

interface OTPVerificationFormProps {
  formDataForSubmission: {
    email: string;
  } | null;
  otp: string;
  otpError: string;
  isVerifyingOTP: boolean;
  isSendingOTP: boolean;
  resendTimer: number;
  onOTPChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVerifyOTP: () => void;
  onResendOTP: () => void;
  onBackToForm: () => void;
  formatTime: (seconds: number) => string;
}

const OTPVerificationForm: React.FC<OTPVerificationFormProps> = ({
  formDataForSubmission,
  otp,
  otpError,
  isVerifyingOTP,
  isSendingOTP,
  resendTimer,
  onOTPChange,
  onVerifyOTP,
  onResendOTP,
  onBackToForm,
  formatTime,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md mx-auto p-6 sm:p-8 lg:p-10 rounded-3xl bg-[#141414] shadow-2xl border border-white/10">
        <motion.div
          className="mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#37ff00] to-[#2bcc00] bg-clip-text text-transparent mb-2">
            Verify Your Email
          </h1>
          <p className="text-white/50 text-sm">
            We&apos;ve sent a 6-digit OTP to
            <br />
            <span className="text-[#37ff00] font-medium">
              {formDataForSubmission?.email}
            </span>
          </p>
        </motion.div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/60 text-center">
              Enter OTP<span className="text-red-500"> * </span>
            </label>
            <input
              type="text"
              value={otp}
              onChange={onOTPChange}
              placeholder="000000"
              maxLength={6}
              className="w-full px-4 py-4 rounded-xl border border-white/10 bg-pbsurface text-white placeholder:text-white/25 focus:outline-none focus:border-[#37ff00]/50 focus:ring-1 focus:ring-[#37ff00]/20 transition-colors text-center text-2xl tracking-widest font-mono"
            />
            {otpError && (
              <p className="text-red-400 text-sm mt-1 text-center">
                {otpError}
              </p>
            )}
          </div>

          <button
            onClick={onVerifyOTP}
            disabled={isVerifyingOTP || otp.length !== 6}
            className="w-full bg-[#37ff00] text-black font-semibold rounded-xl py-4 px-6 hover:bg-[#37ff00]/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
          >
            {isVerifyingOTP ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="text-center space-y-2">
            {resendTimer > 0 ? (
              <p className="text-white/50 text-sm">
                Resend OTP in {formatTime(resendTimer)}
              </p>
            ) : (
              <button
                onClick={onResendOTP}
                disabled={isSendingOTP}
                className="text-[#37ff00] text-sm hover:text-[#2bcc00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSendingOTP ? "Sending..." : "Resend OTP"}
              </button>
            )}
            <button
              onClick={onBackToForm}
              className="block w-full text-white/50 text-sm hover:text-white/70 transition-colors"
            >
              ← Back to Form
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OTPVerificationForm;
