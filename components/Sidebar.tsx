import Image from "next/image";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaClock,
  FaUserShield,
} from "react-icons/fa"; // Icons for various info
import { useState, useEffect } from "react";

interface SidebarProps {
  event: {
    id: string;
    eventName: string;
    description: string;
    eventDate: string;
    lastDateOfRegistration: string;
    dateCreated: string;
    dateModified: string;
    imageURL: string;
  } | null;
  onClose: () => void;
  registrationLink?: string; // Optionally pass a registration link
}

const Sidebar: React.FC<SidebarProps> = ({ event, onClose, registrationLink }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Get current date
  const currentDate = new Date().toISOString().split("T")[0];

  // Trigger sidebar to open with animation when event is passed
  useEffect(() => {
    if (event) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [event]);

  if (!event) return null; // Return nothing if no event is selected

  return (
    <div
      className={`fixed top-0 right-0 w-96 h-full bg-gray-900 shadow-xl z-50 overflow-y-auto 
        transition-transform duration-300 ease-in-out transform 
        ${isVisible ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="relative p-6 text-white">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none"
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Delay the onClose function to allow transition to complete
          }}
        >
          ✕
        </button>

        {/* Event Name */}
        <h3 className="text-2xl font-semibold mb-4 flex items-center">
          <FaCheckCircle className="text-green-400 mr-2" /> {event.eventName}
        </h3>

        {/* Image */}
        {event.imageURL ? (
          <div className="mb-4 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={event.imageURL}
              alt={event.eventName}
              width={360}
              height={200}
              className="object-cover rounded-lg"
              priority={true}
            />
          </div>
        ) : (
          <div className="bg-gray-700 h-48 mb-4 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}

        {/* Event Details */}
        <div className="bg-gray-800 p-4 rounded-lg mb-4 shadow-md">
          <div className="flex items-center mb-3">
            <FaCalendarAlt className="text-blue-500 mr-2" />
            <p className="text-gray-200">Event Date: {event.eventDate}</p>
          </div>
          <div className="flex items-center mb-3">
            <FaClock className="text-yellow-500 mr-2" />
            <p className="text-gray-200">
              Last Registration Date: {event.lastDateOfRegistration}
            </p>
          </div>
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-red-500 mr-2" />
            <p className="text-gray-200">Location: Bengaluru, Karnataka</p>{" "}
            {/* Can adjust dynamically if available */}
          </div>
        </div>

        {/* Registration Section */}
        <div className="bg-gray-800 p-4 rounded-lg mb-4 shadow-md">
          
          {event.lastDateOfRegistration >= currentDate && registrationLink && (
            <a
              href={registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200 shadow-md"
              >
                Register Now
              </button>
            </a>
          )}
        </div>

        {/* About Event */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold mb-2 text-gray-100">
            About Event
          </h4>
          <p className="text-gray-300">{event.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
