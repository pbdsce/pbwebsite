"use client";

import { useState } from "react";

export default function RemoveMemberButton() {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleRemove() {

    const confirmed =
      confirm(
        "Remove this member from team?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");
      setLoading(true);

      const response =
        await fetch(
          "/api/pbctf/team/remove-member",
          {
            method: "DELETE",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        setError(data.error);

        return;
      }

      setMessage(
        "Member removed successfully"
      );

      setTimeout(() => {
        window.location.reload();
      }, 1500);

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
      onClick={handleRemove}
      disabled={loading}
      className="w-full bg-green-600 hover:bg-green-500 px-4 py-3 rounded-lg text-white font-semibold transition"
    >

      {
        loading
          ? "Removing"
          : "Remove Member"
      }

    </button>

  </div>
);
}