"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import ParticipantForm from "./ParticipantForm";
import { FormData } from "./types";

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

  return (

    <div>

      <ParticipantForm
        participantNumber={2}
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
      />

      <button
        onClick={handleAcceptInvite}
        disabled={loading}
        className="bg-green-600 px-6 py-3 rounded text-white mt-8"
      >

        {
          loading
            ? "Joining"
            : "Join Team"
        }

      </button>

    </div>
  );
}