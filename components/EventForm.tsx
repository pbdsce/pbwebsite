import { useState } from "react";

interface EventFormProps {
  refreshEvents?: () => Promise<void>; // Optional refresh function
}

const EventForm: React.FC<EventFormProps> = ({ refreshEvents }) => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [lastDateOfRegistration, setLastDateOfRegistration] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventName,
          eventDate,
          lastDateOfRegistration,
          description,
          imageURL,
          registrationLink,
        }),
      });

      alert("Event added successfully!");

      // Clear form fields after submission
      setEventName("");
      setEventDate("");
      setLastDateOfRegistration("");
      setDescription("");
      setImageURL("");
      setRegistrationLink("");

      // Refresh events if the function is provided
      if (refreshEvents) {
        await refreshEvents();
      }
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-4 bg-white rounded shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">Add New Event</h2>
      {/* Event Name */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="eventName"
        >
          Event Name
        </label>
        <input
          type="text"
          id="eventName"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="w-full px-3 py-2 border rounded text-black"
          required
        />
      </div>

      {/* Event Date */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="eventDate"
        >
          Event Date
        </label>
        <input
          type="date"
          id="eventDate"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="w-full px-3 py-2 border rounded text-black"
          required
        />
      </div>

      {/* Last Date of Registration */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="lastDateOfRegistration"
        >
          Last Date of Registration
        </label>
        <input
          type="date"
          id="lastDateOfRegistration"
          value={lastDateOfRegistration}
          onChange={(e) => setLastDateOfRegistration(e.target.value)}
          className="w-full px-3 py-2 border rounded text-black"
          required
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded text-black"
          required
        ></textarea>
      </div>

      {/* Image URL */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="imageURL"
        >
          Image URL
        </label>
        <input
          type="text"
          id="imageURL"
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
          className="w-full px-3 py-2 border rounded text-black"
          required
        />
      </div>

      {/* Registration Link */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="registrationLink"
        >
          Registration Link
        </label>
        <input
          type="url"
          id="registrationLink"
          value={registrationLink}
          onChange={(e) => setRegistrationLink(e.target.value)}
          className="w-full px-3 py-2 border rounded text-black"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700"
      >
        Add Event
      </button>
    </form>
  );
};

export default EventForm;
