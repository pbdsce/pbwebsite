import type { Metadata } from "next";
import ReviewMarquee from "@/components/events/ReviewMarquee";
import { getAllEvents } from "@/lib/server/events";
import connectDB from "@/lib/db/connection";
import Events, { type Event } from "@/components/events/Events";

const PAGE_URL = "https://www.pointblank.club/events";
const PAGE_TITLE = "Events | Point Blank";
const PAGE_DESCRIPTION =
  "Discover upcoming and past events by Point Blank — workshops, hackathons, talks, and meetups for student developers and tech enthusiasts.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

export default async function EventsPage() {
  await connectDB();
  const rawEvents = await getAllEvents();
  const events: Event[] = JSON.parse(JSON.stringify(rawEvents));
  return (
    <>
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: events.slice(0, 10).map((event, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              item: {
                "@type": "Event",
                name: event.eventName,
                description: event.description,
                startDate: event.eventDate,
                organizer: {
                 "@type": "Organization",
                 name: "Point Blank",
                 url: "https://www.pointblank.club",
                },
              },
            })),
          }),
        }}
      />
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
