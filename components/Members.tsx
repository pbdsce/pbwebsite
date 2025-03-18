"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Firebase";
import Image from "next/image";
import Card from "./ui/Card";
import CollapsibleSection from "./ui/CollapsibleSection";
import { useStore } from "@/lib/zustand/store";
import LoadingBrackets from "@/components/ui/loading-brackets";

interface Member {
  id?: string;
  name: string;
  role: string;
  company?: string;
  year: string;
  linkedInUrl?: string;
  imageUrl?: string;
}

const headings = [
  "Alumni",
  "Fourth Year",
  "Third Year",
  "Second Year",
  "First Year",
];

export default function Members() {
  const [openIndex, setOpenIndex] = useState<number>(
    headings.indexOf("Alumni")
  );
  const [data, setData] = useState<{ [key: string]: Member[] }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editMemberId, setEditMemberId] = useState<string | null>(null);
  const [newMember, setNewMember] = useState<Member>({
    name: "",
    role: "",
    company: "",
    year: "",
    linkedInUrl: "",
    imageUrl: "",
  });

  const { image, setImage } = useStore();

  const [menuVisible, setMenuVisible] = useState<{ [key: string]: boolean }>(
    {}
  );
  const formRef = useRef<HTMLDivElement>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const { isLoggedIn, setLoggedIn } = useStore();

  useEffect(() => {
    onAuthStateChanged(auth, async (user : any) => {
      try {
        if (user) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.log("Error getting document:", error);
      }
    });
  }, [isLoggedIn]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImage(file);
      setNewMember((newMember) => ({
        ...newMember,
        imageUrl: URL.createObjectURL(files[0]),
      }));
    } else {
      console.error("No file selected or invalid file input");
    }
  };

  const handleAddOrEditMember = async () => {
    if (!newMember.name || !newMember.role || !newMember.year) {
      alert(
        "Please fill in all required fields (Name, Domain/Role, and Year)."
      );
      return;
    }

    try {
      const method = isEditing ? "PUT" : "POST";
      let imageUrl = newMember.imageUrl;

      // Handling image URL upload if it's a blob
      if (newMember.imageUrl && newMember.imageUrl.startsWith("blob")) {
        console.log("Image file detected, uploading to Cloudinary Storage...");
        const formData = new FormData();
        formData.append("file", image as Blob);
        formData.append("name", newMember.name);
        try {
          const response = await fetch("/api/membersData/upload", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();
          if (!response.ok)
            throw new Error(data.message || "Image upload failed.");
          imageUrl = data.imageUrl;
          console.log("Image uploaded successfully, URL:", imageUrl);
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Failed to upload image. Please try again.");
          return;
        }
      }

      // Updating member data with the new image URL
      let memberData = isEditing
        ? { ...newMember, id: editMemberId }
        : newMember;

      memberData = { ...newMember, imageUrl };

      if (newMember.id) {
        // Update member in Firestore
        try {
          const response = await fetch(`/api/membersData`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(memberData),
          });

          const result = await response.json();

          if (!response.ok) {
            console.error("Network response was not ok.", result);
            throw new Error(result.message || "Network response was not ok.");
          }

          alert("Member updated successfully");
        } catch (error) {
          console.error("Error updating member:", error);
          alert("Failed to update member. Please try again.");
          return;
        }
      } else {
        // Add new member to Firestore
        try {
          const response = await fetch("/api/membersData", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(memberData),
          });

          if (!response.ok) {
            const result = await response.json();
            console.error("Failed to add member:", result);
            throw new Error(result.message || "Failed to add member.");
          }

          alert("Member added successfully");
        } catch (error) {
          console.error("Error adding member:", error);
          alert("Failed to add member. Please try again.");
          return;
        }
      }

      // Reset the form and state
      setShowForm(false);
      setIsEditing(false);
      setEditMemberId(null);
      setNewMember({
        name: "",
        role: "",
        company: "",
        year: "",
        linkedInUrl: "",
        imageUrl: "",
      });
      await fetchData();
    } catch (error) {
      console.error("Error adding/updating member:", error);
      alert(
        "An unexpected error occurred. Please check the console for details."
      );
    }
  };

  const handleEditMember = (member: Member) => {
    setNewMember(member);
    setIsEditing(true);
    setShowForm(true);
    setEditMemberId(member.id || null);
    // Scroll to the form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const handleDeleteMember = async (id: string) => {
    try {
      const response = await fetch("/api/membersData", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const result = await response.json();

      if (result.error) {
        console.error("Error deleting member:", result.message);
        alert(result.message);
      } else {
        alert("Member deleted successfully");
        await fetchData();
      }
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const toggleMenu = (id: string) => {
    setMenuVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/membersData", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: Member[] = await response.json();
      const uniqueMembersMap = new Map<string, Member>();

      result.forEach((member: Member) => {
        const key = `${member.name}-${member.role}-${member.year}`;
        if (!uniqueMembersMap.has(key)) {
          uniqueMembersMap.set(key, member);
        }
      });

      const uniqueMembers = Array.from(uniqueMembersMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      const fetchedData: { [key: string]: Member[] } = {};

      for (const heading of headings) {
        fetchedData[heading] = uniqueMembers.filter(
          (member: Member) => member.year === heading
        );
      }

      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full space-y-4 mt-24 bg-black">
      <h1 className="text-center font-bold text-4xl text-white">
        Point Blank&apos;s Team
      </h1>
      <div className="w-full max-w-6xl px-2">
        {loading ? (
          <div className="flex justify-center py-10">
            <LoadingBrackets/>
          </div>
        ) : (
          <div className="space-y-2">
            {headings.map((heading, index) => (
              <CollapsibleSection
                key={index}
                heading={heading}
                content={
                  <div className="flex justify-center">
                    {/* {heading === "First Year" && (
                      <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg flex items-center space-x-9 lg:w-7/12 justify-center">
                        <p className="text-xl font-bold lg:text-2xl text-center">
                          Recruitment Incoming Soon!
                        </p>
                        <FaRegBell
                          className="text-[#00C853] text-2xl"
                          style={{
                            animation: "ring 0.5s ease-in-out infinite",
                            transformOrigin: "center",
                          }}
                        />
                        <style jsx>{`
                          @keyframes ring {
                            0% {
                              transform: rotate(0deg);
                            }
                            25% {
                              transform: rotate(-15deg);
                            }
                            50% {
                              transform: rotate(0deg);
                            }
                            75% {
                              transform: rotate(15deg);
                            }
                            100% {
                              transform: rotate(0deg);
                            }
                          }
                        `}</style>
                      </div>
                    )} */}
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                      {data[heading]?.map((profile, cardIndex) => (
                        <div key={cardIndex} className="relative">
                          <Card
                            name={profile.name}
                            role={profile.role}
                            company={profile.company || ""}
                            linkedInUrl={profile.linkedInUrl || ""}
                            imageUrl={profile.imageUrl || ""}
                          />
                          <div className="absolute top-2 right-2">
                            {isLoggedIn ? (
                              <button
                                onClick={() => toggleMenu(profile.id || "")}
                                className="bg-gray-800
                                                             text-white p-2 rounded-full"
                              >
                                <FaEllipsisV />
                              </button>
                            ) : null}

                            {menuVisible[profile.id || ""] && (
                              <div className="absolute right-0 mt-2 bg-black text-white border rounded-md shadow-lg">
                                <button
                                  onClick={() => handleEditMember(profile)}
                                  className="block w-full px-4 py-2 hover:bg-gray-900"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteMember(profile.id || "")
                                  }
                                  className="block px-4 py-2 text-red-700 hover:bg-gray-900"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                }
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
              />
            ))}
          </div>
        )}

        {isLoggedIn ? (
          <div className="flex justify-center mt-8">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-md"
              onClick={() => {
                setShowForm((prev) => {
                  const newShowForm = !prev;
                  // Scroll to the form if it's being shown
                  if (newShowForm) {
                    formRef.current?.scrollIntoView({ behavior: "smooth" });
                  }
                  return newShowForm;
                });
              }}
            >
              {showForm ? "Close Form" : "Add Member"}
            </button>
          </div>
        ) : null}

        {showForm && (
          <div
            ref={formRef}
            className="mt-6 p-6 w-full mx-auto rounded-lg shadow-lg flex flex-col justify-center items-center"
            style={{ backgroundColor: "black" }}
          >
            <h2 className="text-2xl font-bold text-white mb-10 text-center">
              {isEditing ? "Edit Member" : "Add New Member"}
            </h2>
            <form className="lg:flex lg:flex-col lg:justify-center lg:items-center">
              <label className="block text-white mb-10">
                Name<span className="text-red-500">*</span>
                <input
                  type="text"
                  value={newMember.name}
                  name="name"
                  onChange={(e) =>
                    setNewMember({ ...newMember, name: e.target.value })
                  }
                  className="block w-72 md:w-96 mt-1 p-2 rounded bg-black border-b border-white text-white focus:border-green-600 focus:outline-none"
                />
              </label>
              <label className="block text-white mb-10">
                Domain/Role<span className="text-red-500">*</span>
                <input
                  type="text"
                  value={newMember.role}
                  name="domain"
                  onChange={(e) =>
                    setNewMember({ ...newMember, role: e.target.value })
                  }
                  className="block w-72 md:w-96 mt-1 p-2 rounded bg-black border-b border-white text-white focus:border-green-600 focus:outline-none"
                />
              </label>
              <label className="block text-white mb-10">
                Company (optional):
                <input
                  type="text"
                  value={newMember.company || ""}
                  name="company"
                  onChange={(e) =>
                    setNewMember({ ...newMember, company: e.target.value })
                  }
                  className="block w-72 md:w-96 mt-1 p-2 rounded bg-black border-b border-white text-white focus:border-green-600 focus:outline-none"
                />
              </label>
              <label className="block text-white mb-6">
                Year<span className="text-red-500">*</span>
                <select
                  value={newMember.year}
                  name="year"
                  onChange={(e) =>
                    setNewMember({ ...newMember, year: e.target.value })
                  }
                  className="block w-72 md:w-96 mt-1 p-2 rounded bg-black border-b border-white text-white focus:border-green-600 focus:outline-none"
                >
                  <option value="">Select Year</option>
                  {headings.map((heading, idx) => (
                    <option key={idx} value={heading}>
                      {heading}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-white mb-10">
                LinkedIn Url<span className="text-red-500">*</span>
                <input
                  type="text"
                  value={newMember.linkedInUrl}
                  name="linkedInUrl"
                  onChange={(e) =>
                    setNewMember({ ...newMember, linkedInUrl: e.target.value })
                  }
                  className="block w-72 md:w-96 mt-1 p-2 rounded bg-black border-b border-white text-white focus:border-green-600 focus:outline-none"
                />
              </label>

              <div>
                <label className="block text-white mb-10">
                  Upload Photo<span className="text-red-500">*</span>
                  <input
                    type="file"
                    accept="image/*"
                    name="photo"
                    onChange={handleFileChange}
                    className="block w-72 md:w-96 mt-1 p-2 rounded bg-black border-b border-white text-white focus:border-green-600 focus:outline-none"
                  />
                </label>

                {newMember.imageUrl && (
                  <div className="relative w-40 h-40">
                    <p className="text-white ">Preview:</p>
                    <Image
                      src={newMember.imageUrl}
                      alt="Uploaded"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: "contain" }}
                      className="mt-4 rounded"
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleAddOrEditMember}
                className="mt-8 px-4 py-2 bg-green-600 text-white rounded-md mx-auto"
              >
                {isEditing ? "Update Member" : "Add Member"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
