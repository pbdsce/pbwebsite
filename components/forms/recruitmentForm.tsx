"use client";
import "../../app/css/additional-styles/utility-patterns.css";
import "../../app/css/additional-styles/theme.css";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { years, branches } from "@/lib/constants/dropdownOptions";
import Success from "./success";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/client/clientUtils";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import CustomSelect from "@/components/ui/custom-select";
import OTPVerificationForm from "./recruitmentForm/OTPVerificationForm";
import ReviewInformationForm from "./recruitmentForm/ReviewInformationForm";
import { set } from "lodash";

interface FormData {
  name: string;
  email: string;
  whatsapp_number: string;
  college_id: string;
  year_of_study: string;
  branch: string;
  about: string;
  otp: string;
}

const RecruitmentForm: React.FC = () => {
  const [isSuccess, setSuccess] = useState<boolean>(false);
  const [mode, setMode] = useState<boolean>(false);
  const [display, setDisplay] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmissionComplete, setIsSubmissionComplete] =
    useState<boolean>(false);

  // New flow states
  const [currentStep, setCurrentStep] = useState<"form" | "otp" | "review">(
    "form"
  );
  const [formDataForSubmission, setFormDataForSubmission] =
    useState<FormData | null>(null);
  const [isOTPVerified, setIsOTPVerified] = useState<boolean>(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string>(""); // Track which email was verified

  // OTP related states
  const [isSendingOTP, setIsSendingOTP] = useState<boolean>(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const [resendTimer, setResendTimer] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
    getValues,
    setError,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      whatsapp_number: "",
      college_id: "",
      year_of_study: "",
      branch: "",
      about: "",
      otp: "",
    },
  });

  const watchedYear = watch("year_of_study");
  const watchedEmail = watch("email");

  // Timer effect for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  // Update mode when year changes
  useEffect(() => {
    if (watchedYear === "1st year") {
      setMode(true);
    } else {
      setMode(false);
    }
    setDisplay(true);
  }, [watchedYear]);

  const changeMode = (e: any) => {
    if (e.target.value === "1st year") setMode(true);
    else setMode(false);
    setDisplay(true);
  };

  const sendOTP = async (email: string): Promise<boolean> => {
    setIsSendingOTP(true);
    setOtpError("");
    clearErrors("email"); // Clear any existing email errors
    try {
      const response = await fetch(
        "/api/registration/recruitment?action=sendOTP",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.error) {
        const errorMessage = result.error || "Failed to send OTP";
        setOtpError(errorMessage);
        toast.error(errorMessage);
        // Also set form error for email field
        setError("email", {
          type: "manual",
          message: errorMessage,
        });
        return false;
      }

      toast.success("OTP sent to your email!");
      setResendTimer(60);
      return true;
    } catch (error) {
      console.error("OTP send error:", error);
      const errorMessage = "Failed to send OTP";
      setOtpError(errorMessage);
      toast.error(errorMessage);
      setError("email", {
        type: "manual",
        message: errorMessage,
      });
      return false;
    } finally {
      setIsSendingOTP(false);
    }
  };

  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    setIsVerifyingOTP(true);
    setOtpError("");
    try {
      const response = await fetch(
        "/api/registration/recruitment?action=verifyOTP",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.error) {
        setOtpError(result.error || "Invalid OTP");
        return false;
      }

      setOtpError("");
      setIsOTPVerified(true);
      setVerifiedEmail(email); // Store the verified email
      toast.success("OTP verified successfully!");
      return true;
    } catch (error) {
      console.error("OTP verification error:", error);
      setOtpError("OTP verification failed");
      return false;
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const submitRegistration = async (data: FormData): Promise<boolean> => {
    try {
      const response = await fetch(
        "/api/registration/recruitment?action=addRegistration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok || result.error) {
        toast.error(result.error || "Registration failed");
        return false;
      }

      toast.success("Registration successful!");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed");
      return false;
    }
  };

  const handleSendOTP = async () => {
    const email = getValues("email");
    if (!email) {
      setError("email", {
        type: "manual",
        message: "Please enter your email first",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("email", {
        type: "manual",
        message: "Please enter a valid email address",
      });
      return;
    }

    // Clear any existing email errors
    clearErrors("email");
    const success = await sendOTP(email);
    if (success) {
      setCurrentStep("otp");
    } else {
      // If sendOTP failed, the error will be displayed via toast or form error
      // Don't transition to OTP step
    }
  };

  const handleOTPVerification = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    if (!formDataForSubmission) {
      setOtpError("Form data not found");
      return;
    }

    const success = await verifyOTP(formDataForSubmission.email, otp);
    if (success) {
      setCurrentStep("review");
    }
  };

  const handleResendOTP = async () => {
    if (!formDataForSubmission) return;

    const success = await sendOTP(formDataForSubmission.email);
    if (success) {
      setOtp("");
      setOtpError("");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    setOtpError("");
  };

  // Helper function to check if email verification is still valid
  const isEmailStillVerified = (email: string): boolean => {
    return isOTPVerified && verifiedEmail === email;
  };

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (currentStep === "form") {
      setFormDataForSubmission(data);
      if (isEmailStillVerified(data.email)) {
        setCurrentStep("review");
      } else {
        await handleSendOTP();
      }
      setIsSubmitting(false);
      return;
    }

    if (currentStep === "review" && isOTPVerified) {
      setIsSubmitting(true);
      try {
        const registrationSuccess = await submitRegistration(data);
        if (registrationSuccess) {
          setIsSubmissionComplete(true);
          setSuccess(true);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error(getErrorMessage(error));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="my-9">
        <Success
          message="Registration Successful! Good Luck for the Test!"
          joinLink="https://chat.whatsapp.com/DIMFSozr9slDcJYrZlUSWA"
        />
      </div>
    );
  }

  const handleBackToForm = () => {
    setCurrentStep("form");
    setOtp("");
    setOtpError("");

    if (formDataForSubmission) {
      Object.entries(formDataForSubmission).forEach(([key, value]) => {
        setValue(key as keyof FormData, value);
      });
    }
  };

  if (currentStep === "otp") {
    return (
      <OTPVerificationForm
        formDataForSubmission={formDataForSubmission}
        otp={otp}
        otpError={otpError}
        isVerifyingOTP={isVerifyingOTP}
        isSendingOTP={isSendingOTP}
        resendTimer={resendTimer}
        onOTPChange={handleOTPChange}
        onVerifyOTP={handleOTPVerification}
        onResendOTP={handleResendOTP}
        onBackToForm={handleBackToForm}
        formatTime={formatTime}
      />
    );
  }

  const handleEditInformation = () => {
    setCurrentStep("form");
    if (formDataForSubmission) {
      Object.entries(formDataForSubmission).forEach(([key, value]) => {
        setValue(key as keyof FormData, value);
      });
    }
  };

  const handleSubmitRegistration = async (data: FormData) => {
    await onSubmit(data);
  };

  if (currentStep === "review" && formDataForSubmission) {
    return (
      <ReviewInformationForm
        formDataForSubmission={formDataForSubmission}
        isSubmitting={isSubmitting}
        isSubmissionComplete={isSubmissionComplete}
        isEmailStillVerified={isEmailStillVerified}
        onEditInformation={handleEditInformation}
        onSubmitRegistration={handleSubmitRegistration}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 lg:p-10 rounded-3xl bg-black/40 backdrop-blur-md shadow-2xl border border-gray-800">
          <motion.div
            className="mb-4 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Recruitment Form
            </h1>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}>
                <h5 className="text-sm text-gray-400">
                  <span className="text-red-500"> * </span>Fields are required
                </h5>
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}>
                <label className="block text-sm font-medium text-gray-300">
                  Full Name<span className="text-red-500"> * </span>
                </label>
                <input
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                    maxLength: {
                      value: 100,
                      message: "Name must be less than 100 characters",
                    },
                  })}
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-600"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </motion.div>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Branch<span className="text-red-500"> * </span>
                  </label>
                  <CustomSelect
                    {...register("branch", {
                      required: "Branch is required",
                    })}
                    options={branches.map((branch) => ({
                      value: branch,
                      label: branch,
                    }))}
                    value={watch("branch") || ""}
                    onChange={(value) => {
                      setValue("branch", value);
                      clearErrors("branch");
                    }}
                    placeholder="Select Branch"
                    error={errors.branch?.message}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Year of Study<span className="text-red-500"> * </span>
                  </label>
                  <CustomSelect
                    {...register("year_of_study", {
                      required: "Year of study is required",
                    })}
                    options={years.map((year) => ({
                      value: year,
                      label: year,
                    }))}
                    value={watch("year_of_study") || ""}
                    onChange={(value) => {
                      setValue("year_of_study", value);
                      clearErrors("year_of_study");
                      changeMode({ target: { value } });
                    }}
                    placeholder="Select Year"
                    error={errors.year_of_study?.message}
                  />
                </div>
              </motion.div>

              {display && (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}>
                  {mode === true ? (
                    <>
                      <label className="block text-sm font-medium text-gray-300">
                        Admission Number (For 1st Years)
                        <span className="text-red-500"> * </span>
                      </label>
                      <input
                        {...register("college_id", {
                          required: "Admission Number is required",
                          pattern: {
                            value: /^[1-9][0-9][A-Z]{4}[0-9]{4}$/,
                            message: "Invalid format. Expected: 19ABCD1234",
                          },
                        })}
                        name="college_id"
                        type="text"
                        placeholder="Enter admission number (e.g., 19ABCD1234)"
                        className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-600"
                      />
                    </>
                  ) : (
                    <>
                      <label className="block text-sm font-medium text-gray-300">
                        USN
                        <span className="text-red-500"> * </span>
                      </label>
                      <input
                        {...register("college_id", {
                          required: "USN is required",
                          pattern: {
                            value: /^[1][D][S][1-3][0-9][A-Z]{2}[0-9]{3}$/,
                            message: "Invalid format. Expected: 1DS21CS123",
                          },
                        })}
                        name="college_id"
                        type="text"
                        placeholder="Enter your USN (e.g., 1DS21CS123)"
                        className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-600"
                      />
                    </>
                  )}
                  {errors.college_id && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.college_id.message}
                    </p>
                  )}
                </motion.div>
              )}

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}>
                <label className="block text-sm font-medium text-gray-300">
                  <div className="flex items-center gap-2">
                    <span>
                      Email<span className="text-red-500"> * </span>
                    </span>
                    {watchedEmail && isEmailStillVerified(watchedEmail) && (
                      <span className="text-green-400 text-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                        Verified
                      </span>
                    )}
                  </div>
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-600"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}>
                <label className="block text-sm font-medium text-gray-300">
                  WhatsApp Number
                  <span className="text-red-500"> * </span>
                </label>
                <input
                  {...register("whatsapp_number", {
                    required: "WhatsApp Number is required",
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message:
                        "Invalid phone number (10 digits starting with 6-9)",
                    },
                  })}
                  maxLength={10}
                  name="whatsapp_number"
                  placeholder="Enter your WhatsApp number"
                  className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-600"
                />
                {errors.whatsapp_number && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.whatsapp_number.message}
                  </p>
                )}
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}>
                <label className="block text-sm font-medium text-gray-300">
                  Tell us something about yourself (max 150 words)
                  <span className="text-red-500"> * </span>
                </label>
                <textarea
                  {...register("about", {
                    required: "This field is required",
                    minLength: {
                      value: 10,
                      message: "Please write at least 10 characters",
                    },
                    maxLength: {
                      value: 1500,
                      message: "Maximum 1500 characters allowed",
                    },
                  })}
                  name="about"
                  rows={6}
                  maxLength={1500}
                  placeholder="I am a..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-600 resize-none"
                />
                {errors.about && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.about.message}
                  </p>
                )}
              </motion.div>

              <motion.div
                className="pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}>
                <button
                  type="submit"
                  disabled={isSubmitting || isSubmissionComplete}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl py-3 px-6 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-base transition-all duration-200 shadow-lg hover:shadow-green-500/25 transform hover:scale-[1.02] active:scale-[0.98]">
                  {isSubmissionComplete
                    ? "Registration Complete!"
                    : isSubmitting
                    ? "Processing..."
                    : watchedEmail && isEmailStillVerified(watchedEmail)
                    ? "Review Information"
                    : "Continue"}
                </button>
              </motion.div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RecruitmentForm;
