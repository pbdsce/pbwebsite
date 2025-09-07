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
  const [isSendingOTP, setIsSendingOTP] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
    getValues,
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
        setOtpError(result.error || "Failed to send OTP");
        return false;
      }

      toast.success("OTP sent to your email!");
      setOtpSent(true);
      return true;
    } catch (error) {
      console.error("OTP send error:", error);
      setOtpError("Failed to send OTP");
      return false;
    } finally {
      setIsSendingOTP(false);
    }
  };

  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
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
      return true;
    } catch (error) {
      console.error("OTP verification error:", error);
      setOtpError("OTP verification failed");
      return false;
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
      setOtpError("Please enter your email first");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setOtpError("Please enter a valid email address");
      return;
    }

    await sendOTP(email);
  };

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Step 1: Verify OTP if it was sent
      if (otpSent) {
        const otpValid = await verifyOTP(data.email, data.otp);
        if (!otpValid) {
          return;
        }
      } else {
        // If OTP not sent yet, send it first
        const otpSent = await sendOTP(data.email);
        if (!otpSent) {
          return;
        }
        toast("Please enter the OTP sent to your email and submit again", {
          icon: "ℹ️",
        });
        return;
      }

      // Step 2: Submit registration
      const registrationSuccess = await submitRegistration(data);
      if (registrationSuccess) {
        setSuccess(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
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

  return (
    <>
      <div className="my-4 mx-auto p-6 rounded-lg">
        <h1 className="mb-6 h1 text-center">Recruitment Form</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h5 className="h5 mb-4 text-center">
              <span className="text-red-600"> * </span>Fields are required
            </h5>

            <div className="mb-4">
              <label className="block">
                Full Name<span className="text-red-600"> * </span>
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
                className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-row justify-between">
              <div className="mb-4 w-1/2 pr-2">
                <label>
                  Branch<span className="text-red-600"> * </span>
                </label>
                <select
                  {...register("branch", {
                    required: "Branch is required",
                  })}
                  name="branch"
                  className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500">
                  <option value="">Select Branch</option>
                  {branches.map((branch, index) => (
                    <option
                      className="text-wrap px-4 py-2 border rounded-md bg-black form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
                      value={branch}
                      key={index}>
                      {branch}
                    </option>
                  ))}
                </select>
                {errors.branch && (
                  <p className="text-red-500 text-sm">
                    {errors.branch.message}
                  </p>
                )}
              </div>

              <div className="mb-4 w-1/2 pl-2">
                <label>
                  Year of Study<span className="text-red-600"> * </span>
                </label>
                <select
                  {...register("year_of_study", {
                    required: "Year of study is required",
                  })}
                  name="year_of_study"
                  onChange={(e) => changeMode(e)}
                  className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500">
                  <option value="">Select Year</option>
                  {years.map((year, index) => (
                    <option
                      className="w-full px-4 py-2 border rounded-md bg-black form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
                      value={year}
                      key={index}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.year_of_study && (
                  <p className="text-red-500 text-sm">
                    {errors.year_of_study.message}
                  </p>
                )}
              </div>
            </div>

            {display && (
              <>
                {mode === true ? (
                  <div className="mb-4">
                    <label className="block">
                      Admission Number (For 1st Years)
                      <span className="text-red-600"> * </span>
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
                      className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
                    />
                    {errors.college_id && (
                      <p className="text-red-500 text-sm">
                        {errors.college_id.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mb-4">
                    <label className="block">
                      USN
                      <span className="text-red-600"> * </span>
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
                      className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
                    />
                    {errors.college_id && (
                      <p className="text-red-500 text-sm">
                        {errors.college_id.message}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            <div className="mb-4">
              <label className="block mb-2">
                Email<span className="text-red-600"> * </span>
              </label>
              <div className="flex gap-2">
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
                  className="flex-1 px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
                />
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={isSendingOTP || !watchedEmail}
                  className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                  {isSendingOTP
                    ? "Sending..."
                    : otpSent
                    ? "Resend OTP"
                    : "Send OTP"}
                </button>
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {otpSent && (
              <div className="mb-4">
                <label className="block mb-2">
                  Enter OTP<span className="text-red-600"> * </span>
                </label>
                <input
                  {...register("otp", {
                    required: "OTP is required",
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: "OTP must be 6 digits",
                    },
                  })}
                  name="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500 text-center text-2xl tracking-widest"
                />
                {errors.otp && (
                  <p className="text-red-500 text-sm">{errors.otp.message}</p>
                )}
                {otpError && <p className="text-red-500 text-sm">{otpError}</p>}
              </div>
            )}

            <div className="mb-4">
              <label className="block mb-2">
                WhatsApp Number
                <span className="text-red-600"> * </span>
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
                className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
              />
              {errors.whatsapp_number && (
                <p className="text-red-500 text-sm">
                  {errors.whatsapp_number.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2">
                Tell us something about yourself (max 150 words)
                <span className="text-red-600"> * </span>
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
                className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
              />
              {errors.about && (
                <p className="text-red-500 text-sm">{errors.about.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-500 text-white rounded-lg py-2 px-4 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed w-full">
              {isSubmitting
                ? "Processing..."
                : otpSent
                ? "Submit Registration"
                : "Send OTP & Continue"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RecruitmentForm;
