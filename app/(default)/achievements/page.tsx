"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Firebase";
import AchievementCard from "@/components/AchievementCard";
import { useStore} from "@/lib/zustand/store";
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
  const { isLoggedIn , setLoggedIn } = useStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editEmail, setEditEmail] = useState("");
  const [editAchievements, setEditAchievements] = useState<Partial<Achiever>>({
    achievements: [""],
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("");

  // Strict auth state change handler
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user : any) => {
      try {
        setLoggedIn(!!user);
      } catch (error) {
        console.error("Auth state change error:", error);
        toast.error("Authentication error occurred");
      }
    });

    return () => unsubscribe();
  }, [setLoggedIn]);

  // Strict achievements fetching with comprehensive error handling
  useEffect(() => {
    async function fetchAchievers() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/achievements");
        
        // Validate response
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data.data);
        
        // Ensure data is an array and validate each achiever
        // const validAchievers = (Array.isArray(data) ? data : [])
        
        setAchievers(data.data);
        
        // if (validAchievers.length === 0) {
        //   toast.success("No achievements found");
        // }
      } catch (error) {
        console.error("Error fetching achievements:", error);
        toast.error("Failed to fetch achievements");
        setAchievers([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAchievers();
  }, []);

  const handleAddAchievement = () => {
    setNewAchievement((prev) => ({
      ...prev,
      achievements: [...(prev.achievements || []), ""],
    }));
  };

  const handleChangeAchievement = (index: number, value: string) => {
    const updatedAchievements = [...(newAchievement.achievements || [])];
    updatedAchievements[index] = value;
    setNewAchievement((prev) => ({
      ...prev,
      achievements: updatedAchievements,
    }));
  };

  const handleEditAddAchievement = () => {
    setEditAchievements((prev) => ({
      ...prev,
      achievements: [...(prev.achievements || []), ""],
    }));
  };

  const handleEditChangeAchievement = (index: number, value: string) => {
    const updatedAchievements = [...(editAchievements.achievements || [])];
    updatedAchievements[index] = value;
    setEditAchievements((prev) => ({
      ...prev,
      achievements: updatedAchievements,
    }));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setEditEmail("");
    setDeleteConfirmEmail("");
    setEditAchievements({ achievements: [""] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['email', 'name', 'batch'];
    const missingFields = requiredFields.filter(field => 
      !newAchievement[field as keyof Achiever]
    );

    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Validate achievements
    if (!newAchievement.achievements || newAchievement.achievements.length === 0) {
      toast.error("Please add at least one achievement");
      return;
    }

    try {
      const formData = new FormData();
      
      // Strict null checks and type conversions
      formData.append("image", newAchievement.image || "");
      formData.append("email", newAchievement.email || "");
      formData.append("name", newAchievement.name || "");
      formData.append("batch", String(newAchievement.batch || ""));
      formData.append("portfolio", newAchievement.portfolio || "");
      formData.append("internship", newAchievement.internship || "No");
      formData.append("companyPosition", newAchievement.companyPosition || "");
      formData.append(
        "achievements", 
        JSON.stringify(
          (newAchievement.achievements || [])
            .filter(ach => ach && ach.trim() !== "")
        )
      );

      const response = await axios.post("/api/achievements", formData);
      
      // Validate response data
      if (response.data && response.data.data) {
        setAchievers(prev => [...prev, response.data.data]);
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

  // Strict edit fetch handler
  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editEmail || editEmail.trim() === "") {
      toast.error("Please enter an email");
      return;
    }

    try {
      const response = await axios.get(`/api/achievements?email=${encodeURIComponent(editEmail)}`);
      
      // The API returns { message, data } where data is the array of members
      if (!response.data.data || response.data.data.length === 0) {
        toast.error("No user found");
        return;
      }

      const user = response.data.data[0]; // Access the first item in the data array
      setEditAchievements({
        ...user,
        achievements: user.achievements || [""]
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to fetch user details");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedAchievements =
      editAchievements.achievements?.filter((ach) => ach.trim() !== "") || [];
    if (updatedAchievements.length === 0) {
      toast.error("Please add at least one achievement");
      return;
    }
    try {
      const formData = new FormData();
      
      // Always include email as the primary identifier
      formData.append("email", editEmail);

      // Include existing data for additional fields
      if (editAchievements.name) {
        formData.append("name", editAchievements.name);
      }
      if (editAchievements.batch) {
        formData.append("batch", String(editAchievements.batch));
      }
      if (editAchievements.portfolio) {
        formData.append("portfolio", editAchievements.portfolio);
      }
      if (editAchievements.internship) {
        formData.append("internship", editAchievements.internship);
      }
      if (editAchievements.companyPosition) {
        formData.append("companyPosition", editAchievements.companyPosition);
      }
      
      formData.append("achievements", JSON.stringify(updatedAchievements));
      
      // Only include the image if it's a new upload
      if (editAchievements.image instanceof File) {
        formData.append("image", editAchievements.image);
      }
  
      console.log("Submitting edit form...");
      const response = await axios.put("/api/achievements", formData);
      
      if (response.data && response.data.data) {
        // Update the achievers list with the edited data
        setAchievers(prev => 
          prev.map(achiever => 
            achiever.email === editEmail ? response.data.data : achiever
          )
        );
        setIsEditModalOpen(false);
        toast.success("Achievement updated successfully");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error updating achievements:", error);
      
      if (axios.isAxiosError(error) && error.response) {
        const errorDetails = error.response.data?.details || error.response.data?.error || error.message;
        toast.error(`Update failed: ${errorDetails}`);
      } else {
        toast.error("Failed to update achievement. Please try again.");
      }
    }
  };

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deleteConfirmEmail || deleteConfirmEmail.trim() === "") {
      toast.error("Please enter an email to confirm deletion");
      return;
    }

    try {
      const response = await axios.delete(`/api/achievements?email=${encodeURIComponent(deleteConfirmEmail)}`);
      
      if (response.data && response.data.message) {
        // Remove the deleted item from the achievements list
        setAchievers(prev => prev.filter(achiever => achiever.email !== deleteConfirmEmail));
        setIsDeleteModalOpen(false);
        setDeleteConfirmEmail("");
        toast.success("Achievement deleted successfully");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error deleting achievement:", error);
      
      if (axios.isAxiosError(error) && error.response) {
        const errorDetails = error.response.data?.details || error.response.data?.error || error.message;
        toast.error(`Deletion failed: ${errorDetails}`);
      } else {
        toast.error("Failed to delete achievement. Please try again.");
      }
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
          {[...Array(3)].map((_, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-y-5">
              {achievers
                .filter((_, index) => index % 3 === colIndex)
                .map((achiever) => (
                  <AchievementCard key={achiever.email} achiever={achiever} />
                ))}
            </div>
          ))}
        </div>
      )}

      {isLoggedIn ? (
        <div className="text-center my-8 space-y-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-black py-2 px-4 rounded shadow-lg mx-2"
          >
            Add Achievements
          </button>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="bg-white text-black py-2 px-4 rounded shadow-lg mx-2"
          >
            Edit Achievements
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="bg-red-500 text-white py-2 px-4 rounded shadow-lg mx-2"
          >
            Delete Achievement
          </button>
        </div>
      ) : null}

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
                  type="number"
                  name="batch"
                  id="batch"
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
                  id="companyPosition"
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
                <label className="block mb-2">Achievements:</label>
                {newAchievement.achievements?.map((achievement, index) => (
                  <div key={index} className="mb-2">
                    <input
                      type="text"
                      name="achievements"
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
                    id="companyPosition"
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
                  <label className="block mb-2">Update Image:</label>
                  {editAchievements.imageUrl && (
                    <div className="mb-2">
                      <img 
                        src={editAchievements.imageUrl} 
                        alt={editAchievements.name} 
                        className="w-20 h-20 object-cover rounded-full mb-2"
                      />
                      <p className="text-xs text-gray-400">Current image</p>
                    </div>
                  )}
                  <input
                    type="file"
                    name="image"
                    accept="image/jpeg, image/png, image/jpg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setEditAchievements((prev) => ({
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
                  {editAchievements.achievements?.map((achievement, index) => (
                    <div key={index} className="mb-2">
                      <input
                        type="text"
                        name="achievements"
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
  );
}
