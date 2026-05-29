"use client";
import { useState } from "react";

export default function LeaveTeam() {
  const [loading, setLoading] = useState(false);

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
        alert(data.error);
        return;
      }

      alert("You left the team");

      window.location.href =
        "/pbctf/login";
    } 
    catch (error) {
      console.error(error);
      alert("Something went wrong");
    } 
    finally {
      setLoading(false);
    }
  }
  return (
    <button
      onClick={handleLeave}
      disabled={loading}
      className="bg-red-700 px-4 py-2 rounded text-white">
      {
        loading ? "Leaving" : "Leave Team"
      }
    </button>
  );
}