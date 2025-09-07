import React, { useState, useEffect } from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { FormData } from './types';

interface ParticipantFormProps {
  participantNumber: 1 | 2;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  watch: UseFormWatch<FormData>;
  onEmailVerificationChange?: (isVerified: boolean) => void;
}

const ParticipantForm: React.FC<ParticipantFormProps> = ({ 
  participantNumber, 
  register, 
  errors, 
  watch,
  onEmailVerificationChange 
}) => {
  const watchPreviousCTF = watch(`participant${participantNumber}.previousCTF`);
  const watchEmail = watch(`participant${participantNumber}.email`);
  
  // Separate loading states
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  
  // OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  // Message states
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else if (resendTimer === 0 && otpSent) {
      setCanResend(true);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer, otpSent]);

  useEffect(() => {
    if (watchEmail && (otpSent || otpVerified)) {
      resetOTPState();
    }
  }, [watchEmail]);

  useEffect(() => {
    if (onEmailVerificationChange) {
      onEmailVerificationChange(otpVerified);
    }
  }, [otpVerified, onEmailVerificationChange]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetOTPState = () => {
    setOtpSent(false);
    setOtpVerified(false);
    setOtp('');
    setCanResend(false);
    setResendTimer(0);
    setOtpError('');
    setOtpSuccess('');
  };
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  const sendOTP = async () => {
    if (!watchEmail) {
      setOtpError('Please enter a valid email address first');
      return;
    }
    if (!validateEmail(watchEmail)) {
      setOtpError('Please enter a valid email address');
      return;
    }
    setIsSendingOTP(true);
    setOtpError('');
    setOtpSuccess('');
    try {
      const response = await fetch('/api/registration/pbctf/?action=sendOTP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: watchEmail,
          registrationData: {} 
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        setOtpSuccess('OTP sent successfully to your email');
        setResendTimer(120); 
        setCanResend(false);
      } else {
        setOtpError(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      setOtpError('Network error. Please try again.');
      console.error('Error sending OTP:', error);
    } finally {
      setIsSendingOTP(false);
    }
  };
  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }
    setIsVerifyingOTP(true);
    setOtpError('');
    setOtpSuccess('');
    try {
      const response = await fetch('/api/registration/pbctf/?action=verifyOTP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: watchEmail,
          otp: otp,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setOtpVerified(true);
        setOtpSuccess('Email verified successfully!');
        setOtpError('');
      } else {
        setOtpError(data.error || 'Invalid OTP');
      }
    } catch (error) {
      setOtpError('Network error. Please try again.');
      console.error('Error verifying OTP:', error);
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    setOtpError('');
  };

  return (
    <div className="space-y-6">
      {/* Basic Info Section */}
      <div className="bg-gray-800/30 border border-green-400/20 rounded-lg p-4">
        <h4 className="text-green-300 font-mono text-sm mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          Basic Information
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <input
              {...register(`participant${participantNumber}.name` as const, {
                required: "Name is required",
              })}
              placeholder="Full Name"
              className="w-full bg-gray-900/50 border border-green-400/30 rounded px-4 py-3 text-green-300 font-mono text-sm focus:border-green-400 focus:outline-none transition-colors placeholder-gray-500"
            />
            {errors[`participant${participantNumber}`]?.name && (
              <p className="mt-1 text-xs text-red-400 font-mono">
                {errors[`participant${participantNumber}`]?.name?.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="space-y-3">
              <div className="flex md:flex-row flex-col gap-2">
                <input
                  {...register(`participant${participantNumber}.email` as const, {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="Email Address"
                  type="email"
                  disabled={otpVerified}
                  className={`flex-1 bg-gray-900/50 border border-green-400/30 rounded px-4 py-3 text-green-300 font-mono text-sm focus:border-green-400 focus:outline-none transition-colors placeholder-gray-500 ${
                    otpVerified ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
                {!otpVerified && (
                  <button
                    type="button"
                    onClick={sendOTP}
                    disabled={isSendingOTP || !watchEmail}
                    className="px-4 py-3 bg-green-600 text-white font-mono text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[100px]"
                  >
                    {isSendingOTP ? 'Sending...' : otpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>
                )}
                {otpVerified && (
                  <div className="flex items-center px-3 py-2 bg-green-600/20 border border-green-400/30 rounded">
                    <span className="text-green-300 font-mono text-sm">✓ Verified</span>
                  </div>
                )}
              </div>

              {otpSent && !otpVerified && (
                <div className="flex md:flex-row flex-col gap-2">
                  <input
                    type="text"
                    value={otp}
                    onChange={handleOTPChange}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="flex-1 bg-gray-900/50 border border-green-400/30 rounded px-4 py-3 text-green-300 font-mono text-sm focus:border-green-400 focus:outline-none transition-colors placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={verifyOTP}
                    disabled={isVerifyingOTP || otp.length !== 6}
                    className="px-4 py-3 bg-green-600 text-white font-mono text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[100px]"
                  >
                    {isVerifyingOTP ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              )}

              {otpSent && !otpVerified && (
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={sendOTP}
                    disabled={!canResend || isSendingOTP}
                    className="text-green-400 font-mono text-sm hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {canResend ? '' : `Resend in ${formatTime(resendTimer)}`}
                  </button>
                  <button
                    type="button"
                    onClick={resetOTPState}
                    className="text-gray-400 font-mono text-sm hover:text-gray-300 transition-colors"
                  >
                    Change Email
                  </button>
                </div>
              )}

              {otpError && (
                <p className="text-xs text-red-400 font-mono">{otpError}</p>
              )}
              {otpSuccess && (
                <p className="text-xs text-green-400 font-mono">{otpSuccess}</p>
              )}
              
              {errors[`participant${participantNumber}`]?.email && (
                <p className="text-xs text-red-400 font-mono">
                  {errors[`participant${participantNumber}`]?.email?.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <input
              {...register(`participant${participantNumber}.phone` as const, {
                required: "Phone number is required",
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Invalid phone number (10 digits starting with 6-9)",
                },
              })}
              placeholder="Phone Number"
              maxLength={10}
              type="tel"
              className="w-full bg-gray-900/50 border border-green-400/30 rounded px-4 py-3 text-green-300 font-mono text-sm focus:border-green-400 focus:outline-none transition-colors placeholder-gray-500"
            />
            {errors[`participant${participantNumber}`]?.phone && (
              <p className="mt-1 text-xs text-red-400 font-mono">
                {errors[`participant${participantNumber}`]?.phone?.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register(`participant${participantNumber}.age` as const, {
                required: "Age is required",
                min: { value: 16, message: "Minimum age is 16" },
                max: { value: 100, message: "Maximum age is 100" },
              })}
              placeholder="Age"
              type="number"
              min="16"
              max="100"
              className="w-full bg-gray-900/50 border border-green-400/30 rounded px-4 py-3 text-green-300 font-mono text-sm focus:border-green-400 focus:outline-none transition-colors placeholder-gray-500"
            />
            {errors[`participant${participantNumber}`]?.age && (
              <p className="mt-1 text-xs text-red-400 font-mono">
                {errors[`participant${participantNumber}`]?.age?.message}
              </p>
            )}
          </div>

          <div>
            <select
              {...register(`participant${participantNumber}.gender` as const, {
                required: "Gender is required",
              })}
              className="w-full bg-gray-900/50 border border-green-400/30 rounded px-4 py-3 text-green-300 font-mono text-sm focus:border-green-400 focus:outline-none transition-colors"
            >
              <option value="" className="bg-gray-900">Select Gender</option>
              <option value="Male" className="bg-gray-900">Male</option>
              <option value="Female" className="bg-gray-900">Female</option>
              <option value="Other" className="bg-gray-900">Other</option>
              <option value="Prefer not to say" className="bg-gray-900">Prefer not to say</option>
            </select>
            {errors[`participant${participantNumber}`]?.gender && (
              <p className="mt-1 text-xs text-red-400 font-mono">
                {errors[`participant${participantNumber}`]?.gender?.message}
              </p>
            )}
          </div>
        </div>
      </div>
      {!otpVerified && watchEmail && (
        <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-3">
          <p className="text-yellow-300 font-mono text-sm">
            ⚠️ Please verify your email address before proceeding
          </p>
        </div>
      )}
      {/* Participant Background Section */}
      <div className="bg-gray-800/30 border border-green-400/20 rounded-lg p-4">
        <h4 className="text-green-300 font-mono text-sm mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          Participant Background
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <select
              {...register(`participant${participantNumber}.experienceLevel` as const, {
                required: "Experience level is required",
              })}
              className="w-full bg-gray-900/50 border border-green-400/30 rounded px-4 py-3 text-green-300 font-mono text-sm focus:border-green-400 focus:outline-none transition-colors"
            >
              <option value="" className="bg-gray-900">Select Experience Level</option>
              <option value="Beginner" className="bg-gray-900">Beginner</option>
              <option value="Intermediate" className="bg-gray-900">Intermediate</option>
              <option value="Advanced" className="bg-gray-900">Advanced</option>
            </select>
            {errors[`participant${participantNumber}`]?.experienceLevel && (
              <p className="mt-1 text-xs text-red-400 font-mono">
                {errors[`participant${participantNumber}`]?.experienceLevel?.message}
              </p>
            )}
          </div>

          <div>
            <select
              {...register(`participant${participantNumber}.affiliation` as const, {
                required: "Affiliation is required",
              })}
              className="w-full bg-gray-900/50 border border-green-400/30 rounded px-4 py-3 text-green-300 font-mono text-sm focus:border-green-400 focus:outline-none transition-colors"
            >
              <option value="" className="bg-gray-900">Select Affiliation</option>
              <option value="Student" className="bg-gray-900">Student</option>
              <option value="Professional" className="bg-gray-900">Professional</option>
              <option value="Hobbyist" className="bg-gray-900">Hobbyist</option>
            </select>
            {errors[`participant${participantNumber}`]?.affiliation && (
              <p className="mt-1 text-xs text-red-400 font-mono">
                {errors[`participant${participantNumber}`]?.affiliation?.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <input
              {...register(`participant${participantNumber}.affiliationName` as const, {
                required: "Affiliation name is required",
              })}
              placeholder="College Name / Company Name / Organization"
              className="w-full bg-gray-900/50 border border-green-400/30 rounded px-4 py-3 text-green-300 font-mono text-sm focus:border-green-400 focus:outline-none transition-colors placeholder-gray-500"
            />
            {errors[`participant${participantNumber}`]?.affiliationName && (
              <p className="mt-1 text-xs text-red-400 font-mono">
                {errors[`participant${participantNumber}`]?.affiliationName?.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <select
              {...register(`participant${participantNumber}.previousCTF` as const, {
                required: "Please select if you have participated in CTFs before",
              })}
              className="w-full bg-gray-900/50 border border-green-400/30 rounded px-4 py-3 text-green-300 font-mono text-sm focus:border-green-400 focus:outline-none transition-colors"
            >
              <option value="" className="bg-gray-900">Have you participated in CTFs before?</option>
              <option value="Yes" className="bg-gray-900">Yes</option>
              <option value="No" className="bg-gray-900">No</option>
            </select>
            {errors[`participant${participantNumber}`]?.previousCTF && (
              <p className="mt-1 text-xs text-red-400 font-mono">
                {errors[`participant${participantNumber}`]?.previousCTF?.message}
              </p>
            )}
          </div>

          {watchPreviousCTF === "Yes" && (
            <div className="md:col-span-2">
              <textarea
                {...register(`participant${participantNumber}.ctfNames` as const, {
                  required: watchPreviousCTF === "Yes" ? "Please mention which CTFs you have participated in" : false,
                })}
                placeholder="Which CTFs have you participated in? (e.g., picoCTF, NAHAMCON CTF, Google CTF, etc.)"
                rows={3}
                className="w-full bg-gray-900/50 border border-green-400/30 rounded px-4 py-3 text-green-300 font-mono text-sm focus:border-green-400 focus:outline-none transition-colors placeholder-gray-500 resize-none"
              />
              {errors[`participant${participantNumber}`]?.ctfNames && (
                <p className="mt-1 text-xs text-red-400 font-mono">
                  {errors[`participant${participantNumber}`]?.ctfNames?.message}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantForm; 