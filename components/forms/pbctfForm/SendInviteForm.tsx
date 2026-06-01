"use client";

import { useState } from "react";

export default function SendInviteForm() {

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showForm, setShowForm] =
   useState(false);

  async function handleSendInvite(
    e: React.FormEvent
  ) {

    e.preventDefault();

    try {

      setLoading(true);

      const response =
        await fetch(
          "/api/pbctf/team/send-invite",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email,
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
        "Invite sent successfully!"
      );

      setEmail("");

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

    {!showForm ? (

      <button
        onClick={() =>
          setShowForm(true)
        }
        className="bg-blue-600 px-4 py-2 rounded text-white"
      >

        Add Member

      </button>

    ) : (

      <form
        onSubmit={handleSendInvite}
        className="flex gap-2"
      >

        <input
          type="email"
          placeholder="Invite member email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          className="bg-black border border-green-400 px-3 py-2 rounded"
        />

        <button
          disabled={loading}
          className="bg-blue-600 px-4 py-2 rounded text-white"
        >

          {
            loading
              ? "Sending..."
              : "Send Invite"
          }

        </button>

      </form>

    )}

  </div>
);
}