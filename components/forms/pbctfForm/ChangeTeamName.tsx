"use client";
import { useState } from "react";

export default function ChangeTeamName() {

  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
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
        onClick={() =>
          setShowInput(true)
        }
        className="w-full bg-green-600 hover:bg-green-500 px-4 py-3 rounded-lg text-white font-semibold transition"
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
          placeholder="New Team Name"
          value={teamName}
          onChange={(e) =>
            setTeamName(
              e.target.value
            )
          }
          className="min-w-[250px] flex-1 bg-black border border-green-400 px-4 py-3 rounded-lg text-white"
        />

        <button
          disabled={loading}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-500 px-4 py-3 rounded-lg text-white font-semibold transition"
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