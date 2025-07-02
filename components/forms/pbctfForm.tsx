"use client";
import "../../app/css/additional-styles/utility-patterns.css";
import "../../app/css/additional-styles/theme.css";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Press_Start_2P } from "next/font/google";
import toast from "react-hot-toast";
import ParticipantForm from "./pbctfForm/ParticipantForm";
import ParticipationTypeSelection from "./pbctfForm/ParticipationTypeSelection";
import RulesAgreements from "./pbctfForm/RulesAgreements";
import AdditionalQuestions from "./pbctfForm/AdditionalQuestions";
import StepCard from "./pbctfForm/StepCard";
import SuccessScreen from "./pbctfForm/SuccessScreen";
import type { FormData } from "./pbctfForm/types";

// PARAGATI RAJ ARE YOU READING THIS
// I MISS YOU

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

const PBCTFForm: React.FC = () => {
  const [isSuccess, setSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [token, setToken] = useState<string>();
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([0]));
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    resetField,
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
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = getRecaptcha;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Watch specific fields instead of entire objects to avoid unnecessary re-renders
  const participationType = watch("participationType");
  
  // Watch individual fields for completion checking
  const participant1Name = watch("participant1.name");
  const participant1Email = watch("participant1.email");
  const participant1Phone = watch("participant1.phone");
  const participant1Age = watch("participant1.age");
  const participant1Gender = watch("participant1.gender");
  const participant1ExperienceLevel = watch("participant1.experienceLevel");
  const participant1Affiliation = watch("participant1.affiliation");
  const participant1AffiliationName = watch("participant1.affiliationName");
  const participant1PreviousCTF = watch("participant1.previousCTF");
  const participant1CTFNames = watch("participant1.ctfNames");

  const participant2Name = watch("participant2.name");
  const participant2Email = watch("participant2.email");
  const participant2Phone = watch("participant2.phone");
  const participant2Age = watch("participant2.age");
  const participant2Gender = watch("participant2.gender");
  const participant2ExperienceLevel = watch("participant2.experienceLevel");
  const participant2Affiliation = watch("participant2.affiliation");
  const participant2AffiliationName = watch("participant2.affiliationName");
  const participant2PreviousCTF = watch("participant2.previousCTF");
  const participant2CTFNames = watch("participant2.ctfNames");

  const howDidYouHear = watch("howDidYouHear");
  const secretFlag = watch("secretFlag");
  const agreeRules = watch("agreeRules");
  const consentLeaderboard = watch("consentLeaderboard");
  const allowContact = watch("allowContact");

  // Handle participation type changes
  useEffect(() => {
    if (participationType === "solo") {
      resetField("participant2");
      setCompletedSteps(prev => {
        const newSet = new Set(prev);
        newSet.delete(2);
        return newSet;
      });
    }
  }, [participationType, resetField]);

  // Check step completion with individual field watches
  useEffect(() => {
    const newCompletedSteps = new Set<number>();

    // Step 0: Participation type selected
    if (participationType) {
      newCompletedSteps.add(0);
    }

    // Step 1: Participant 1 details complete
    const participant1Complete = participant1Name && participant1Email && participant1Phone && 
        participant1Age && participant1Gender && participant1ExperienceLevel && 
        participant1Affiliation && participant1AffiliationName && participant1PreviousCTF &&
        (participant1PreviousCTF === "No" || participant1CTFNames);
    
    if (participant1Complete) {
      newCompletedSteps.add(1);
    }

    // Step 2: Participant 2 details complete (only for duo)
    if (participationType === "duo") {
      const participant2Complete = participant2Name && participant2Email && participant2Phone && 
          participant2Age && participant2Gender && participant2ExperienceLevel && 
          participant2Affiliation && participant2AffiliationName && participant2PreviousCTF &&
          (participant2PreviousCTF === "No" || participant2CTFNames);
      
      if (participant2Complete) {
        newCompletedSteps.add(2);
      }
    }

    // Step 3: Additional Questions complete
    const additionalQuestionsComplete = howDidYouHear && howDidYouHear.length > 0 && secretFlag === "pbctf{pls_h4ck_m3_d4ddy}";
    if (additionalQuestionsComplete) {
      newCompletedSteps.add(3);
    }

    // Step 4: Rules & Agreements complete
    if (agreeRules && consentLeaderboard && allowContact) {
      newCompletedSteps.add(4);
    }

    setCompletedSteps(newCompletedSteps);

    // Auto-expand next step when current step is completed
    setExpandedSteps(prev => {
      const newExpanded = new Set(prev);
      
      // Expand step 1 when step 0 is completed
      if (newCompletedSteps.has(0) && !newExpanded.has(1)) {
        newExpanded.add(1);
      }
      
      // Expand next step when step 1 is completed
      if (newCompletedSteps.has(1) && !newExpanded.has(2) && !newExpanded.has(3)) {
        if (participationType === "solo") {
          newExpanded.add(3); // Skip to step 3 (additional questions) for solo participants
        } else {
          newExpanded.add(2); // Go to step 2 for duo participants
        }
      }
      
      // Expand step 3 when step 2 is completed (duo only)
      if (participationType === "duo" && newCompletedSteps.has(2) && !newExpanded.has(3)) {
        newExpanded.add(3);
      }
      
      // Expand step 4 (rules) when step 3 (additional questions) is completed
      if (newCompletedSteps.has(3) && !newExpanded.has(4)) {
        newExpanded.add(4);
      }
      
      return newExpanded;
    });
  }, [
    participationType,
    participant1Name, participant1Email, participant1Phone, participant1Age, participant1Gender,
    participant1ExperienceLevel, participant1Affiliation, participant1AffiliationName, 
    participant1PreviousCTF, participant1CTFNames,
    participant2Name, participant2Email, participant2Phone, participant2Age, participant2Gender,
    participant2ExperienceLevel, participant2Affiliation, participant2AffiliationName, 
    participant2PreviousCTF, participant2CTFNames,
    howDidYouHear, secretFlag,
    agreeRules, consentLeaderboard, allowContact
  ]);

  const handleStepClick = (stepNumber: number) => {
    setExpandedSteps(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(stepNumber)) {
        newExpanded.delete(stepNumber);
      } else {
        newExpanded.add(stepNumber);
      }
      return newExpanded;
    });
  };

  const checkEmailUniqueness = async (email: string): Promise<boolean> => {
    if (!email) return false;
    try {
      const resp = await fetch(`/api/registration/pbctf?email=${email}`);
      const data = await resp.json();
      return Boolean(data.isUnique);
    } catch (error) {
      console.log("Error getting document:", error);
      return false;
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setEmailError(null);

    console.log("Form data submitted:", data);
    try {
      const recaptcha_token = token;
      if (recaptcha_token) {
        const response1 = await fetch(
          "/api/registration/pbctf?action=validateRecaptcha",
          {
            method: "POST",
            body: JSON.stringify({ recaptcha_token }),
          }
        );

        const res = await response1.json();

        if (!response1.ok || res.error) {
          toast.error(res.message);
          return;
        }

        if (
          data.participationType === "duo" &&
          data.participant2 &&
          data.participant1.email === data.participant2.email
        ) {
          setEmailError("Email addresses for Participant 1 and Participant 2 cannot be the same");
          setIsSubmitting(false);
          return;
        }

        const isUnique1 = await checkEmailUniqueness(data.participant1.email);
        if (!isUnique1) {
          setEmailError("Email for Participant 1 already exists");
          setIsSubmitting(false);
          return;
        }

        if (data.participationType === "duo" && data.participant2) {
          const isUnique2 = await checkEmailUniqueness(data.participant2.email);
          if (!isUnique2) {
            setEmailError("Email for Participant 2 already exists");
            setIsSubmitting(false);
            return;
          }
        }

        const response2 = await fetch(
          "/api/registration/pbctf?action=addRegistration",
          {
            method: "POST",
            body: JSON.stringify(data),
          }
        );

        const result = await response2.json();
        if (!response2.ok) {
          toast.error(result.error || "Failed to submit registration.");
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
    return <SuccessScreen />;
  }



  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Participation Type */}
        <StepCard
          stepNumber={0}
          title="Choose Participation Mode"
          isCompleted={completedSteps.has(0)}
          isExpanded={expandedSteps.has(0)}
          onStepClick={handleStepClick}
        >
          <ParticipationTypeSelection 
            register={register}
            participationType={participationType}
          />
        </StepCard>

        {/* Participant 1 */}
        <StepCard
          stepNumber={1}
          title={participationType === 'solo' ? "Your Details" : "Team Leader Details"}
          isCompleted={completedSteps.has(1)}
          isExpanded={expandedSteps.has(1)}
          onStepClick={handleStepClick}
        >
          <ParticipantForm 
            participantNumber={1} 
            register={register} 
            errors={errors} 
            watch={watch}
          />
        </StepCard>

        {/* Participant 2 (only for duo) */}
        {participationType === 'duo' && (
          <StepCard
            stepNumber={2}
            title="Team Member Details"
            isCompleted={completedSteps.has(2)}
            isExpanded={expandedSteps.has(2)}
            onStepClick={handleStepClick}
          >
            <ParticipantForm 
              participantNumber={2} 
              register={register} 
              errors={errors} 
              watch={watch}
            />
          </StepCard>
        )}

        {/* Additional Questions */}
        <StepCard
          stepNumber={3}
          title="Additional Questions"
          isCompleted={completedSteps.has(3)}
          isExpanded={expandedSteps.has(3)}
          onStepClick={handleStepClick}
        >
          <AdditionalQuestions 
            register={register}
            errors={errors}
            watch={watch}
          />
        </StepCard>

        {/* Rules & Agreements */}
        <StepCard
          stepNumber={4}
          title="Rules & Agreements"
          isCompleted={completedSteps.has(4)}
          isExpanded={expandedSteps.has(4)}
          onStepClick={handleStepClick}
        >
          <RulesAgreements 
            register={register}
            errors={errors}
          />
        </StepCard>

        {emailError && (
          <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-4">
            <p className="text-red-400 font-mono text-sm text-center">{emailError}</p>
          </div>
        )}

        {/* Submit Button */}
        {completedSteps.has(4) && (
          <div className="bg-gray-900/50 border border-green-400/30 rounded-lg p-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-400/10 hover:bg-green-400/20 border border-green-400 text-green-300 font-mono py-4 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span className="flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-green-400/20 border-t-green-400 rounded-full animate-spin"></div>
                    Processing Registration...
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </span>
            </button>
            <p className="text-xs text-gray-500 mt-3 text-center font-mono">
              By registering, you agree to the PBCTF terms and conditions
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default PBCTFForm;
