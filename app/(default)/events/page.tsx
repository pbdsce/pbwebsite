"use client";

import { useState, useEffect } from "react";
import { auth } from "../../../Firebase"; // Firebase setup
import { onAuthStateChanged } from "firebase/auth";
import EventForm from "../../../components/EventForm";
import EventUpdateForm from "../../../components/EventUpdateForm";
import EventCard from "../../../components/EventCard"; // Import new EventCard component
import Sidebar from "../../../components/Sidebar"; // Import Sidebar component

const EventsPage = () => {
  const [showForm, setShowForm] = useState(false); // For toggling form visibility
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
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

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

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
  } | null>(null); // For sidebar details

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Track sidebar state

  useEffect(() => {
    const checkAdmin = async (uid: string) => {
      try {
        const response = await fetch(`/api/check-admin?uid=${uid}`);
        const { isAdmin } = await response.json();
        setIsAdminLoggedIn(isAdmin);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdminLoggedIn(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        checkAdmin(user.uid);
      } else {
        setIsAdminLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetching events through the backend
  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      const { events } = await response.json();
      setEvents(events);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Deleting an event through the backend
  const deleteEvent = async (eventId: string) => {
    try {
      await fetch(`/api/events?eventid=${eventId}`, {
        method: "DELETE",
      });
      fetchEvents(); // Refresh event list
    } catch (error) {
      console.error("Error deleting event:", error);
    }
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
    registrationLink: string;
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
  const futureEvents = events.filter(
    (event) => new Date(event.eventDate) >= today
  );

  return (
    <div className="p-4 pt-20 relative">
      <h1 className="text-5xl font-bold mb-2 pl-5 pt-2 text-center">Events</h1>
      <div className="flex justify-end">
        {isAdminLoggedIn && (
          <button
            onClick={() => setShowForm(!showForm)} // Toggles the form visibility
            className="bg-blue-600 text-white py-2 px-4 rounded-md mb-4"
          >
            Add Event
          </button>
        )}
      </div>

      {/* Event Form to Add New Event */}
      {isAdminLoggedIn && showForm && <EventForm refreshEvents={fetchEvents} />}

      {/* Displaying the Events */}
      <div className="mt-2">
        {futureEvents.length > 0 && (
          <div className="flex justify-around">
            {futureEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isAdminLoggedIn={isAdminLoggedIn}
                onDelete={deleteEvent}
                onSelect={handleEventSelect}
              />
            ))}
          </div>
        )}
      </div>

      {/* Past Events */}
      <h2 className="text-3xl font-bold mb-8 mt-16 ml-4 text-center">Past Events</h2>
      {pastEvents.length > 0 ? (
        <div className="flex flex-wrap justify-evenly gap-3">
          {pastEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isAdminLoggedIn={isAdminLoggedIn}
              onDelete={deleteEvent}
              onSelect={handleEventSelect} // Pass handleEventSelect to open sidebar
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
      {isAdminLoggedIn && selectedEvent && (
        <div className="mt-8 z-50">
          <h2 className="text-2xl font-bold mb-4">Update Event</h2>
          <EventUpdateForm
            eventId={selectedEvent.id}
            initialEventData={selectedEvent}
            refreshEvents={fetchEvents}
          />
        </div>
      )}
    </div>
  );
};

export default EventsPage;
