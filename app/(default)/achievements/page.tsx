"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Firebase";
import { useStore } from "@/lib/zustand/store";
import toast from "react-hot-toast";
import React from "react";
import { motion, AnimatePresence, stagger } from "framer-motion";
import LoadingBrackets from "@/components/ui/loading-brackets";

interface Achievement {
  title: string;
  description: string;
  stipend: number | null;
  year: number;
}

interface Achiever {
  id?: string;
  imageUrl?: string;
  image?: File;
  email: string;
  name: string;
  batch: string;
  portfolio: string;
  achievements: {
    GSoC?: Achievement[];
    Hackathon?: Achievement[];
    CP?: Achievement[];
    [key: string]: Achievement[] | undefined;
  };
}

const headingText = "We Build. We Ship. We Win.";
const subtitleText = "A showcase of achievements by the talented members of PointBlank";

export default function AchievementsPage() {
  const [achievers, setAchievers] = useState<Achiever[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Partial<Achiever>>({ achievements: {} });
  const { isLoggedIn, setLoggedIn } = useStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editEmail, setEditEmail] = useState("");
  const [editAchievements, setEditAchievements] = useState<Partial<Achiever>>({ achievements: {} });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [showAchievementsGrid, setShowAchievementsGrid] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      setLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, [setLoggedIn]);

  useEffect(() => {
    async function fetchAchievers() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/test-achievements");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setAchievers(data.data);
      } catch (error) {
        toast.error("Failed to fetch achievements");
        setAchievers([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAchievers();
  }, []);

  useEffect(() => {
    const categories = Object.keys(achievers[0]?.achievements || {});
    if (categories.length > 0 && (!selectedCategory || !categories.includes(selectedCategory))) {
      setSelectedCategory('All');
    }
    if (isInitialRender) {
      setIsInitialRender(false);
    }
  }, [achievers]);

  useEffect(() => {
    const timer = setTimeout(() => setShowAchievementsGrid(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddAchievement = (category: string) => {
    setNewAchievement(prev => ({
      ...prev,
      achievements: {
        ...prev.achievements,
        [category]: [
          ...(prev.achievements?.[category] || []),
          { title: "", description: "", stipend: null, year: new Date().getFullYear() }
        ]
      }
    }));
  };

  const handleChangeAchievement = (category: string, index: number, field: keyof Achievement, value: string | number | null) => {
    setNewAchievement(prev => {
      const categoryAchievements = [...(prev.achievements?.[category] || [])];
      if (categoryAchievements[index]) {
        categoryAchievements[index] = {
          ...categoryAchievements[index],
          [field]: value
        };
      }
      return {
        ...prev,
        achievements: {
          ...prev.achievements,
          [category]: categoryAchievements
        }
      };
    });
  };

  const handleEditAddAchievement = (category: string) => {
    setEditAchievements(prev => ({
      ...prev,
      achievements: {
        ...prev.achievements,
        [category]: [
          ...(prev.achievements?.[category] || []),
          { title: "", description: "", stipend: null, year: new Date().getFullYear() }
        ]
      }
    }));
  };

  const handleEditChangeAchievement = (category: string, index: number, field: keyof Achievement, value: string | number | null) => {
    setEditAchievements(prev => {
      const categoryAchievements = [...(prev.achievements?.[category] || [])];
      if (categoryAchievements[index]) {
        categoryAchievements[index] = {
          ...categoryAchievements[index],
          [field]: value
        };
      }
      return {
        ...prev,
        achievements: {
          ...prev.achievements,
          [category]: categoryAchievements
        }
      };
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setEditEmail("");
    setDeleteConfirmEmail("");
    setEditAchievements({ achievements: {} });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields = ['email', 'name', 'batch'];
    const missingFields = requiredFields.filter(field => !newAchievement[field as keyof Achiever]);
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    if (!newAchievement.achievements || Object.keys(newAchievement.achievements).length === 0) {
      toast.error("Please add at least one achievement");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("image", newAchievement.image || "");
      formData.append("email", newAchievement.email || "");
      formData.append("name", newAchievement.name || "");
      formData.append("batch", newAchievement.batch || "");
      formData.append("portfolio", newAchievement.portfolio || "");
      formData.append("achievements", JSON.stringify(newAchievement.achievements));
      const response = await axios.post("/api/test-achievements", formData);
      if (response.data && response.data.data) {
        setAchievers(prev => [...prev, response.data.data]);
        setIsModalOpen(false);
        toast.success("Achievement added successfully");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch {
      toast.error("Failed to save achievement. Please try again.");
    }
  };

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editEmail || editEmail.trim() === "") {
      toast.error("Please enter an email");
      return;
    }
    try {
      const response = await axios.get(`/api/test-achievements?email=${encodeURIComponent(editEmail)}`);
      if (!response.data.data || response.data.data.length === 0) {
        toast.error("No user found");
        return;
      }
      const user = response.data.data[0];
      setEditAchievements({ ...user, achievements: user.achievements || {} });
    } catch {
      toast.error("Failed to fetch user details");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAchievements.achievements || Object.keys(editAchievements.achievements).length === 0) {
      toast.error("Please add at least one achievement");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("email", editEmail);
      formData.append("achievements", JSON.stringify(editAchievements.achievements));
      if (editAchievements.image instanceof File) formData.append("image", editAchievements.image);
      if (editAchievements.name) formData.append("name", editAchievements.name);
      if (editAchievements.batch) formData.append("batch", editAchievements.batch);
      if (editAchievements.portfolio) formData.append("portfolio", editAchievements.portfolio);
      const response = await axios.put("/api/test-achievements", formData);
      if (response.data && response.data.data) {
        setAchievers(prev => prev.map(achiever => achiever.email === editEmail ? response.data.data : achiever));
        setIsEditModalOpen(false);
        toast.success("Achievement updated successfully");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch {
      toast.error("Failed to update achievement. Please try again.");
    }
  };

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteConfirmEmail || deleteConfirmEmail.trim() === "") {
      toast.error("Please enter an email to confirm deletion");
      return;
    }
    try {
      const response = await axios.delete(`/api/test-achievements?email=${encodeURIComponent(deleteConfirmEmail)}`);
      if (response.data && response.data.message) {
        setAchievers(prev => prev.filter(achiever => achiever.email !== deleteConfirmEmail));
        setIsDeleteModalOpen(false);
        setDeleteConfirmEmail("");
        toast.success("Achievement deleted successfully");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch {
      toast.error("Failed to delete achievement. Please try again.");
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes blinker { to { opacity: 0; } }
          div[style*="overflow-x-auto"]::-webkit-scrollbar { display: none !important; }
        `}
      </style>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <LoadingBrackets />
        </div>
      ) : (
        <div className="container w-full mx-auto pt-32 min-h-screen bg-black">
          <div className="relative">
            <div className="flex flex-col items-center text-center text-3xl md:text-5xl font-extrabold mb-4 text-white tracking-tight min-h-[2.5em]">
              <div className="flex flex-col items-center">
                <div className="flex flex-wrap justify-center gap-2 max-w-[90vw] md:max-w-none">
                  {headingText.split(". ").map((phrase, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, y: 6, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ 
                        duration: 1,
                        delay: idx * 0.4,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                      className="whitespace-normal"
                    >
                      {phrase}
                      {idx < headingText.split(". ").length - 1 ? "." : ""}
                    </motion.span>
                  ))}
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ 
                    duration: 1,
                    delay: 1.5,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="text-lg font-light md:text-xl text-gray-400"
                >
                  {subtitleText}
                </motion.p>
              </div>
            </div>
          </div>

          <motion.div 
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 2.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="w-full overflow-x-auto whitespace-nowrap flex md:justify-center"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex gap-4 mb-8 min-w-max px-4">
                <motion.button
                  key="All"
                  onClick={() => setSelectedCategory('All')}
                  className={`px-6 py-2 rounded-full font-semibold transition text-base focus:outline-none border border-transparent
                    ${selectedCategory === 'All'
                      ? "bg-green-500 text-black"
                      : "bg-gray-900 text-gray-200"}
                  `}
                  style={{ minWidth: 120 }}
                >
                  All
                </motion.button>
                {Object.keys(achievers[0]?.achievements || {}).map((category) => {
                  const isActive = selectedCategory === category;
                  return (
                    <motion.button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-6 py-2 rounded-full font-semibold transition text-base focus:outline-none border border-transparent
                        ${isActive
                          ? "bg-green-500 text-black"
                          : "bg-gray-900 text-gray-200"}
                      `}
                      style={{ minWidth: 120 }}
                    >
                      {category}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {selectedCategory && showAchievementsGrid && (
              <motion.div 
                key={selectedCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
              >
                {achievers
                  .filter(achiever => {
                    if (selectedCategory === 'All') {
                      return Object.values(achiever.achievements || {}).some(arr => arr && arr.length > 0);
                    }
                    const categoryAchievements = achiever.achievements?.[selectedCategory];
                    return categoryAchievements && categoryAchievements.length > 0;
                  })
                  .map((achiever, idx) => (
                    <motion.div
                      key={achiever.email}
                      className="relative flex items-stretch group"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * idx }}
                    >
                      <div className="relative group rounded-2xl w-full transition-all duration-300 hover:scale-105">
                        <div
                          className="pointer-events-none absolute inset-0 z-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            transform: "scaleX(1.02) scaleY(1.04)",
                            background: "linear-gradient(-45deg, #00ff88 0%, #00e676 50%, #005533 100%)"
                          }}
                        ></div>                      
                        <div className="relative z-10 bg-[#101214] border border-transparent rounded-2xl h-full w-full p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-4">
                              {achiever.imageUrl && (
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-800">
                                  <img src={achiever.imageUrl} alt={achiever.name} className="w-full h-full object-cover" />
                                </div>
                              )}
                              <div className="flex flex-col justify-center">
                                <h3 className="text-base font-bold text-green-400 leading-tight">{achiever.name}</h3>
                                <p className="text-xs text-gray-400 leading-tight">{achiever.batch}</p>
                              </div>
                            </div>
                            <div className="flex flex-col gap-4 w-full mt-2">
                              {selectedCategory === 'All' ? (
                                (() => {
                                  const allAchievements = Object.values(achiever.achievements || {}).flat().filter(Boolean);
                                  const rows = [];
                                  for (let i = 0; i < allAchievements.length; i += 3) {
                                    rows.push(allAchievements.slice(i, i + 3));
                                  }
                                  return rows.map((row, rowIdx) => (
                                    <div key={rowIdx} className="flex flex-row items-stretch gap-0">
                                      {row.map((achievement, i) => (
                                        achievement ? (
                                          <React.Fragment key={i}>
                                            <div className="flex-1 flex flex-col min-w-0 px-2">
                                              <span className="font-semibold text-green-500 text-sm break-words">{achievement.title}</span>
                                              <span className="text-gray-400 text-sm mt-1 break-words whitespace-pre-line">{achievement.description}</span>
                                            </div>
                                            {i < row.length - 1 && (
                                              <div className="flex items-stretch justify-center">
                                                <div className="w-px h-full bg-gray-600 mx-2" style={{ minHeight: '40px' }} />
                                              </div>
                                            )}
                                          </React.Fragment>
                                        ) : null
                                      ))}
                                    </div>
                                  ));
                                })()
                              ) : (
                                (() => {
                                  const achievements = achiever.achievements[selectedCategory] || [];
                                  const rows = [];
                                  for (let i = 0; i < achievements.length; i += 3) {
                                    rows.push(achievements.slice(i, i + 3));
                                  }
                                  return rows.map((row, rowIdx) => (
                                    <div key={rowIdx} className="flex flex-row items-stretch gap-0">
                                      {row.map((achievement, i) => (
                                        achievement ? (
                                          <React.Fragment key={i}>
                                            <div className="flex-1 flex flex-col min-w-0 px-2">
                                              <span className="font-semibold text-green-500 text-sm break-words">{achievement.title}</span>
                                              <span className="text-gray-400 text-sm mt-1 break-words whitespace-pre-line">{achievement.description}</span>
                                            </div>
                                            {i < row.length - 1 && (
                                              <div className="flex items-stretch justify-center">
                                                <div className="w-px h-full bg-gray-600 mx-2" style={{ minHeight: '40px' }} />
                                              </div>
                                            )}
                                          </React.Fragment>
                                        ) : null
                                      ))}
                                    </div>
                                  ));
                                })()
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>

          {isLoggedIn && (
            <div className="text-center my-12 space-y-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white py-2 px-6 rounded-full font-bold mx-2"
              >
                Add Achievements
              </button>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="bg-yellow-500 text-white py-2 px-6 rounded-full font-bold mx-2"
              >
                Edit Achievements
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="bg-red-600 text-white py-2 px-6 rounded-full font-bold mx-2"
              >
                Delete Achievement
              </button>
            </div>
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-gradient-to-br from-gray-900 to-black text-white p-8 rounded-xl w-full max-w-md 
                            border border-gray-800 shadow-2xl">
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
                      id="email"
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
                      id="name"
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
                      type="text"
                      name="batch"
                      id="batch"
                      value={newAchievement.batch || ""}
                      onChange={(e) =>
                        setNewAchievement((prev) => ({
                          ...prev,
                          batch: e.target.value,
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
                      id="portfolio"
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
                    <label className="block mb-2">Select an image:</label>
                    <input
                      type="file"
                      name="image"
                      id="image"
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
                    <label className="block mb-2">Achievements by Category:</label>
                    {Object.entries(newAchievement.achievements || {}).map(([category, achievements = []]) => (
                      <div key={category} className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">{category}</h3>
                        {achievements.map((achievement, index) => (
                          <div key={index} className="mb-4 p-4 bg-gray-800 rounded">
                            <input
                              type="text"
                              value={achievement.title}
                              onChange={(e) => handleChangeAchievement(category, index, 'title', e.target.value)}
                              className="w-full p-2 mb-2 bg-gray-700 rounded"
                              placeholder="Achievement Title"
                            />
                            <textarea
                              value={achievement.description}
                              onChange={(e) => handleChangeAchievement(category, index, 'description', e.target.value)}
                              className="w-full p-2 mb-2 bg-gray-700 rounded"
                              placeholder="Achievement Description"
                            />
                            <input
                              type="number"
                              value={achievement.stipend || ''}
                              onChange={(e) => handleChangeAchievement(category, index, 'stipend', e.target.value ? Number(e.target.value) : null)}
                              className="w-full p-2 mb-2 bg-gray-700 rounded"
                              placeholder="Stipend Amount (optional)"
                            />
                            <input
                              type="number"
                              value={achievement.year}
                              onChange={(e) => handleChangeAchievement(category, index, 'year', Number(e.target.value))}
                              className="w-full p-2 bg-gray-700 rounded"
                              placeholder="Year"
                            />
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => handleAddAchievement(category)}
                          className="bg-gray-600 text-white py-2 px-4 rounded"
                        >
                          Add More to {category}
                        </button>
                      </div>
                    ))}
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          const category = prompt("Enter category name (e.g., GSoC, Hackathon, CP):");
                          if (category) {
                            handleAddAchievement(category);
                          }
                        }}
                        className="bg-blue-600 text-white py-2 px-4 rounded"
                      >
                        Add New Category
                      </button>
                    </div>
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

          {isEditModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
              <div className="bg-black text-white p-8 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Edit Achievements</h2>
                <form
                  className="space-y-6 overflow-y-auto max-h-[50vh] mb-4"
                  onSubmit={handleFetch}
                >
                  <div className="mb-4">
                    <label className="block mb-2">Email:</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full p-3 bg-gray-800 rounded"
                      placeholder="Enter Email"
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

                {Object.keys(editAchievements.achievements || {}).length > 0 && (
                  <form
                    className="space-y-6 overflow-y-auto max-h-[50vh]"
                    onSubmit={handleEditSubmit}
                  >
                    <div className="mb-4">
                      <label className="block mb-2">Achievements by Category:</label>
                      {Object.entries(editAchievements.achievements || {}).map(([category, achievements = []]) => (
                        <div key={category} className="mb-4">
                          <h3 className="text-lg font-semibold mb-2">{category}</h3>
                          {achievements.map((achievement, index) => (
                            <div key={index} className="mb-4 p-4 bg-gray-800 rounded">
                              <input
                                type="text"
                                value={achievement.title}
                                onChange={(e) => handleEditChangeAchievement(category, index, 'title', e.target.value)}
                                className="w-full p-2 mb-2 bg-gray-700 rounded"
                                placeholder="Achievement Title"
                              />
                              <textarea
                                value={achievement.description}
                                onChange={(e) => handleEditChangeAchievement(category, index, 'description', e.target.value)}
                                className="w-full p-2 mb-2 bg-gray-700 rounded"
                                placeholder="Achievement Description"
                              />
                              <input
                                type="number"
                                value={achievement.stipend || ''}
                                onChange={(e) => handleEditChangeAchievement(category, index, 'stipend', e.target.value ? Number(e.target.value) : null)}
                                className="w-full p-2 mb-2 bg-gray-700 rounded"
                                placeholder="Stipend Amount (optional)"
                              />
                              <input
                                type="number"
                                value={achievement.year}
                                onChange={(e) => handleEditChangeAchievement(category, index, 'year', Number(e.target.value))}
                                className="w-full p-2 bg-gray-700 rounded"
                                placeholder="Year"
                              />
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleEditAddAchievement(category)}
                            className="bg-gray-600 text-white py-2 px-4 rounded"
                          >
                            Add More to {category}
                          </button>
                        </div>
                      ))}
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => {
                            const category = prompt("Enter category name (e.g., GSoC, Hackathon, CP):");
                            if (category) {
                              handleEditAddAchievement(category);
                            }
                          }}
                          className="bg-blue-600 text-white py-2 px-4 rounded"
                        >
                          Add New Category
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-4">
                      <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded"
                      >
                        Update
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

          {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
              <div className="bg-black text-white p-8 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Delete Achievement</h2>
                <form
                  className="space-y-6"
                  onSubmit={handleDeleteSubmit}
                >
                  <div className="mb-4">
                    <label className="block mb-2">
                      Enter email to confirm deletion:
                    </label>
                    <input
                      type="email"
                      value={deleteConfirmEmail}
                      onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                      className="w-full p-3 bg-gray-800 rounded"
                      placeholder="Enter email to delete"
                    />
                  </div>
                  <div className="p-4 bg-red-900 bg-opacity-50 rounded-md mb-4">
                    <p className="text-red-300">
                      Warning: This action cannot be undone. This will permanently delete the achievement record.
                    </p>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button
                      type="submit"
                      className="bg-red-600 text-white py-2 px-4 rounded"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="bg-gray-500 text-white py-2 px-4 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}