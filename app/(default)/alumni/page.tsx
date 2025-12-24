"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import LoadingBrackets from "@/components/ui/loading-brackets";

interface Member {
  id?: string;
  name: string;
  role: string;
  company?: string;
  year: string;
  linkedInUrl?: string;
  imageUrl?: string;
}

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await fetch("/api/membersData");
        const data: Member[] = await res.json();

        const alumniOnly = data
          .filter((member) => member.year === "Alumni")
          .sort((a, b) => a.name.localeCompare(b.name));

        setAlumni(alumniOnly);
      } catch (error) {
        console.error("Error fetching alumni:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  return (
    <main className="flex flex-col items-center mt-24 bg-black min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-10">Alumni</h1>

      {loading ? (
        <LoadingBrackets />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
          {alumni.map((profile) => (
            <Card
              key={profile.id}
              name={profile.name}
              role={profile.role}
              company={profile.company || ""}
              linkedInUrl={profile.linkedInUrl || ""}
              imageUrl={profile.imageUrl || ""}
            />
          ))}
        </div>
      )}
    </main>
  );
}
