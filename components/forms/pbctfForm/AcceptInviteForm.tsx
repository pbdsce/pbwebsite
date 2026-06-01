"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import ParticipantForm from "./ParticipantForm";
import { FormData } from "./types";
import RulesAgreements from "./RulesAggrements";

interface Props {
  token: string;
  invitedEmail: string;
}

export default function AcceptInviteForm({
  token,
  invitedEmail,
}: Props) {

  const [loading, setLoading] =
    useState(false);

  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      participant2: {
        email: invitedEmail,
      },
    },
  });

  async function handleAcceptInvite() {

    try {

      setLoading(true);

      const participant =
        watch("participant2");

      const howDidYouHear =
        watch("howDidYouHear") || [];

      if (!participant) {
        return;
      }

      const response =
        await fetch(
          "/api/pbctf/team/accept-invite",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              token,

              participant: {
                name:
                  participant.name,

                email:
                  participant.email,

                phone:
                  participant.phone,

                gender:
                  participant.gender,

                background: {
                  experienceLevel:
                    participant.experienceLevel,

                  previousParticipation:
                    participant.previousCTF ===
                    "Yes",

                  participationDetails:
                    participant.ctfNames,

                  affiliationType:
                    participant.affiliation,

                  affiliationName:
                    participant.affiliationName,

                  howDidYouHearAboutUs:
                    howDidYouHear,
                },
              },
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        alert(data.error);

        return;
      }

      alert(
        "Successfully joined team!"
      );

      window.location.href =
        "/pbctf/login";

    } catch (error) {

      console.error(error);

      alert(
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }
  }
  const howDidYouHear =
  watch("howDidYouHear") || [];
  const hearAboutOptions = [
  "Previously Participated",
  "Twitter/X",
  "LinkedIn",
  "University/Work",
  "Friend",
  "Other",
  ];

  return (

    <div className="space-y-6">

      <ParticipantForm
        participantNumber={2}
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
      />

      {/* How did you hear about this CTF */}
        <div className="bg-gray-800/30 border border-green-400/20 rounded-lg p-4 space-y-4">
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
                className="appearance-none w-4 h-4 rounded-full border-2 border-green-400/70 bg-gray-900 checked:bg-green-400 checked:border-green-400 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-green-400/50"
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
    <RulesAgreements
      register={register}
      errors={errors}
    />

      <button
        onClick={handleAcceptInvite}
        disabled={loading}
        className="bg-green-600 px-6 py-3 rounded text-white"
      >

        {
          loading
            ? "Joining..."
            : "Join Team"
        }

      </button>

    </div>
  );
}