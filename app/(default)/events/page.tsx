"use client";

import { useState, useEffect } from "react";
import { auth } from "../../../Firebase";
import { onAuthStateChanged } from "firebase/auth";
import EventForm from "../../../components/EventForm";
import EventUpdateForm from "../../../components/EventUpdateForm";
import EventCard from "../../../components/EventCard";
import Sidebar from "../../../components/Sidebar";
import { useStore } from "@/lib/zustand/store";
import LoadingBrackets from "@/components/ui/loading-brackets";

const EventsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const { isLoggedIn, setLoggedIn } = useStore();
  const [isLoading, setIsLoading] = useState(true);
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

  const fetchEvents = async () => {
    try{
      setIsLoading(true);
      const resp = await fetch("/api/events");
      const data = await resp.json();
      const eventsList = data.events;
      setEvents(eventsList);
    } catch (error) {
      console.error("Error fetching achievements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Deleting an event
  const deleteEvent = async (eventId: string, event: any) => {
    try {
      await fetch(`/api/events/?eventid=${eventId}`, {
        method: "DELETE",
      });
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
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
        {isLoggedIn && (
          <button
            onClick={() => setShowForm(!showForm)} // Toggles the form visibility
            className="bg-blue-600 text-white py-2 px-4 rounded-md mb-4">
            Add Event
          </button>
        )}
      </div>

      {/* Event Form to Add New Event */}
      {isLoggedIn && showForm && <EventForm />}

      {/* Displaying the Events */}
      {isLoading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <LoadingBrackets />
        </div>
      ) : (
        <div className="mt-2">
          {/* Future Events */}
          {futureEvents.length > 0 ? (
            <div className="sm:flex flex-wrap justify-around gap-4 px-4">
              {futureEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isLoggedInLoggedIn={isLoggedIn}
                  onDelete={() => deleteEvent(event.id, event)}
                  onSelect={handleEventSelect}
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center text-gray-700">
              <p className="text-xl font-bold">Stay Tuned for Upcoming Events!</p>
            </div>
          )}
        
          {/* Past Events */}
          <h2 className="text-3xl font-bold mb-8 mt-16 ml-4 text-center">
            Past Events
          </h2>
          {pastEvents.length > 0 ? (
            <div className="sm:flex flex-wrap justify-around gap-4 px-4">
              {pastEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isLoggedInLoggedIn={isLoggedIn}
                  onDelete={() => deleteEvent(event.id, event)}
                  onSelect={handleEventSelect}
                />
              ))}
            </div>
          ) : (
            <p>No past events available.</p>
          )}
        </div>
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
      {isLoggedIn && selectedEvent && (
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
