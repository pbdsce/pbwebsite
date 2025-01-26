"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { PinContainer } from "@/app/(default)/Credits/creditcards/credits";
import { useRouter } from "next/navigation";

interface Contributor {
  _id: string;
  name: string;
  description: string;
  linkedinUrl: string;
  imageUrl: string;
}

export default function CreditComp() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await fetch("/api/credits");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setContributors(data.credits || []);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchContributors();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-100 mt-2 p-2">
          Website <span className="text-green-500">Contributors:</span>
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-[10px]">
        {!error &&
          contributors.slice(0, 3).map((contributor) => (
            <div className="relative" key={contributor._id}>
              <PinContainer
                title="Visit Linkedin"
                href={contributor.linkedinUrl}
                className=""
                containerClassName=""
              >
                <div className="flex flex-col p-4 tracking-tight text-slate-100/50 w-[20rem] h-[20rem] relative bg-gray-900 rounded-md">
                  <div className="relative h-full w-full">
                    <Image
                      src={contributor.imageUrl}
                      alt={contributor.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                    <div className="absolute bottom-0 left-0 w-full p-4 text-left bg-gradient-to-t from-black/60 to-transparent z-10">
                      <h3 className="font-bold text-base text-slate-100">
                        {contributor.name}
                      </h3>
                      <p className="text-base text-slate-300 mt-2">
                        {contributor.description}
                      </p>
                    </div>
                  </div>
                </div>
              </PinContainer>
            </div>
          ))}
      </div>
      <div className="w-full flex justify-center mt-10">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition"
          onClick={() => router.push("/Credits")}
        >
          More Contributors
        </button>
      </div>
    </div>
  );
}
