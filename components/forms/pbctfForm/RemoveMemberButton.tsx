"use client";

import { useState } from "react";

export default function RemoveMemberButton() {

  const [loading, setLoading] =
    useState(false);

  async function handleRemove() {

    const confirmed =
      confirm(
        "Remove this member from team?"
      );

    if (!confirmed) {
      return;
    }

    try {

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

        alert(data.error);

        return;
      }

      alert(
        "Member removed successfully"
      );

      window.location.reload();

    } catch (error) {

      console.error(error);

      alert(
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }
  }

  return (

    <button
      onClick={handleRemove}
      disabled={loading}
      className="bg-green-600 px-4 py-2 rounded text-white"
    >

      {
        loading
          ? "Removing"
          : "Remove Member"
      }

    </button>
  );
}