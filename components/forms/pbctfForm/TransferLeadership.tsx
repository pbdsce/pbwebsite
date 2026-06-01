"use client";
import { useState } from "react";

export default function TransferLeadership() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleTransfer() {
    const confirmed = confirm("Are you sure you want to transfer leadership?");

    if (!confirmed) { return;}
    try {
      setError("");
      setMessage("");
      setLoading(true);
      const response = await fetch("/api/pbctf/team/transfer-leadership",
          {
            method: "POST",
          }
        );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }
      setMessage("Leadership transferred!");
      window.location.reload();
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

    <button
      onClick={handleTransfer}
      disabled={loading}
      className="w-full bg-green-600 hover:bg-green-500 px-4 py-3 rounded-lg text-white font-semibold transition"
    >
      {
        loading
          ? "Transferring"
          : "Transfer Leadership"
      }
    </button>

  </div>
);
}