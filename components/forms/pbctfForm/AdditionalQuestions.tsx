import React, { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import type { FormData } from "./types";

interface AdditionalQuestionsProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  watch: UseFormWatch<FormData>;
  onFlagValidationChange: (isValid: boolean) => void;
}

const AdditionalQuestions: React.FC<AdditionalQuestionsProps> = ({
  register,
  errors,
  watch,
  onFlagValidationChange,
}) => {
  const howDidYouHear = watch("howDidYouHear") || [];
  const secretFlag = watch("secretFlag") || "";
  const [showHintMessage, setShowHintMessage] = useState(false);
  const [flagStatus, setFlagStatus] = useState<
    "idle" | "checking" | "valid" | "invalid" | "error"
  >("idle");
  const [flagMessage, setFlagMessage] = useState("");
  const validationRequestId = useRef(0);

  const secretFlagRegistration = register("secretFlag", {
    required: "Secret flag is required to complete registration",
  });

  const checkFlag = async () => {
    if (!secretFlag.trim() || flagStatus === "checking") {
      setFlagStatus("invalid");
      setFlagMessage("Enter a flag before checking.");
      onFlagValidationChange(false);
      return;
    }

    setFlagStatus("checking");
    setFlagMessage("Checking flag...");
    const requestId = ++validationRequestId.current;

    try {
      const response = await fetch("/api/pbctf?action=validateFlag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secretFlag }),
      });
      const result = await response.json();

      if (requestId !== validationRequestId.current) return;

      if (response.ok && result.valid) {
        setFlagStatus("valid");
        setFlagMessage(result.message);
        onFlagValidationChange(true);
        return;
      }

      setFlagStatus("invalid");
      setFlagMessage(result.message || "Incorrect flag! Keep looking...");
      onFlagValidationChange(false);
    } catch (error) {
      if (requestId !== validationRequestId.current) return;

      console.error("Error validating flag:", error);
      setFlagStatus("error");
      setFlagMessage("Unable to check the flag. Please try again.");
      onFlagValidationChange(false);
    }
  };

  const handleFlagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      void checkFlag();
    }
  };

  const hearAboutOptions = [
    "Previously Participated",
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
                className="appearance-none w-4 h-4 rounded-full border-2 border-green-400/70 bg-gray-900 checked:bg-green-400 checked:border-green-400 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-green-400/50appearance-none w-4 h-4 rounded-full accent-green-400 bg-gray-900 border-green-400/50 rounded focus:ring-green-400 focus:ring-2 focus:ring-offset-0"
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
            Dead stars still shine
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
      Dead stars still shine
      <br /><br />

      When you look at a star, you are not seeing it as it is. You are seeing it as it was, light that left home centuries ago, still travelling.
      <br /><br />

      We rebuilt everything. The face you see now is new. But the light from before us is still out there, still moving. Frozen at the moment it was captured.
      <br /><br />

      Find the old light. Something was said once, quietly, in a place most eyes slide past. It was never truly taken back.
      <br /><br />

      Some things are removed from view. Not from existence.
      <br /><br />

      Flag format: {"pbctf{...}"}
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
            enterKeyHint="done"
            placeholder={
              typeof window !== "undefined" && window.innerWidth < 640
                ? "Enter flag..."
                : "paste the flag here..."
            }
            {...secretFlagRegistration}
            onChange={(event) => {
              secretFlagRegistration.onChange(event);
              validationRequestId.current += 1;
              setFlagStatus("idle");
              setFlagMessage("");
              onFlagValidationChange(false);
            }}
            onKeyDown={handleFlagKeyDown}
            className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-green-400/50 transition-colors ${
              errors.secretFlag 
                ? 'border-red-400/50 text-red-300 placeholder-red-500/50' 
                : flagStatus === "valid"
                ? 'border-green-400 text-green-300 placeholder-green-500/50'
                : flagStatus === "invalid" || flagStatus === "error"
                ? 'border-red-400/50 text-red-300 placeholder-red-500/50'
                : 'border-green-400/30 text-green-300 placeholder-green-500/50'
            }`}
          />
          <button
            type="button"
            onClick={() => void checkFlag()}
            disabled={flagStatus === "checking"}
            className="w-full sm:w-auto px-5 py-3 bg-green-400/20 hover:bg-green-400/30 border border-green-400/50 rounded-lg text-green-300 font-mono text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {flagStatus === "checking" ? "Checking..." : "Check Flag"}
          </button>
          {errors.secretFlag && (
            <p className="text-red-400 font-mono text-sm flex items-center gap-2">
              <span>❌</span>
              {errors.secretFlag.message}
            </p>
          )}
          {flagMessage && (
            <p
              aria-live="polite"
              className={`font-mono text-sm ${
                flagStatus === "valid" ? "text-green-400" : "text-red-400"
              }`}
            >
              {flagMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdditionalQuestions;
