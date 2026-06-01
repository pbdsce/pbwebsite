"use client";

import { useState } from "react";

export default function SendInviteForm() {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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

        setError(data.error);

        return;
      }

      setMessage(
        "Invite sent successfully!"
      );

      setEmail("");

    } catch (error) {

      console.error(error);

      setError(
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }
  }

  return (

  <div className="w-full">

    {!showForm ? (

      <button
        onClick={() =>
          setShowForm(true)
        }
        className="w-full bg-green-600 hover:bg-green-500 px-4 py-3 rounded-lg text-white font-semibold transition"
      >

        Add Member

      </button>

    ) : (

      <div className="flex flex-col gap-2">

        <form
          onSubmit={handleSendInvite}
          className="flex gap-3"
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
            className="flex-1 bg-black border border-green-400 px-4 py-3 rounded-lg text-white"
          />

          <button
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-3 rounded-lg text-white font-semibold transition"
          >

            {
              loading
                ? "Sending..."
                : "Send Invite"
            }

          </button>

        </form>

        {message && (
          <p className="text-green-400 text-sm font-mono">
            {message}
          </p>
        )}

        {error && (
          <p className="text-red-400 text-sm font-mono">
            {error}
          </p>
        )}

      </div>

    )}

  </div>
);
}