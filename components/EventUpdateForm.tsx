import { useState } from "react";
import { useStore } from "@/lib/zustand/store";
import { apiFetch } from "@/lib/apiFetch";

interface EventUpdateFormProps {
  eventId: string;
  initialEventData: {
    id: string;
    eventName: string;
    description: string;
    eventDate: string;
    lastDateOfRegistration: string;
    dateCreated: string;
    dateModified: string;
    imageURL: string;
    registrationLink: string;
  };
  refreshEvents?: () => Promise<void>; // Optional refresh function
}

const EventUpdateForm = ({
  eventId,
  initialEventData,
  refreshEvents, // Destructure the prop
}: EventUpdateFormProps) => {
  const [eventName, setEventName] = useState(initialEventData.eventName);
  const [eventDate, setEventDate] = useState(initialEventData.eventDate);
  const [lastDateOfRegistration, setLastDateOfRegistration] = useState(
    initialEventData.lastDateOfRegistration
  );
  const [description, setDescription] = useState(initialEventData.description);
  const [imageURL, setImageURL] = useState(initialEventData.imageURL);
  const [registrationLink, setRegistrationLink] = useState(
    initialEventData.registrationLink
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const { setImage } = useStore();

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", eventName || 'event-' + Date.now());
    // Add the existing image URL to handle cleanup
    if (imageURL) {
      formData.append("existingUrl", imageURL);
    }
  
    const response = await apiFetch("/api/events/upload", {
      method: "POST",
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error("Failed to upload image");
    }
  
    const data = await response.json();
    return data.imageUrl;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImage(file);
      
      try {
        setUploading(true);
        const cloudinaryUrl = await uploadImage(file);
        setImageURL(cloudinaryUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        setError("Failed to upload image. Please try again.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) {
      setError("Please wait for the image to finish uploading.");
      return;
    }

    try {
      const response = await apiFetch(`/api/events/?eventid=${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          eventName,
          eventDate,
          lastDateOfRegistration,
          description,
          imageURL,
          registrationLink,
        }),
      });

      if (response.ok) {
        alert("Event updated successfully!");
        if (refreshEvents) {
          await refreshEvents(); // Refresh events if the function is provided
        }
      } else {
        setError("Failed to update event.");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      setError("An error occurred while updating the event.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      <div className="w-full max-w-md bg-black border border-green-600 p-8 rounded-xl shadow-2xl shadow-green-500/50">
        <div className="text-3xl font-bold text-center mb-10 text-white">
          Update Event
        </div>
        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Event Name */}
          <div className="relative mb-4">
            <input
              type="text"
              id="eventName"
              placeholder=" "
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="peer w-full bg-transparent border-0 border-b-2 border-green-500 text-white placeholder-transparent focus:border-green-400 focus:outline-none focus:ring-0 pt-2 text-base"
              required
            />
            <label
              htmlFor="eventName"
              className="absolute left-0 top-0 text-sm text-white transition-all duration-300 transform -translate-y-4 scale-75 origin-left cursor-text peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75"
            >
              Event Name
            </label>
          </div>

          {/* Event Date */}
          <div className="relative mb-4">
            <input
              type="date"
              id="eventDate"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="peer w-full bg-transparent border-0 border-b-2 border-green-500 text-white placeholder-transparent focus:border-green-400 focus:outline-none focus:ring-0 pt-2 cursor-pointer text-base"
              required
            />
            <label
              htmlFor="eventDate"
              className="absolute left-0 top-0 text-sm text-white transition-all duration-300 transform -translate-y-4 scale-75 origin-left cursor-text peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75"
            >
              Event Date
            </label>
          </div>

          {/* Last Date of Registration */}
          <div className="relative mb-4">
            <input
              type="date"
              id="lastDateOfRegistration"
              value={lastDateOfRegistration}
              onChange={(e) => setLastDateOfRegistration(e.target.value)}
              className="peer w-full bg-transparent border-0 border-b-2 border-green-500 text-white placeholder-transparent focus:border-green-400 focus:outline-none focus:ring-0 pt-2 cursor-pointer text-base"
              required
            />
            <label
              htmlFor="lastDateOfRegistration"
              className="absolute left-0 top-0 text-sm text-white transition-all duration-300 transform -translate-y-4 scale-75 origin-left cursor-text peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75"
            >
              Last Date of Registration
            </label>
          </div>

          {/* Description */}
          <div className="relative mb-4">
            <textarea
              id="description"
              placeholder=" "
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="peer w-full bg-transparent border-0 border-b-2 border-green-500 text-white placeholder-transparent focus:border-green-400 focus:outline-none focus:ring-0 pt-2 min-h-[100px] text-base"
              required
            ></textarea>
            <label
              htmlFor="description"
              className="absolute left-0 top-0 text-sm text-white transition-all duration-300 transform -translate-y-4 scale-75 origin-left cursor-text peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75"
            >
              Description
            </label>
          </div>

          {/* Image Upload */}
          <div className="relative mb-4">
            <div className="flex items-center justify-between">
              <label 
                htmlFor="image" 
                className="text-sm cursor-pointer bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md transition-colors text-white"
              >
                Choose Event Image
              </label>
              <input
                type="file"
                id="image"
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
                disabled={uploading}
              />
              {imageURL && !uploading && (
                <span className="text-sm text-green-400 ml-4 truncate max-w-[200px]">
                  {imageURL.split('/').pop()}
                </span>
              )}
            </div>
            {uploading && (
              <p className="text-sm text-green-500 mt-2">Uploading image...</p>
            )}
            {imageURL && !uploading && (
              <img 
                src={imageURL} 
                alt="Event preview" 
                className="mt-4 max-w-full h-40 object-contain rounded"
              />
            )}
          </div>

          {/* Registration Link */}
          <div className="relative mb-4">
            <input
              type="url"
              id="registrationLink"
              placeholder=" "
              value={registrationLink}
              onChange={(e) => setRegistrationLink(e.target.value)}
              className="peer w-full bg-transparent border-0 border-b-2 border-green-500 text-white placeholder-transparent focus:border-green-400 focus:outline-none focus:ring-0 pt-2 text-base"
              required
            />
            <label
              htmlFor="registrationLink"
              className="absolute left-0 top-0 text-sm text-white transition-all duration-300 transform -translate-y-4 scale-75 origin-left cursor-text peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75"
            >
              Registration Link
            </label>
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-green-600 text-white rounded-md hover:bg-green-500 transition-colors mt-6 text-base font-semibold"
          >
            Update Event
          </button>

          {error && <p className="text-sm text-red-500 text-center mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default EventUpdateForm;
