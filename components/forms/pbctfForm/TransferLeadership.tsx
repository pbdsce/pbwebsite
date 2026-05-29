"use client";
import { useState } from "react";

export default function TransferLeadership() {
  const [loading, setLoading] = useState(false);

  async function handleTransfer() {
    const confirmed = confirm("Are you sure you want to transfer leadership?");

    if (!confirmed) { return;}

    try {
      setLoading(true);
      const response = await fetch("/api/pbctf/team/transfer-leadership",
          {
            method: "POST",
          }
        );
      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }
      alert("Leadership transferred!");
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

  return (
    <button
      onClick={handleTransfer}
      disabled={loading}
      className="bg-yellow-600 px-4 py-2 rounded text-white">
      {
        loading ? "Transferring" : "Transfer Leadership"
      }
    </button>
  );
}