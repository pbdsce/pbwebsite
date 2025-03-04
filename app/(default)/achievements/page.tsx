"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Firebase";
import AchievementCard from "@/components/AchievementCard";
import LoadingBrackets from "@/components/ui/loading-brackets";
import toast from "react-hot-toast";

interface Achiever {
  id?: string;
  imageUrl?: string;
  image?: File;
  email: string;
  name: string;
  batch: number;
  portfolio: string;
  internship: string;
  companyPosition: string;
  achievements: string[];
}

export default function AchievementsPage() {
  const [achievers, setAchievers] = useState<Achiever[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Partial<Achiever>>({
    achievements: [""],
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAchievements, setEditAchievements] = useState<Partial<Achiever>>({
    achievements: [""],
  });

  // Listen to authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch achievements data
  useEffect(() => {
    const fetchAchievers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/achievements");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAchievers(data.data);
      } catch (error) {
        console.error("Error fetching achievements:", error);
        toast.error("Failed to fetch achievements");
        setAchievers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievers();
  }, []);

  // Precompute columns for displaying achievers in 3 columns
  const columns = useMemo(() => {
    const cols: Achiever[][] = [[], [], []];
    achievers.forEach((achiever, index) => {
      cols[index % 3].push(achiever);
    });
    return cols;
  }, [achievers]);

  // Callbacks for handling achievement inputs in Add Modal
  const handleAddAchievement = useCallback(() => {
    setNewAchievement((prev) => ({
      ...prev,
      achievements: [...(prev.achievements || []), ""],
    }));
  }, []);

  const handleChangeAchievement = useCallback(
    (index: number, value: string) => {
      setNewAchievement((prev) => {
        const updated = [...(prev.achievements || [])];
        updated[index] = value;
        return { ...prev, achievements: updated };
      });
    },
    []
  );

  // Callbacks for handling achievement inputs in Edit Modal
  const handleEditAddAchievement = useCallback(() => {
    setEditAchievements((prev) => ({
      ...prev,
      achievements: [...(prev.achievements || []), ""],
    }));
  }, []);

  const handleEditChangeAchievement = useCallback(
    (index: number, value: string) => {
      setEditAchievements((prev) => {
        const updated = [...(prev.achievements || [])];
        updated[index] = value;
        return { ...prev, achievements: updated };
      });
    },
    []
  );

  // Close modals and reset edit states
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setEditName("");
    setEditAchievements({ achievements: [""] });
  }, []);

  // Submit new achievement
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = ["email", "name", "batch"];
    const missingFields = requiredFields.filter(
      (field) => !newAchievement[field as keyof Achiever]
    );

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    if (
      !newAchievement.achievements ||
      newAchievement.achievements.filter((ach) => ach.trim() !== "").length ===
        0
    ) {
      toast.error("Please add at least one achievement");
      return;
    }

    try {
      const formData = new FormData();
      if (newAchievement.image) formData.append("image", newAchievement.image);
      formData.append("email", newAchievement.email || "");
      formData.append("name", newAchievement.name || "");
      formData.append("batch", String(newAchievement.batch || ""));
      formData.append("portfolio", newAchievement.portfolio || "");
      formData.append("internship", newAchievement.internship || "No");
      formData.append("companyPosition", newAchievement.companyPosition || "");
      formData.append(
        "achievements",
        JSON.stringify(
          newAchievement.achievements.filter((ach) => ach.trim() !== "")
        )
      );

      const response = await axios.post("/api/achievements", formData);
      if (response.data && response.data.name) {
        setAchievers((prev) => [...prev, response.data]);
        setIsModalOpen(false);
        toast.success("Achievement added successfully");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save achievement. Please try again.");
    }
  };

  // Fetch user details for editing achievements
  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("Please enter a name");
      return;
    }
    try {
      const response = await axios.get(
        `/api/achievements?name=${encodeURIComponent(editName)}`
      );
      console.log(response.data && response.data.data[0]);
      if (!response || !response.data || response.data.length === 0) {
        toast.error("No user found");
        return;
      }
      const user = response.data.data[0];
      if (user) {
        setEditAchievements({
          ...user,
          email: user.email || "",
          batch: user.batch || 0,
          portfolio: user.portfolio || "",
          internship: user.internship || "",
          companyPosition: user.companyPosition || "",
          achievements: user.achievements || [""],
        });
      } else {
        toast.error("No user found");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to fetch user details");
    }
  };

  // Submit edited achievements
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Filter out empty achievements; at least one is required
    const updatedAchievements =
      editAchievements.achievements?.filter((ach) => ach.trim() !== "") || [];
    if (updatedAchievements.length === 0) {
      toast.error("Please provide at least one achievement");
      return;
    }
  
    // Validate required fields on the client side.
    if (
      !editAchievements.email?.trim() ||
      !String(editAchievements.batch)?.trim() ||
      !editAchievements.portfolio?.trim() ||
      !editAchievements.companyPosition?.trim()
    ) {
      toast.error(
        "Please provide all required fields: Email, Batch, Portfolio, and Company Position."
      );
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("name", editName);
      formData.append("email", editAchievements.email);
      formData.append("batch", String(editAchievements.batch));
      formData.append("portfolio", editAchievements.portfolio);
      formData.append("internship", editAchievements.internship || "");
      formData.append("companyPosition", editAchievements.companyPosition);
      formData.append("achievements", JSON.stringify(updatedAchievements));
      if (editAchievements.image) {
        formData.append("image", editAchievements.image);
      }
  
      const response = await axios.put("/api/achievements", formData);
      console.log("response:", response.data);
      if (!response || !response.data || !response.data.data) {
        toast.error("Failed to update achievements");
        return;
      }
  
      setIsEditModalOpen(false);
      toast.success("Achievements updated successfully");
    } catch (error) {
      console.error("Error updating achievements:", error);
      toast.error("Failed to update achievements");
    }
  };
  return (
    <div className="container w-full mx-auto pt-32">
      <h1 className="text-center text-4xl font-bold mb-8">Achievements</h1>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <LoadingBrackets />
        </div>
      ) : (
        <div className="grid grid-cols-1 2gl:grid-cols-2 3gl:grid-cols-3 gap-x-5 gap-y-5 max-w-[1030px] mx-auto justify-items-center">
          {columns.map((col, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-y-5">
              {col.map((achiever, index) => (
                <AchievementCard
                  key={achiever.id || achiever.email || index}
                  achiever={achiever}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {isLoggedIn && (
        <div className="text-center mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-black py-2 px-4 rounded shadow-lg"
          >
            Add Achievements
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-black text-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Add Achievement</h2>
            <form
              className="space-y-6 overflow-y-auto max-h-[80vh]"
              onSubmit={handleSubmit}
            >
              <div className="mb-4">
                <label className="block mb-2">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={newAchievement.email || ""}
                  onChange={(e) =>
                    setNewAchievement((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full p-3 bg-gray-800 rounded"
                  placeholder="Add Email"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={newAchievement.name || ""}
                  onChange={(e) =>
                    setNewAchievement((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full p-3 bg-gray-800 rounded"
                  placeholder="Add Name"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Batch:</label>
                <input
                  type="number"
                  name="batch"
                  value={newAchievement.batch || ""}
                  onChange={(e) =>
                    setNewAchievement((prev) => ({
                      ...prev,
                      batch: Number(e.target.value),
                    }))
                  }
                  className="w-full p-3 bg-gray-800 rounded"
                  placeholder="Add Year"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Portfolio:</label>
                <input
                  type="text"
                  name="portfolio"
                  value={newAchievement.portfolio || ""}
                  onChange={(e) =>
                    setNewAchievement((prev) => ({
                      ...prev,
                      portfolio: e.target.value,
                    }))
                  }
                  className="w-full p-3 bg-gray-800 rounded"
                  placeholder="Add GitHub Link"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">
                  Doing internship or have done in past:
                </label>
                <div className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name="internship"
                      value="Yes"
                      checked={newAchievement.internship === "Yes"}
                      onChange={(e) =>
                        setNewAchievement((prev) => ({
                          ...prev,
                          internship: e.target.value,
                        }))
                      }
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="internship"
                      value="No"
                      checked={newAchievement.internship === "No"}
                      onChange={(e) =>
                        setNewAchievement((prev) => ({
                          ...prev,
                          internship: e.target.value,
                        }))
                      }
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Company & Position:</label>
                <input
                  type="text"
                  name="companyPosition"
                  value={newAchievement.companyPosition || ""}
                  onChange={(e) =>
                    setNewAchievement((prev) => ({
                      ...prev,
                      companyPosition: e.target.value,
                    }))
                  }
                  className="w-full p-3 bg-gray-800 rounded"
                  placeholder="Position, Company"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">
                  Select an image of the person:
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/jpeg, image/png, image/jpg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewAchievement((prev) => ({
                        ...prev,
                        image: file,
                        imageUrl: URL.createObjectURL(file),
                      }));
                    }
                  }}
                  className="w-full p-3 bg-gray-800 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Achievements:</label>
                {newAchievement.achievements?.map((achievement, index) => (
                  <div key={index} className="mb-2">
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) =>
                        handleChangeAchievement(index, e.target.value)
                      }
                      className="w-full p-3 bg-gray-800 rounded"
                      placeholder="Add an achievement"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddAchievement}
                  className="bg-gray-600 text-white py-2 px-4 rounded"
                >
                  Add More
                </button>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-red-500 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoggedIn && (
        <div className="text-center mb-8">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="bg-white text-black py-2 px-4 rounded shadow-lg"
          >
            Edit Achievements
          </button>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-black text-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Edit Achievements</h2>
            <form
              className="space-y-6 overflow-y-auto max-h-[50vh] mb-4"
              onSubmit={handleFetch}
            >
              <div className="mb-4">
                <label className="block mb-2">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-3 bg-gray-800 rounded"
                  placeholder="Enter Name"
                />
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Fetch
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-red-500 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
            {editAchievements.name && (
              <form
                className="space-y-6 overflow-y-auto max-h-[50vh]"
                onSubmit={handleEditSubmit}
              >
                <div className="mb-4">
                  <label className="block mb-2">Company & Position:</label>
                  <input
                    type="text"
                    name="companyPosition"
                    value={editAchievements.companyPosition || ""}
                    onChange={(e) =>
                      setEditAchievements((prev) => ({
                        ...prev,
                        companyPosition: e.target.value,
                      }))
                    }
                    className="w-full p-3 bg-gray-800 rounded"
                    placeholder="Position, Company"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Achievements:</label>
                  {editAchievements.achievements?.map((achievement, index) => (
                    <div key={index} className="mb-2">
                      <input
                        type="text"
                        value={achievement}
                        onChange={(e) =>
                          handleEditChangeAchievement(index, e.target.value)
                        }
                        className="w-full p-3 bg-gray-800 rounded"
                        placeholder="Add an achievement"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleEditAddAchievement}
                    className="bg-gray-600 text-white py-2 px-4 rounded"
                  >
                    Add More
                  </button>
                </div>
                <div className="flex gap-4 mt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-red-500 text-white py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
