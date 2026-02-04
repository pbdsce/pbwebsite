import Image from "next/image";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaClock,
  FaUserShield,
  FaAward,
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
      setIsVisible(false); 
      setTimeout(() => setIsVisible(true), 400); 
    }
  }, [event?.id]);

  if (!event) return null; // Return nothing if no event is selected

  return (
    <div
      className={`fixed top-0 right-0 w-96 h-full bg-gradient-to-b from-gray-900 via-gray-900 to-black shadow-xl z-50 overflow-y-auto 
        transition-transform duration-300 ease-in-out transform 
        ${isVisible ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="relative p-6 text-white">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-red-400 hover:text-red-300 focus:outline-none"
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Delay the onClose function to allow transition to complete
          }}
        >
          ✕
        </button>

        {/* Event Name */}
        <h3 className="text-2xl font-semibold mt-2 mb-4 flex items-center">
          <FaAward className="text-green-400 mr-2" /> {event.eventName}
        </h3>

        {/* Image */}
        {event.imageURL ? (
          <div className="mb-4 relative rounded-xl overflow-hidden shadow-[0_0px_12px_rgba(16,185,129,0.25)] border-[2px] border-[#10b98180]">
            <Image
              src={event.imageURL}
              alt={event.eventName}
              width={360}
              height={200}
              className="object-cover w-full h-full rounded-xl shadow-lg transition-transform duration-220 hover:scale-[103%] hover:rotate-[0.5deg]"
              priority={true}
            />          
          </div>
        ) : (
          <div className="bg-gray-700 h-48 mb-4 rounded-t-xl flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}

        {/* Event Details */}
        <div className="bg-[#0b0b0b] p-4 rounded-t-xl mb-4 shadow-md">
          <div className="flex items-center mb-3">
            <FaCalendarAlt className="text-blue-500 mr-2" />
            <p className="text-gray-300">Event Date: {event.eventDate}</p>
          </div>
          <div className="flex items-center mb-3">
            <FaClock className="text-yellow-500 mr-2" />
            <p className="text-gray-300">
              Last Registration Date: {event.lastDateOfRegistration}
            </p>
          </div>
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-green-400 mr-2" />
            <p className="text-gray-300">Location: Bengaluru, Karnataka</p>{" "}
            {/* Can adjust dynamically if available */}
          </div>
        </div>

        {/* Registration Section */}
          
          {event.lastDateOfRegistration >= currentDate && registrationLink && (
            <div className="bg-[#0b0b0b] p-4 rounded-lg mb-4 shadow-md">
              <a
                href={registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <button
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl transition duration-200 shadow-md"
                >
                  Register Now
                </button>
              </a>
            </div>
          )}

        {/* About Event */}
        <div className="bg-[#0b0b0b] p-4 rounded-b-xl shadow-md">
          <h4 className="text-lg font-semibold mb-2 text-green-400">
            About Event
          </h4>
          <p className="text-gray-500">{event.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
