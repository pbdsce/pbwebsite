import Image from "next/image";
import FadeIn from "@/components/FadeIn";

import devopsIcon from "@/public/images/icons/devops.webp";
import iotIcon from "@/public/images/icons/iot.webp";
import kaggleIcon from "@/public/images/icons/kaggle.webp";
import aimlIcon from "@/public/images/icons/aiml.webp";
import opensourceIcon from "@/public/images/icons/opensource.webp";
import reactIcon from "@/public/images/icons/react.webp";
import acmIcon from "@/public/images/icons/acm-icpc.webp";
import flutterIcon from "@/public/images/icons/flutter.webp";
import androidIcon from "@/public/images/icons/android.webp";
import systemsIcon from "@/public/images/icons/systems.webp";
import hackathonIcon from "@/public/images/icons/hackathon.webp";
import cybersecurityIcon from "@/public/images/icons/Cybersecurity.webp";

const domains = [
  { name: "DevOps", icon: devopsIcon },
  { name: "IOT-Hardware", icon: iotIcon },
  { name: "Kaggle", icon: kaggleIcon },
  { name: "ML-Research", icon: aimlIcon },
  { name: "Open Source", icon: opensourceIcon },
  { name: "Web Development", icon: reactIcon },
  { name: "Competitive Programming", icon: acmIcon },
  { name: "App Development", icon: flutterIcon },
  { name: "AOSP", icon: androidIcon },
  { name: "Systems Engineering", icon: systemsIcon },
  { name: "Hackathon", icon: hackathonIcon },
  { name: "cybersecurity", icon: cybersecurityIcon },
];

export default function DomainsSection() {
  return (
    <section id="domains" className="text-white px-4 sm:px-10 lg:px-20">
      <FadeIn className="text-center mb-20">
        <h2 className="text-4xl font-bold text-pbgreen mb-3">
          Domains we Love
        </h2>
        <p className="text-white/70 text-sm">
          Our club covers a wide range of interests and fields, bringing unique perspectives and expertise to every project!
        </p>
      </FadeIn>

      <div className="relative max-w-8xl mx-auto rounded-3xl overflow-hidden">
        <Image
          width={224}
          className="absolute"
          height={213}
          src={"/top-left-dot.svg"}
          alt="dotted-BG"
        />
        <Image
          width={224}
          className="absolute right-0 bottom-0"
          height={213}
          src={"/right-bottom-dot.svg"}
          alt="dotted-BG"
        /> 

        <div className="bg-pbdarkgray p-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {domains.map(({ name, icon }, i) => (
              <FadeIn key={i} delay={(i % 4) * 0.1} className="flex">
                <div className="flex flex-col items-center justify-center py-8 px-6 gap-3 z-10 w-full bg-pbcard border-white/16 border rounded-2xl transition-all duration-300 hover:border-pbgreen">
                  <div className="w-17.5 h-17.5 rounded-full p-2 flex bg-[linear-gradient(180deg,rgba(55,255,0,0.05)_0%,rgba(55,255,0,0)_100%)]">
                    <div className="w-13.5 h-13.5 rounded-full p-3 flex items-center justify-center bg-[linear-gradient(180deg,rgba(55,255,0,0.1)_-66.22%,rgba(55,255,0,0)_85.46%)]">
                      <Image
                        src={icon}
                        alt={name}
                        className="w-7.5 h-7.5 object-contain rounded-full"
                      />
                    </div>
                  </div>
                  <span className="text-sm text-white text-center leading-tight">
                    {name}
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
