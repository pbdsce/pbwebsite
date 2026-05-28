import type { Metadata } from "next";
import Events from "@/components/events/Events";
import ReviewMarquee from "@/components/events/ReviewMarquee";
import { getAllEvents } from "@/lib/server/events";
import connectDB from "@/lib/db/connection";

export const metadata: Metadata = {
  title: "Events",
};

export default async function EventsPage() {
  await connectDB();
  const rawEvents = await getAllEvents();
  const events = JSON.parse(JSON.stringify(rawEvents));

  return (
    <>
      <section className="relative overflow-hidden text-white flex items-center justify-center px-4 sm:px-10 lg:px-20">
        <div className="relative z-10 flex flex-col items-center justify-center pt-24 max-w-8xl mx-auto w-full">
          <h1 className="text-center text-white tracking-tight text-5xl md:text-6xl lg:text-7xl font-normal leading-tight md:leading-snug">
            Events
          </h1>
        </div>
      </section>
      <Events events={events} />
      <div className="text-white py-14 overflow-hidden">
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-normal leading-tight md:leading-snug text-white mb-8 text-center px-6">
          Events experience
        </h2>
        <ReviewMarquee />
      </div>
    </>
  );
}
