"use client";
import { useState } from "react";

export default function RemoveMemberButton() {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleRemove() {
    setShowConfirm(true);}

  async function confirmRemoval() {
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

  {showConfirm && (
    <div className="mb-4 border border-green-600 bg-black/60 rounded-lg p-4">
      <p className="text-green-300 font-mono text-sm">
        Are you sure you want to remove the member?
      </p>
      <div className="flex gap-3 mt-4">
        <button onClick={confirmRemoval}
        disabled={loading}
        className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg text-white font-semibold transition">
          Yes, Remove
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
);}
