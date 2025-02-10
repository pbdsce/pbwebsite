"use client";

import { useState, useEffect } from "react";
import { auth } from "../../../Firebase"; 
import { onAuthStateChanged } from "firebase/auth";
import EventForm from "../../../components/EventForm";
import EventUpdateForm from "../../../components/EventUpdateForm";
import EventCard from "../../../components/EventCard";
import Sidebar from "../../../components/Sidebar"; 
import { useStore} from "@/lib/zustand/store";

const EventsPage = () => {
  const [showForm, setShowForm] = useState(false); 
  const { isAdmin , setAdmin } = useStore();
  const [events, setEvents] = useState<
    {
      id: string;
      eventName: string;
      description: string;
      eventDate: string;
      lastDateOfRegistration: string;
      dateCreated: string;
      dateModified: string;
      imageURL: string; 
      registrationLink: string;
    }[]
  >([]);

  const [selectedEvent, setSelectedEvent] = useState<{
    id: string;
    eventName: string;
    description: string;
    eventDate: string;
    lastDateOfRegistration: string;
    dateCreated: string;
    dateModified: string;
    imageURL: string;
    registrationLink: string;
  } | null>(null); 

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        try {
          const resp = await fetch(`/api/admin?uid=${uid}`);
          const data = await resp.json();
          if (data.isAdmin) {
            setAdmin(true);
          }
        } catch (error) {
          console.log("Error getting document:", error);
        }
      }
    });
  }, [isAdmin]);

  const fetchEvents = async () => {
    const resp = await fetch("/api/events"); 
    const data = await resp.json();
    const eventsList = data.events;
    setEvents(eventsList);
  };

  useEffect(() => {  
    fetchEvents();
  }, []);

  // Deleting an event
  const deleteEvent = async (eventId: string , event : any) => {
    try {
      await fetch(`/api/events/?eventid=${eventId}`, {
        method: "DELETE",
      });
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
    fetchEvents(); 
  };

  const handleEventSelect = (event: {
    id: string;
    eventName: string;
    description: string;
    eventDate: string;
    lastDateOfRegistration: string;
    dateCreated: string;
    dateModified: string;
    imageURL: string;
    registrationLink: string; // Ensure registrationLink is included
  }) => {
    setSelectedEvent(event);
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  // Dividing events into Past, Present, and Future based on eventDate
  const today = new Date();

  const pastEvents = events.filter(
    (event) => new Date(event.eventDate) < today
  );
  const presentEvents = events.filter(
    (event) => new Date(event.eventDate).toDateString() === today.toDateString()
  );
  const futureEvents = events.filter(
    (event) => new Date(event.eventDate) > today
  );

  return (
    <div className="p-4 pt-20 relative">
      <h1 className="text-5xl font-bold mb-2 pl-5 pt-2 text-center">Events</h1>
      <div className="flex justify-end">
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)} // Toggles the form visibility
            className="bg-blue-600 text-white py-2 px-4 rounded-md mb-4"
          >
            Add Event
          </button>
        )}
      </div>

      {/* Event Form to Add New Event */}
      {isAdmin && showForm && <EventForm />}

      {/* Displaying the Events */}
      <div className="mt-2">
        {/* Present Events */}
        

        {/* Future Events */}
        {/* <h2 className="text-2xl font-bold mb-4 mt-8">CurreEvents</h2> */}
        {futureEvents.length > 0 ? (
          <div className="sm:flex flex-wrap justify-around gap-4 px-4">
            {futureEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isAdminLoggedIn={isAdmin}
              onDelete={() => deleteEvent(event.id , event)} 
                onSelect={handleEventSelect}
              />
            ))}
          </div>
        ) : (
          <p>No presents events available.</p>
        )}
      </div>

      {/* Past Events */}
      <h2 className="text-3xl font-bold mb-8 mt-16 ml-4 text-center">Past Events</h2>
      {pastEvents.length > 0 ? (
        <div className="sm:flex flex-wrap justify-around gap-4 px-4">
          {pastEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isAdminLoggedIn={isAdmin}
              onDelete={() => deleteEvent(event.id , event)} 
              onSelect={handleEventSelect} 
            />
          ))}
        </div>
      ) : (
        <p>No past events available.</p>
      )}

      {/* Sidebar for Event Details */}
      {isSidebarOpen && selectedEvent && (
        <Sidebar
          event={selectedEvent}
          onClose={handleSidebarClose}
          registrationLink={selectedEvent.registrationLink} // Pass registrationLink explicitly
        />
      )}

      {/* Event Update Form */}
      {isAdmin && selectedEvent && (
        <div className="mt-8 z-50">
          <h2 className="text-2xl font-bold mb-4">Update Event</h2>
          <EventUpdateForm
            eventId={selectedEvent.id}
            initialEventData={selectedEvent}
          />
        </div>
      )}
    </div>
  );
};

export default EventsPage;
