"use client";
import { useState } from "react";

export default function LeaveTeam() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleLeave() {
    setShowConfirm(true);
  }

    async function confirmLeave() {
    try {
      setError("");
      setMessage("");
      setLoading(true);
      const response =
        await fetch("/api/pbctf/team/leave",
          {
            method: "POST",
          }
        );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      setMessage("You left the team");

     setTimeout(() => {
        window.location.href =
          "/pbctf/login";
      }, 1500);
    } 
    catch (error) {
      setError("Something went wrong");
    } 
    finally {
      setLoading(false);
      setShowConfirm(false);
    }
  }
  return (
  <div className="w-full">
    {message && (
    <p className="text-green-400 text-sm font-mono mt-2">
      {message}
    </p>
  )}

    {error && (
    <p className="text-red-400 text-sm font-mono mt-2">
      {error}
    </p>
  )}

  {showConfirm && (
    <div className="mb-4 border border-red-500 bg-black/60 rounded-lg p-4">
      <p className="text-red-300 font-mono text-sm">
        Are you sure you want to leave the team?
      </p>
      <div className="flex gap-3 mt-4">
        <button onClick={confirmLeave}
        disabled={loading}
        className="bg-red-500 hover:bg-red-500 px-4 py-2 rounded-lg text-white font-semibold transition">
          Yes, Leave
        </button>
        <button onClick={()=> setShowConfirm(false)}
        disabled={loading}
        className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-white font-semibold transition border border-zinc-600">
          Cancel
        </button>
      </div>
    </div>
  )}

    <button
      onClick={handleLeave}
      disabled={loading}
      className="w-full bg-red-500 hover:bg-red-500 px-4 py-3 rounded-lg text-white font-semibold transition"
    >

      {
        loading
          ? "Leaving"
          : "Leave Team"
      }

    </button>

  </div>
);
}