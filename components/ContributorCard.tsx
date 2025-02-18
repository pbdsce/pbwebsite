'use client'

import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faFacebookF,
	faLinkedinIn,
	faTwitter,
	faBehance,
} from "@fortawesome/free-brands-svg-icons";
import PropTypes from "prop-types";

const teamMembers = [
    {
        picture: "/images/Akash.jpg",
        fullName: "Akash Singh",
        designation: "Supervision, Deployment",
        bio: "Core contributor to Point Blank website",
        socialLinks: [
          { icon: faLinkedinIn, href: "https://www.linkedin.com/in/skysingh04?" }
        ]
      },
      {
        picture: "/images/Yash.jpg",
        fullName: "Yash Agrawal",
        designation: "Full Stack Developer",
        bio: "Made backend and frontend of leads page",
        socialLinks: [
          { icon: faLinkedinIn, href: "https://www.linkedin.com/in/2004-agarwal-yash/" }
        ]
      },
      {
        picture: "/images/Allfiya.jpg",
        fullName: "Alfiya Fatima",
        designation: "Full Stack Developer",
        bio: "Authentication, Pbctf registration form, Updates about latest event",
        socialLinks: [
          { icon: faLinkedinIn, href: "https://www.linkedin.com/in/alfiyafatima09/" }
        ]
      },
      {
        picture: "/images/soumya-p.jpg",
        fullName: "Soumya Pattnayak",
        designation: "Supervision",
        bio: "Core contributor to Point Blank website",
        socialLinks: [
          { icon: faLinkedinIn, href: "https://www.linkedin.com/in/soumya713/" }
        ]
        },
];

const TeamMemberItem = ({ member } : any) => (
	<motion.div
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.8 } }}
        whileHover={{ y: -20, scale:1.1 , transition: { delay: 0.2 } }}
        className="relative shadow-xl rounded-3xl bg-black dark:bg-black p-6 lg:p-8 overflow-hidden group"
    >
        <motion.div 
            className="absolute inset-0 bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-transparent to-green-500"
            animate={{
                rotate: [0, 360]
            }}
            transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
            }}
            style={{
                background: 'conic-gradient(from 0deg, green 0%, transparent 50%, green 100%)'
            }}
        />
        
        <div className="absolute inset-[2px] bg-black dark:bg-black rounded-3xl" />
        
        <div className="relative">
            <img
                src={member.picture}
                alt={member.fullName}
                className="max-w-full h-auto rounded-full p-1 mx-auto"
                width="120"
            />

            <div className="mt-6">
                <h4 className="text-2xl font-medium mb-1">{member.fullName}</h4>
                <p className="mb-4 text-sm">{member.designation}</p>
                <p className="opacity-50">{member.bio}</p>
                <div className="mt-6">
                    {member.socialLinks.map((item: { href: string; icon: any }, i: number) => (
                        <a
                            href={item.href}
                            className={`inline-block opacity-60 transition duration-300 hover:translate-y-1 hover:opacity-100 ${
                                i + 1 !== member.socialLinks.length ? "mr-4" : ""
                            }`}
                            key={i}
                        >
                            <FontAwesomeIcon icon={item.icon} />
                        </a>
                    ))}
                </div>
            </div>
        </div>
    </motion.div>
);

TeamMemberItem.propTypes = {
	member: PropTypes.object.isRequired,
};

const TeamMember9 = () => {
	return (
		<section className="ezy__team9 light py-14 md:pt-5 md:pb-14">
			<div className="container px-4 mx-auto">

				<div className="grid grid-cols-4 gap-6 text-center pt-6">
					{teamMembers.map((member, i) => (
						<div className="col-span-4 md:col-span-2 lg:col-span-1" key={i}>
							<TeamMemberItem member={member} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default TeamMember9;