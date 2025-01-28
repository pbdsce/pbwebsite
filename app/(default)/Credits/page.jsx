"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Firebase";
import { PinContainer } from "./creditcards/credits";
import { useRouter } from "next/navigation";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { PuffLoader } from "react-spinners";

export default function PinPage() {
  const [contributors, setContributors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditIcons, setShowEditIcons] = useState(false);
  const [isEditingEdit, setIsEditingEdit] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState(null);
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        try {
          const resp = await fetch(`/api/admin?uid=${uid}`);
          const data = await resp.json();
          if (data.isAdmin) {
            setIsAdmin(true);
          }
        } catch (error) {
          console.log("Error getting document:", error);
        }
      }
    });
  }, []);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await fetch("/api/credits");
        if (!response.ok) {
          throw new Error("Failed to fetch contributors");
        }
        const data = await response.json();
        setContributors(data.credits || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContributors();
  }, []);

  const handleEdit = (contributor) => {
    setSelectedCredit(contributor);
    setIsEditingEdit(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/credits/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete contributor");
      }

      setContributors((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { name, githubUrl } = e.target.elements;
    const updatedCredit = {
      name: name.value,
      githubUrl: githubUrl.value,
    };

    try {
      const response = await fetch(`/api/credits/${selectedCredit._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCredit),
      });

      if (!response.ok) {
        throw new Error("Failed to update contributor");
      }

      const updatedData = await response.json();

      setContributors((prev) =>
        prev.map((c) =>
          c._id === selectedCredit._id ? updatedData.updatedCredit : c
        )
      );

      setIsEditingEdit(false);
      setSelectedCredit(null);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingEdit(false);
    setSelectedCredit(null);
  };

  const toggleEditIcons = () => {
    setShowEditIcons((prev) => !prev);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mt-14 mb-6">
        Website <span className="text-green-500">Contributors</span>
      </h1>

      {isLoading && (
        <div className="flex justify-center items-center min-h-screen">
          <PuffLoader color="#00c853" size={100} />
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && contributors.length === 0 && (
        <p className="text-slate-100">No contributors found.</p>
      )}

      {/* Form for adding/editing contributors */}
      {isEditingEdit && selectedCredit && (
        <form
          onSubmit={handleFormSubmit}
          className="bg-gray-800 p-6 rounded-lg shadow-lg w-[90%] sm:w-[40%] text-slate-100 mb-8"
        >
          <h2 className="text-xl font-bold mb-4">Edit Contributor</h2>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Name</label>
            <input
              type="text"
              name="name"
              defaultValue={selectedCredit.name}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">GitHub URL</label>
            <input
              type="url"
              name="linkedinUrl"
              defaultValue={selectedCredit.githubUrl}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Grid container */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-[10px] items-start">
        {!isLoading &&
          !error &&
          [...contributors]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((contributor) => (
              <div
                className="relative flex flex-col items-center"
                key={contributor._id}
              >
                {/* PinContainer */}
                <PinContainer title="Visit GitHub" href={contributor.githubUrl}>
                  <div className="flex flex-col p-4 tracking-tight text-slate-100/50 w-[20rem] h-[20rem] relative bg-gray-900 rounded-md">
                    {/* Image wrapper */}
                    <div className="relative h-full w-full">
                      <Image
                        src={contributor.imageUrl}
                        alt={contributor.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                      {/* Overlay description */}
                      <div className="absolute bottom-0 left-0 w-full p-4 text-left bg-gradient-to-t from-black/60 to-transparent z-10">
                        <h3 className="font-bold text-base text-slate-100">
                          {contributor.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </PinContainer>

                {/* Edit and Delete Buttons */}
                <div
                  className={`flex justify-center space-x-4 mt-9 ${
                    showEditIcons
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  } `}
                >
                  <button
                    className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-500 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Edit clicked!");
                      handleEdit(contributor);
                    }}
                  >
                    <FaPencilAlt className="text-white" size={20} />
                  </button>
                  <button
                    className="bg-red-600 text-white rounded-full p-2 hover:bg-red-500 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Delete clicked!");
                      handleDelete(contributor._id);
                    }}
                  >
                    <FaTrash className="text-white" size={20} />
                  </button>
                </div>
              </div>
            ))}
      </div>

      {isAdmin && (
        <div className="w-full flex justify-center mt-10">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition"
            onClick={() => router.push("/Credits/addcredit")}
          >
            Add Contributor
          </button>

          <button
            className="bg-white text-green-600 px-4 py-2 rounded hover:bg-gray-500 transition ml-4"
            onClick={toggleEditIcons}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
