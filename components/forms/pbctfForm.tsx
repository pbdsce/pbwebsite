"use client";
import "../../app/css/additional-styles/utility-patterns.css";
import "../../app/css/additional-styles/theme.css";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { branches } from "@/lib/constants/dropdownOptions";
import { Press_Start_2P } from "next/font/google";
import toast from "react-hot-toast";


//  NOTE TO ANYONE WHO IS WANDERING HERE IN HOPES OF PBCTF 4.0
// THIS FORM DIRECTLY CALLS THE DB FROM THE CLIENT SIDE
// THIS IS NOT A GOOD PRACTICE
// PLEASE DO NOT USE THIS AS A REFERENCE
// KINDLY CONTACT SKY SINGH TO FIX THIS
// WHENVEVER THE NEXT CTF IS
// PARAGATI RAJ ARE YOU READING THIS
// I MISS YOU


const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

type ParticipantData = {
  name: string;
  year: string;
  branch: string;
  usn: string;
  email: string;
  phone: string;
};

type FormData = {
  participationType: "solo" | "duo";
  participant1: ParticipantData;
  participant2?: ParticipantData;
};


const PBCTFForm: React.FC = () => {
  const [isSuccess, setSuccess] = useState<boolean>(false);
  const [participationType, setParticipationType] = useState<"solo" | "duo">(
    "solo"
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [usnError, setUsnError] = useState<string | null>(null);
  const [token, setToken] = useState<string>();

  const [headingText, setHeadingText] = useState("");
  const heading = "Be a Part of PBCTF       Register Now!";

  useEffect(() => {
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const typeEffect = () => {
      if (currentIndex <= heading.length) {
        setHeadingText(heading.substring(0, currentIndex));
        currentIndex++;
        timeoutId = setTimeout(typeEffect, 200); // Typing speed
      }
    };

    typeEffect();

    return () => clearTimeout(timeoutId);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const getRecaptcha = async () => {
    grecaptcha.enterprise.ready(async () => {
      const Rtoken = await grecaptcha.enterprise.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
      );
        setToken(Rtoken);
    });
    
  };

  useEffect(() => {
    // Load the reCAPTCHA script dynamically and ensure it loads fully before calling `grecaptcha`
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = getRecaptcha; // Call the function once the script is loaded
    document.head.appendChild(script);

    return () => {
      // Clean up the script if the component unmounts
      document.head.removeChild(script);
    };
  }, []);

  const watchYear1 = watch("participant1.year");
  const watchYear2 = watch("participant2.year");
  const watchUsn1 = watch("participant1.usn");
  const watchUsn2 = watch("participant2.usn");
  

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setUsnError(null);

    try {
      const recaptcha_token = token;
      if (recaptcha_token) {

        const regData = {
          recaptcha_token,
          data: data
        }

        const response = await fetch("/api/registration/pbctf", {
          method: "POST",
          body: JSON.stringify(regData),
        });

        const res = await response.json();

        if (!response.ok || res.error) {
          toast.error(res.message);
          return;
        }
        setSuccess(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col p-6 sm:p-8 rounded-lg shadow-lg bg-black bg-opacity-30 backdrop-blur-lg border border-green-500">
          <div className="flex flex-col items-center text-center">
            <div className="inline-block p-4 bg-green-500 rounded-full animate-bounce">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-green-500">
              Registration Successful!
            </h2>
            <p className="mt-4 text-lg text-gray-300 leading-relaxed">
              You have successfully registered for the PBCTF!
            </p>
            <p className="mt-2 text-md text-gray-400 leading-relaxed">
              Join the WhatsApp Group for further updates immediately.
            </p>
          </div>
          <div className="flex mx-auto items-center mt-6">
            <a
              href="https://chat.whatsapp.com/HQejGLcEgM1EZFoPTeCUKb"
              className="w-full"
            >
              <button className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-full transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50">
                Join WhatsApp Group!
              </button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const renderParticipantFields = (participantNumber: 1 | 2) => (
    

    <div className="mb-4">
      <h3 className="h3 mb-2">Participant {participantNumber}</h3>
      <div className="space-y-3">
        <div>
          <input
            {...register(`participant${participantNumber}.name` as const, {
              required: "Name required",
            })}
            placeholder="Name"
            className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
          />
          {errors[`participant${participantNumber}`]?.name && (
            <p className="mt-1 text-xs text-red-500">
              {errors[`participant${participantNumber}`]?.name?.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <select
              {...register(`participant${participantNumber}.year` as const, {
                required: "Year required",
              })}
              className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
            >
              <option value="" className="bg-black">
                Select Year
              </option>
              <option value="1" className="bg-black">
                1st Year
              </option>
              <option value="2" className="bg-black">
                2nd Year
              </option>
              <option value="3" className="bg-black">
                3rd Year
              </option>
              <option value="4" className="bg-black">
                4th Year
              </option>
            </select>
            {errors[`participant${participantNumber}`]?.year && (
              <p className="mt-1 text-xs text-red-500">
                {errors[`participant${participantNumber}`]?.year?.message}
              </p>
            )}
          </div>
          <div>
            <select
              {...register(`participant${participantNumber}.branch` as const, {
                required: "Branch required",
              })}
              className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
            >
              <option value="" className="bg-black">
                Select Branch
              </option>
              {branches.map((branch, index) => (
                <option key={index} value={branch} className="bg-black">
                  {branch}
                </option>
              ))}
            </select>
            {errors[`participant${participantNumber}`]?.branch && (
              <p className="mt-1 text-xs text-red-500">
                {errors[`participant${participantNumber}`]?.branch?.message}
              </p>
            )}
          </div>
        </div>
        <div>
          <input
            {...register(`participant${participantNumber}.usn` as const, {
              required: participantNumber === 1 && watchYear1 === "1" 
              || participantNumber === 2 && watchYear2 === "1" 
              ? "Admission Number required" 
              : "USN required",
              pattern: {
                value:
                  (participantNumber === 1 && watchYear1 === "1") ||
                  (participantNumber === 2 && watchYear2 === "1")
                    ? /^[1-9][0-9][A-Z]{4}[0-9]{4}$/
                    : /^1DS[1-3][0-9][A-Z]{2}[0-9]{3}$/,
                    message: participantNumber === 1 && watchYear1 === "1" 
                    || participantNumber === 2 && watchYear2 === "1" 
                    ? "Invalid Admission Number" 
                    : "Invalid USN",
              },
            })}
            placeholder={
              (participantNumber === 1 && watchYear1 === "1") || 
              (participantNumber === 2 && watchYear2 === "1") 
              ? "Admission Number" 
              : "USN"
            }
            className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
          />
          {errors[`participant${participantNumber}`]?.usn && (
            <p className="mt-1 text-xs text-red-500">
              {errors[`participant${participantNumber}`]?.usn?.message}
            </p>
          )}
        </div>
        <div>
          <input
            {...register(`participant${participantNumber}.email` as const, {
              required: "Email required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
          />
          {errors[`participant${participantNumber}`]?.email && (
            <p className="mt-1 text-xs text-red-500">
              {errors[`participant${participantNumber}`]?.email?.message}
            </p>
          )}
        </div>
        <div>
          <input
            {...register(`participant${participantNumber}.phone` as const, {
              required: "Phone required",
              pattern: {
                value: /^[6-9]\d{9}$/,
                message: "Invalid phone number (10 digits starting with 6-9)",
              },
            })}
            placeholder="Phone Number"
            maxLength={10}
            type="tel"
            className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
          />
          {errors[`participant${participantNumber}`]?.phone && (
            <p className="mt-1 text-xs text-red-500">
              {errors[`participant${participantNumber}`]?.phone?.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
    
    <div className="max-w-3xl mx-auto p-4 sm:p-6 rounded-lg mt-10">
      <h1
        className={`${pressStart2P.className} md:text-2xl sm:text-sm font-bold mb-6 text-center text-green-500`}
        style={{
          textShadow: "2px 2px 0px #000",
          letterSpacing: "2px",
          minHeight: "3rem",
        }}
      >
        {headingText}
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 sm:mx-auto md:mx-20"
      >
        <div>
          <label className="block mb-2">
            Participation Type<span className="text-red-600"> * </span>
          </label>
          <select
            {...register("participationType", { required: true })}
            onChange={(e) =>
              setParticipationType(e.target.value as "solo" | "duo")
            }
            className="w-full px-4 py-2 border rounded-md bg-transparent form-input focus:border-0 focus:outline-offset-0 focus:outline-green-500"
          >
            <option value="solo" className="bg-black">
              Solo
            </option>
            <option value="duo" className="bg-black">
              Duo
            </option>
          </select>
        </div>

        {renderParticipantFields(1)}
        {participationType === "duo" && renderParticipantFields(2)}

        {usnError && (
          <p className="text-red-500 text-center font-bold">{usnError}</p>
        )}

        <div className="flex justify-center w-full">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-1/2 bg-green-500 text-white rounded-full py-2 px-4 text-base font-semibold hover:bg-green-600 transition duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 mx-auto"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default PBCTFForm;
