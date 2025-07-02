import React, { useState, useEffect } from "react";
import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import type { FormData } from "./types";

interface AdditionalQuestionsProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  watch: UseFormWatch<FormData>;
}

const AdditionalQuestions: React.FC<AdditionalQuestionsProps> = ({
  register,
  errors,
  watch,
}) => {
  const howDidYouHear = watch("howDidYouHear") || [];
  const secretFlag = watch("secretFlag");
  const [showFirstHint, setShowFirstHint] = useState(false);
  const [showSecondHint, setShowSecondHint] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    // Hide the flag in the console for CTF challenge
    const flagData = "cGJjdGZ7cGxzX2g0Y2tfbTNfZDRkZHl9"; // base64 encoded flag
    const decodedFlag = atob(flagData);
    console.log(`
🕵️‍♂️ SECRET AGENT FLAG FOUND! 🕵️‍♂️
Congratulations! You found the hidden flag: ${decodedFlag}
Copy this flag and paste it in the registration form!
`);
    (window as any).ctfFlag = decodedFlag;

    const timer = setInterval(() => {
      setTimeElapsed(prev => {
        const newTime = prev + 1;
        if (newTime >= 30 && !showFirstHint) {
          setShowFirstHint(true);
        }
        if (newTime >= 60 && !showSecondHint) {
          setShowSecondHint(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showFirstHint, showSecondHint]);

  const hearAboutOptions = [
    "Twitter/X",
    "LinkedIn", 
    "University/Work",
    "Friend",
    "Other"
  ];

  return (
    <div className="space-y-6">
      {/* How did you hear about this CTF */}
      <div className="space-y-4">
        <label className="block text-green-300 font-mono text-sm mb-3">
          How did you hear about this CTF? (Multiple Choice)
        </label>
        <div className="grid grid-cols-1 gap-3">
          {hearAboutOptions.map((option) => (
            <label
              key={option}
              className="flex items-center space-x-3 text-green-300 font-mono text-sm cursor-pointer group"
            >
              <input
                type="checkbox"
                value={option}
                {...register("howDidYouHear")}
                className="w-4 h-4 text-green-400 bg-gray-900 border-green-400/50 rounded focus:ring-green-400 focus:ring-2 focus:ring-offset-0"
              />
              <span className="group-hover:text-green-200 transition-colors">
                {option}
              </span>
            </label>
          ))}
        </div>

        {/* Other specify field */}
        {howDidYouHear.includes("Other") && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Please specify..."
              {...register("howDidYouHearOther")}
              className="w-full px-4 py-3 bg-gray-900/50 border border-green-400/30 rounded-lg text-green-300 placeholder-green-500/50 font-mono focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/50"
            />
          </div>
        )}
      </div>

      {/* Secret Flag Challenge */}
      <div className="bg-gray-900/30 border border-green-400/20 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🔍</span>
          <h3 className="text-green-300 font-mono text-lg">
            "Prove You're Not a Bot (or a Noob)!"
          </h3>
        </div>
        
        <p className="text-green-300/80 font-mono text-sm leading-relaxed">
          To register, you must find the secret agent flag hidden on this page! 🕵‍♂️
        </p>
        
        <div className="bg-gray-800/50 border border-green-400/10 rounded-lg p-4 space-y-2">
          {!showFirstHint && !showSecondHint && (
            <p className="text-green-400/50 font-mono text-xs flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400/50 rounded-full animate-pulse"></span>
              Hints will appear after some time... ⏱️ ({Math.max(0, 30 - timeElapsed)}s until first hint)
            </p>
          )}
          
          {showFirstHint && (
            <p className="text-green-400/70 font-mono text-xs animate-in fade-in-0 slide-in-from-top-1 duration-500">
              <strong>Hint 1:</strong> The flag is watching you from the dark corners of this page... come inspect me
            </p>
          )}
          
          {showFirstHint && !showSecondHint && (
            <p className="text-green-400/50 font-mono text-xs flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400/50 rounded-full animate-pulse"></span>
              Second hint coming in {Math.max(0, 60 - timeElapsed)}s...
            </p>
          )}
          
          {showSecondHint && (
            <p className="text-green-400/70 font-mono text-xs animate-in fade-in-0 slide-in-from-top-1 duration-500">
              <strong>Hint 2:</strong> Still stuck? Here's a riddle: I'm in the code but not the screen, find me where devs debug unseen.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-green-300 font-mono text-sm">
            Enter the secret flag:
          </label>
          <input
            type="text"
            placeholder="paste the flag here..."
            {...register("secretFlag", { 
              required: "Secret flag is required to complete registration",
              validate: (value) => 
                value === "pbctf{pls_h4ck_m3_d4ddy}" || "Incorrect flag! Keep looking... 🔍"
            })}
            className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-green-400/50 transition-colors ${
              errors.secretFlag 
                ? 'border-red-400/50 text-red-300 placeholder-red-500/50' 
                : secretFlag === "pbctf{pls_h4ck_m3_d4ddy}"
                ? 'border-green-400 text-green-300 placeholder-green-500/50'
                : 'border-green-400/30 text-green-300 placeholder-green-500/50'
            }`}
          />
          {errors.secretFlag && (
            <p className="text-red-400 font-mono text-sm flex items-center gap-2">
              <span>❌</span>
              {errors.secretFlag.message}
            </p>
          )}
          {secretFlag === "pbctf{pls_h4ck_m3_d4ddy}" && (
            <p className="text-green-400 font-mono text-sm flex items-center gap-2">
              <span>✅</span>
              Excellent! You've found the flag! 🎉
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdditionalQuestions; 