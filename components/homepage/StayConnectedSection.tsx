"use client";

import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { Share2, NotebookText } from "lucide-react";
import { Bulb, GitHub, HireUs, YouTube } from "@/components/Icons";
import { track } from "@hellyeah/x-ray";

const DASHED_H =
  "bg-[repeating-linear-gradient(to_right,#262626_0px,#262626_8px,transparent_8px,transparent_20px)]";
const DASHED_V =
  "bg-[repeating-linear-gradient(to_bottom,#262626_0px,#262626_8px,transparent_8px,transparent_20px)]";

const CARD_BG =
  "bg-[linear-gradient(106.06deg,rgba(55,255,0,0.05)_-29.45%,rgba(55,255,0,0)_27.86%),linear-gradient(267.5deg,#1C1C1C_40.67%,#1C1C1C_99.81%)]";
const CARD_HOVER =
  "transition-colors duration-300 border border-transparent hover:border-pbgreen";
const ICON_OUTER =
  "w-18 h-18 shrink-0 rounded-full p-2 flex bg-[linear-gradient(180deg,rgba(202,255,51,0.05)_0%,rgba(202,255,51,0)_100%)]";
const ICON_INNER =
  "w-14 h-14 rounded-full p-4 flex items-center justify-center bg-[linear-gradient(180deg,rgba(55,255,0,0.1)_-66.22%,rgba(55,255,0,0)_85.46%)]";

function ConnectCard({
  href,
  icon: Icon,
  title,
  description,
  rounded,
  delay = 0,
  trackTarget,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  rounded: string;
  delay?: number;
  trackTarget?: string;
}) {
  return (
    <FadeIn delay={delay} className="flex-1 flex flex-col min-w-0">
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={
          trackTarget
            ? () =>
                track("outbound_link_clicked", {
                  target: trackTarget,
                  surface: "homepage_stay_connected",
                })
            : undefined
        }
        className={`relative z-10 flex flex-col items-center p-6 lg:p-10 gap-6 flex-1 cursor-pointer ${CARD_HOVER} ${CARD_BG} ${rounded}`}
      >
        <div className="flex items-center gap-3.5 w-full">
          <div className={ICON_OUTER}>
            <div className={ICON_INNER}>
              <Icon className="w-6 h-6 text-pbgreen" strokeWidth={1.5} />
            </div>
          </div>
          <h3 className="text-white text-xl font-normal leading-[150%] flex-1">
            {title}
          </h3>
        </div>
        <p className="text-pbtext text-sm font-light leading-[150%] text-center">
          {description}
        </p>
      </Link>
    </FadeIn>
  );
}

export default function StayConnectedSection() {
  return (
    <section
      id="stay-connected"
      className="text-white pt-20 pb-20 px-4 sm:px-10 lg:px-20"
    >
      <div className="max-w-8xl mx-auto">
        <FadeIn className="text-center mb-20">
          <h2 className="text-4xl font-bold text-white">
            Stay <span className="text-pbgreen">Connected</span>
          </h2>
        </FadeIn>

        <div className="relative flex flex-col p-4 lg:p-7">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.75"
              y="0.75"
              width="calc(100% - 1.5px)"
              height="calc(100% - 1.5px)"
              stroke="#262626"
              strokeWidth="1.5"
              strokeDasharray="8 12"
              strokeLinecap="butt"
            />
          </svg>

          {/* Row 1 */}
          <div className="flex flex-col lg:flex-row items-stretch">
            <ConnectCard
              href="https://careers.pointblank.club"
              icon={HireUs}
              title="Hire Us"
              description="Let's discuss how we can bring your ideas to life and help your business succeed with our expertise."
              rounded="rounded-tl-[40px] rounded-tr-[14px] rounded-br-[40px] rounded-bl-[14px]"
              trackTarget="careers"
            />

            <div className={`lg:hidden h-px w-full my-4 ${DASHED_H}`} />
            <div
              className={`hidden lg:block w-px mx-8 self-stretch shrink-0 ${DASHED_V}`}
            />

            <ConnectCard
              href="https://linktr.ee/pointblank_club"
              icon={Share2}
              title="Connect With Us"
              description="Follow us across all our social platforms to stay updated with events, releases and community highlights."
              rounded="rounded-[14px]"
              delay={0.1}
              trackTarget="linktree"
            />

            <div className={`lg:hidden h-px w-full my-4 ${DASHED_H}`} />
            <div
              className={`hidden lg:block w-px mx-8 self-stretch shrink-0 ${DASHED_V}`}
            />

            <ConnectCard
              href="https://blog.pointblank.club"
              icon={Bulb}
              title="Read Our Blog"
              description="Explore stories and experiences shared by our members on their tech journey and community adventures."
              rounded="rounded-tl-[14px] rounded-tr-[40px] rounded-br-[14px] rounded-bl-[40px]"
              delay={0.2}
              trackTarget="blog"
            />
          </div>

          <div className={`h-px w-full my-4 lg:my-8 shrink-0 ${DASHED_H}`} />

          {/* Row 2 */}
          <div className="flex flex-col lg:flex-row items-stretch">
            <ConnectCard
              href="/brochure.pdf"
              icon={NotebookText}
              title="Brochure"
              description="We have listed all of recent events, activities, and other stats in our brochure."
              rounded="rounded-tl-[14px] rounded-tr-[40px] rounded-br-[14px] rounded-bl-[40px]"
              delay={0.1}
            />

            <div className={`lg:hidden h-px w-full my-4 ${DASHED_H}`} />
            <div
              className={`hidden lg:block w-px mx-8 self-stretch shrink-0 ${DASHED_V}`}
            />

            <ConnectCard
              href="https://youtube.com/@pointblank_club"
              icon={YouTube}
              title="Join Us on YouTube"
              description="We upload event recaps, fun activities and vibes of mixtapes on YouTube. Check it out now!"
              rounded="rounded-[14px]"
              delay={0.2}
              trackTarget="youtube"
            />

            <div className={`lg:hidden h-px w-full my-4 ${DASHED_H}`} />
            <div
              className={`hidden lg:block w-px mx-8 self-stretch shrink-0 ${DASHED_V}`}
            />

            <ConnectCard
              href="https://github.com/pointblank-club"
              icon={GitHub}
              title="GitHub"
              description="Meet the amazing contributors who have helped shape this project with their dedication and hard work."
              rounded="rounded-tl-[40px] rounded-tr-[14px] rounded-br-[40px] rounded-bl-[14px]"
              delay={0.3}
              trackTarget="github"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
