"use client";
import { useState } from "react";

export default function ChangeTeamName() {
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent ) {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("/api/pbctf/team/change-name", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",},
            body: JSON.stringify({teamName,}),
          }
        );

      const data = await response.json();

      if (!response.ok) { alert(data.error);
        return;
      }

      alert("Team name updated!");
      window.location.reload();
    } 
    catch (error) {
      console.error(error);
      alert("Something went wrong");
    } 
    finally {
      setLoading(false);
    }
  }

  return(
    <form onSubmit={handleSubmit} className="flex gap-2">
    <input
      type="text"
      placeholder="New Team Name"
      value={teamName}
      onChange={(e) => setTeamName(e.target.value)}
        className="bg-black border border-green-400 px-3 py-2 rounded"
      />
      <button disabled={loading} className="bg-green-600 px-4 py-2 rounded text-white">
        {
          loading ? "Updating" : "Change Team Name"
        }
      </button>
    </form>
  );
}