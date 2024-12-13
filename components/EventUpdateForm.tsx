import { useState } from "react";

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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/events/?eventid=${eventId}`, {
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
        alert("Failed to update event.");
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <form
      onSubmit={handleUpdate}
      className="max-w-lg mx-auto p-4 bg-white rounded shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">Update Event</h2>
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
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="registrationLink"
        >
          Registration Link
        </label>
        <input
          type="text"
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
        Update Event
      </button>
    </form>
  );
};

export default EventUpdateForm;
