import React, { useState } from "react";
import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import type { FormData } from "./forms/pbctfForm/types";

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
  const [showHintMessage, setShowHintMessage] = useState(false);

  const hearAboutOptions = [
    "Previously participated",
    "Twitter/X",
    "LinkedIn", 
    "University/Work",
    "Friend",
    "Other",
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
          <h3 className="text-green-300 font-mono text-lg">
            dead stars still shine
          </h3>
        </div>
        
        <div className="space-y-3 text-green-300/80 font-mono text-sm leading-relaxed">
          <p>
            When you look at a star, you are not seeing it as it is. You are
            seeing it as it was, light that left home centuries ago, still
            travelling.
          </p>
          <p>
            We rebuilt everything. The face you see now is new. But the light
            from before us is still out there, still moving. Frozen at the
            moment it was captured.
          </p>
          <p>
            Find the old light. Something was said, once, quietly, in a place
            most eyes slide past. It was never truly taken back.
          </p>
        </div>
        
        <div className="bg-gray-800/50 border border-green-400/10 rounded-lg p-4 space-y-2">
          {!showHintMessage && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowHintMessage(true)}
                className="px-4 py-2 bg-green-400/20 hover:bg-green-400/30 border border-green-400/50 rounded-lg text-green-300 font-mono text-sm transition-colors"
              >
                Show Hint 💡
              </button>
              <p className="text-green-400/50 font-mono text-xs">
                Need help? Click for a hint...
              </p>
            </div>
          )}
          
          {showHintMessage && (
            <p className="text-red-400 font-mono text-sm animate-in fade-in-0 slide-in-from-top-1 duration-500">
              <strong>
                {"// some things are removed from view. not from existence."}
              </strong>
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
            })}
            className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-green-400/50 transition-colors ${
              errors.secretFlag 
                ? 'border-red-400/50 text-red-300 placeholder-red-500/50' 
                : 'border-green-400/30 text-green-300 placeholder-green-500/50'
            }`}
          />
          {errors.secretFlag && (
            <p className="text-red-400 font-mono text-sm flex items-center gap-2">
              <span>❌</span>
              {errors.secretFlag.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdditionalQuestions; 
