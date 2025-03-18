import { cn } from "@/lib/server/utils";
import Marquee from "@/components/magicui/marquee";
import Image from "next/image";

const domains = [
  {
    name: "ACM - ICPC",
    img: "https://icpc.global/regionals/abouticpc/foundationlogo.png",
  },
  {
    name: "Kaggle",
    img: "https://img.icons8.com/?size=100&id=Omk4fWoSmCHm&format=png&color=000000",
  },
  {
    name: "IOT-ML",
    img: "https://img.icons8.com/?size=100&id=Ih6zOUuHwOOs&format=png&color=000000",
  },
  {
    name: "ML-Research",
    img: "https://img.icons8.com/?size=100&id=114322&format=png&color=000000",
  },
  {
    name: "DevOps",
    img: "https://img.icons8.com/?size=100&id=13816&format=png&color=000000",
  },
  {
    name: "Flutter Development",
    img: "https://img.icons8.com/?size=100&id=7I3BjCqe9rjG&format=png&color=000000",
  },
  {
    name: "React Development",
    img: "https://img.icons8.com/?size=100&id=123603&format=png&color=000000",
  },
  {
    name: "Open Source Hackathon",
    img: "https://img.icons8.com/?size=100&id=63655&format=png&color=000000",
  },
  {
    name: "Interview Prep",
    img: "https://img.icons8.com/?size=100&id=13724&format=png&color=000000",
  },
];

const Card = ({ img, name }: { img: string; name: string }) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4 border-gray-50/[.1] bg-gray-50/[.10] hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <Image
          className="rounded-full"
          width="64"
          height="64"
          alt=""
          src={img}
        />
        <figcaption className="font-bold">{name}</figcaption>
      </div>
    </figure>
  );
};

export default function Domains() {
  return (
    <div className="relative">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-center text-gray-200 m-4">
        Domains we ❤️
      </h2>
      <p className="text-base sm:text-lg md:text-xl text-center text-gray-100 mb-6 sm:mb-8 px-2">
        Our club covers a wide range of interests and fields, bringing unique perspectives and expertise to every project!
      </p>

      <Marquee pauseOnHover className="[--duration:30s]">
        {domains.map((domain) => (
          <Card key={domain.name} {...domain} />
        ))}
      </Marquee>
    </div>
  );
}