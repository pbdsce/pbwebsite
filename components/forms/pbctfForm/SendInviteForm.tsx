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
      setError("");
      setMessage("");
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
        className="w-full border border-green-400/20 bg-gradient-to-r from-green-900/20 to-green-800/10 rounded-xl py-6 text-center hover:bg-green-400/5 transition-all duration-300 font-mono font-semi-bold text-xl">
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
            className="min-w-[250px] flex-1 bg-green-900/20 border border-green-500/20 px-4 py-3 rounded-lg text-white"
          />

          <button
            disabled={loading}
            className="border border-green-400/30 rounded-xl px-4 py-2 bg-green-900/10 hover:bg-green-900/20 transition-all duration-300"
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