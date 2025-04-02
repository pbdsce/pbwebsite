import Image from 'next/image';
import React from 'react';

export default function Teams() {
  const teamData = [
    {
      url: '/images/founder1.webp',
      name: "Mohit Agarwal",
      description: "Mohit, SDE2 at Glance, is the driving force behind Point Blank's Competitive Programming culture. He has won several contests, including the Nokia Collegiate Code Rally, and qualified for ACM-ICPC Regionals."
    },
    {
      url: '/images/founder2.webp',
      name: "Soumya Pattanayak",
      description: "A top coder at DSCE, Soumya has worked at Amazon and Verse Innovation. He's an ACM-ICPC regionalist known for his problem-solving skills and innovative projects."
    },
    {
      url: '/images/founder3.webp',
      name: "Ashutosh Pandey",
      description: "Ashutosh, Compiler Engineer at AMD, excelled in Open Source and Hackathons. As a student, he did GSoC with Arduino, won the Smart India Hackathon, and mentored students for prestigious programs."
    }
  ];

  return (
    <section className="relative" data-aos="zoom-y-out" data-aos-delay="150">
      <div className="py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12 xl:px-32">
          <div className="mb-12 md:mb-16 text-center">
            <div className="font-bold pt-10 md:pt-20 pb-4">
              <h2 className="text-3xl sm:text-4xl text-center font-black">
                Our Founding Members
              </h2>
            </div>
            <p className="text-gray-300 text-lg sm:text-xl lg:w-8/12 lg:mx-auto">
              Point Blank started as a project by three friends who wanted to induce a change by providing a platform for like-minded, smart students to come together and learn from each other.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-16 md:gap-8 lg:gap-16">
            {teamData.map((member, index) => (
              <div key={index} className="flex-1 space-y-6 text-center">
                <Image
                  className="w-40 h-40 sm:w-64 sm:h-64 mx-auto object-cover rounded-xl"
                  src={member.url}
                  alt={member.name}
                  width="640"
                  height="805"
                />
                <div className="flex flex-col gap-2">
                  <h4 className="text-2xl sm:text-3xl font-bold text-green-500">
                    {member.name}
                  </h4>
                  <p className="text-gray-300 text-base sm:text-lg md:px-6 lg:px-10">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}