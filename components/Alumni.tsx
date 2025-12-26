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

export default function Alumni() {
  const [alumni, setAlumni] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await fetch("/api/membersData");
        const data: Member[] = await res.json();

        setAlumni(
          data
            .filter((m) => m.year === "Alumni")
            .sort((a, b) => a.name.localeCompare(b.name))
        );
      } catch (error) {
        console.error("Failed to fetch alumni data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  if (loading) return <LoadingBrackets />;

  return (
    <section className="pt-28 px-6 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {alumni.map((profile) => (
          <Card
            key={profile.id ?? profile.name}
            name={profile.name}
            role={profile.role}
            company={profile.company || ""}
            linkedInUrl={profile.linkedInUrl}
            imageUrl={profile.imageUrl}
          />
        ))}
      </div>
    </section>
  );
}
