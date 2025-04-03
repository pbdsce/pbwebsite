import React from "react";
import Image from "next/image";
import { convertToWebP } from "@/utils/webpImages";

const eventCard = [
  {
    id: 1,
    url: "/images/openday.jpg",
    textt: "Tech Open Day",
    textb:
      "Our first offline event of the year and it was a huge success✨Get to know about tech societies on campus and how to join them🚀",
  },
  {
    id: 2,
    url: "/images/advaith.jpg",
    textt: "Advaith",
    textb:
      "An event full of opportunities, challenges, learning and much more! Be a part of something big, be a part of ADVAITH!",
  },
  {
    id: 3,
    url: "/images/recruit.jpeg",
    textt: "Recruitment 2024",
    textb:
      "Recruitment 2024 is here! Join us and be a part of the Point Blank family!🚀",
  },
];

const EventComponent = () => {
  return (
    <>
      <div className="container place-items-center font-bold pt-20 pb-10">
        <h2 className="text-3xl sm:text-4xl text-white-800 text-center font-black">Events</h2>
        <h5 className="text-lg sm:text-xl text-white-800 text-center">
          We organise lots of student-centric activities
        </h5>
      </div>
      <div className="view">
        {eventCard.map((ec) => (
          <div key={ec.id} className="event-card">
            <div className="card">
              <div className="front">
                <Image
                  height={300}
                  width={300}
                  src={convertToWebP(ec.url)}
                  className="w-full h-full object-cover"
                  alt={ec.textt}
                />
              </div>
              <div className="back">
                <h2 className="text-xl font-semibold capitalize">{ec.textt}</h2>
                <p className="px-4 text-center text-gray-300">{ec.textb}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default EventComponent;