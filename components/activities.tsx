import { ReactNode } from "react";
import Image from "next/image";
import HyperText from "@/components/magicui/hyper-text";
import ActivityCard from "./ActivityCard";

interface ActivityCardProps {
  Title: string;
  Subtitle: string | ReactNode;
  Description: string;
  ImageSrc: string[];
  LeftAligned: boolean;
}

interface ActivityData {
  Title: string;
  Subtitle: string | ReactNode;
  Image: string[];  // Note this is Image, not ImageSrc
  Description: string;
}

const activityData: ActivityData[] = [
  {
    Title: "CP Contests",
    Subtitle: (
      <>
        <a
          href="/hustle"
          className=" hover:underline"
        >
          PB Hustle
        </a>
      </>
    ),
    Image: ["/images/cp.webp", "/images/pbhustle1.webp", "/images/pbhustle2.webp"],
    Description:
      "Since its inception in 2019, Point Blank has produced two Candidate Masters, one 6-star coder, and more than ten Experts. Within one year, participation in coding contests grew from just 3 to over 70. In 2020, we qualified the first-ever team from our college to ICPC Regionals and have sent at least one team every year since. Our members have earned multiple top-250 finishes in Google KickStart and reached Round 3 in Meta HackerCup. Additionally, to strengthen coding culture within our college, we organize PB Hustle, an open-to-all competitive programming contest held weekly, completing over 100 editions to date.",
  },
  {
    Title: "Development",
    Subtitle: "PB Chronicles",
    Image: ["/images/dev.webp", "/images/dev1.webp", "/images/dev2.webp"],
    Description:
      "Point Blank has hosted over 100+ workshops, covering a wide range of topics including open source, DevOps, machine learning, placement preparation, data structures and algorithms, and mobile and web development, among others. These workshops are typically conducted in an informal and unscripted manner, though we do document some of our most significant sessions. One notable example is our primer on F/OSS development.",
  },
  {
    Title: "Hackathons",
    Subtitle: "Smart India Hackathon",
    Image: ["/images/hack.webp", "/images/SIH_2024.webp", "/images/SIH.webp"],
    Description:
      "Each year, we organize the internal round of the Smart India Hackathon. In the 2024 edition, over 300+ individuals from DSCE participated, with four teams advancing to the national level and three reaching the finals. Since 2020, nine teams from DSCE have won SIH, with six of them being PB teams. Additionally, Point Blank teams have won hackathons across the city and country, including CentuRITon, Hackverse, and HackGlobal.",
  },
  {
    Title: "Open Source",
    Subtitle: "Google Summer of Code",
    Image: ["/images/gsocact.webp", "/images/LFX.webp", "/images/githubExtern.webp"],
    Description:
    " Point Blank has cultivated a vibrant open-source community, with our members achieving notable success in prestigious programs like Google Summer of Code (GSOC). In the past five years, we have had 20+ successful GSOC participants, 10+ Linux Foundation Training (LiFT) scholars, 3 LFX scholars, and 8 GitHub Externs.",
  },
  {
    Title: "Cybersecurity",
    Subtitle: "PB CTF",
    Image: ["/images/ctf4.webp", "/images/ctf1.webp", "/images/ctf2.webp", "/images/ctf3.webp"],
    Description:
      "We organize workshops and sessions on various topics in cybersecurity, including hands-on practice on different platforms. In 2023, we launched the first in-house Capture The Flag event, PBCTF, which attracted over 70+ participants.",
  },
];

export default function Activities() {
  return (
    <>
      <div className="flex flex-col items-center font-bold pt-56 pb-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl text-white text-center font-black mb-0">
          Activities
        </h2>
      </div>
      <div className="flex flex-col gap-12 md:gap-16">
        {activityData.map((value, index) => (
          <ActivityCard
            key={index}
            Title={value.Title}
            Subtitle={value.Subtitle}
            Description={value.Description}
            ImageSrc={value.Image}
            LeftAligned={index % 2 === 0}
          />
        ))}
      </div>
    </>
  );
}
