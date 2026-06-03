"use client";
import { useState } from "react";

export default function ChangeTeamName({
  currentTeamName,}: { currentTeamName: string}) {
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
     setError("");
     setMessage("");
     setLoading(true);
    const response = await fetch("/api/pbctf/team/change-name", {
      method: "PATCH",
        headers: {"Content-Type": "application/json",},
          body: JSON.stringify({ teamName,}),
          }
        );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      setMessage(
        "Team name updated!"
      );

      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } 
    catch (error) {
      console.error(error);
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

    {!showInput ? (

      <button
        onClick={() => setShowInput(true)}
        className="w-full border border-green-400/20 bg-gradient-to-r from-green-900/20 to-green-800/10 rounded-xl py-6 text-center hover:bg-green-400/5 transition-all duration-300 font-mono font-semi-bold text-xl"
      >
        Change Team Name
      </button>

    ) : (

      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-3 w-full"
      >

        <input
          type="text"
          placeholder={currentTeamName}
          value={teamName}
          onChange={(e) =>
            setTeamName(
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
              ? "Updating"
              : "Save"
          }
        </button>

        <button
          type="button"
          onClick={() =>
            setShowInput(false)
          }
          className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg text-white font-semibold transition"
        >
          Cancel
        </button>
      </form>
    )}
  </div>
);
}