"use client";
import { useState } from "react";

export default function LeaveTeam() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleLeave() {
    const confirmed = confirm("Are you sure you want to leave the team?");

    if (!confirmed) {
      return;
    }
    try {
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

    <button
      onClick={handleLeave}
      disabled={loading}
      className="w-full bg-red-600 hover:bg-red-500 px-4 py-3 rounded-lg text-white font-semibold transition"
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