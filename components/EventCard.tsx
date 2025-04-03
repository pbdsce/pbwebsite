import { convertToWebP } from "@/utils/webpImages";
import Image from "next/image";

interface EventCardProps {
  event: {
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
  isLoggedInLoggedIn: boolean;
  onDelete: (eventId: string) => void;
  onSelect: (event: {
    id: string;
    eventName: string;
    description: string;
    eventDate: string;
    lastDateOfRegistration: string;
    dateCreated: string;
    dateModified: string;
    imageURL: string;
    registrationLink: string;
  }) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  isLoggedInLoggedIn,
  onDelete,
  onSelect,
}) => {
  // Extracting the day and month from the eventDate string
  const eventDate = new Date(event.eventDate);
  const day = eventDate.toLocaleString("en-US", { day: "2-digit" });
  const month = eventDate.toLocaleString("en-US", { month: "short" });

  return (
    <div
      className="relative bg-gray-800 shadow-lg rounded-2xl overflow-hidden transition duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer w-full sm:w-[48%] lg:w-[30%] mb-6"
      onClick={() => onSelect(event)}
    >
      {/* Event Image */}
      <div className="relative">
        <Image
          src={convertToWebP(event.imageURL)}
          alt={event.eventName}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        {/* Event Date Badge */}
        <div className="absolute top-4 left-4 bg-blue-600 text-white py-1 px-3 rounded-xl text-center shadow-md">
          <p className="text-lg font-bold">{day}</p>
          <p className="text-sm uppercase tracking-wide">{month}</p>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white truncate">
          {event.eventName}
        </h3>
        <p className="text-gray-400 text-sm mt-2 line-clamp-2">
          {event.description}
        </p>

        {/* Admin Options */}
        {isLoggedInLoggedIn && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(event);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300"
            >
              Update
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(event.id);
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
