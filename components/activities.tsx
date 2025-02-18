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
    Image: ["/images/cp.jpeg", "/images/pbhustle1.jpg", "/images/pbhustle2.jpg"],
    Description:
      "Point Blank has organized over 40+ editions of its PB Hustle coding contest, where participants solve 5-7 increasingly difficult problems in their preferred programming language. The contest aims to enhance the programming culture in colleges and help teams qualify for the ACM ICPC. Impressively, DSCE's leading programmers have risen through this platform, with participation in the CodeChef Long Challenge expanding from just 3 to over 70+ participants.",
  },
  {
    Title: "Development",
    Subtitle: "PB Chronicles",
    Image: ["/images/dev.jpg", "/images/dev1.jpg", "/images/dev2.jpg"],
    Description:
      "Point Blank has hosted over 100+ workshops, covering a wide range of topics including open source, DevOps, machine learning, placement preparation, data structures and algorithms, and mobile and web development, among others. These workshops are typically conducted in an informal and unscripted manner, though we do document some of our most significant sessions. One notable example is our primer on F/OSS development.",
  },
  {
    Title: "Hackathons",
    Subtitle: "Smart India Hackathon",
    Image: ["/images/hack.jpg", "/images/SIH_2024.png", "/images/SIH.jpg"],
    Description:
      "Each year, we organize the internal round of the Smart India Hackathon. In the 2020 edition, over 300+ individuals from DSCE participated. Two of our teams advanced to the finals, with one emerging as the winner of the software edition. Along with this, teams from Point Blank have won hackathons all across the city and country.",
  },
  {
    Title: "Cybersecurity",
    Subtitle: "PB CTF",
    Image: ["/images/ctf4.jpg", "/images/ctf1.jpg", "/images/ctf2.jpg", "/images/ctf3.jpg"],
    Description:
      "We organize workshops and sessions on various topics in cybersecurity, including hands-on practice on different platforms. In 2023, we launched the first in-house Capture The Flag event, PBCTF, which attracted over 70+ participants.",
  },
];

export default function Activities() {
  return (
    <>
      <div className="flex flex-col items-center font-bold pt-20 pb-10">
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
