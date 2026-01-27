"use client";

import Image from 'next/image';
import React from 'react';

interface CompanyLogoProps {
	src: string;
	name: string;
	sizeClass?: string;
	width?: number;
	height?: number;
}

function CompanyLogo({ 
	src, 
	name, 
	sizeClass = 'h-12 w-12 sm:h-16 sm:w-16', 
	width = 200, 
	height = 200 
}: CompanyLogoProps) {
	const [errored, setErrored] = React.useState(false);
	
	const initials = ((name || '')
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.map((part: string) => part[0] ?? '')
		.filter(Boolean)
		.slice(0, 2)
		.join('')
		.toUpperCase()) || '?';

	return (
		<div className="flex-shrink-0 flex items-center justify-center bg-gray-900/50 rounded-xl p-2 border border-gray-800">
			{errored ? (
				<div className={`${sizeClass} flex items-center justify-center`}>
					<span className="text-lg font-bold text-green-500">{initials}</span>
				</div>
			) : (
				<Image
					className={`${sizeClass} object-contain`}
					src={src}
					alt={`${name} logo`}
					width={width}
					height={height}
					priority
					onError={() => setErrored(true)}
				/>
			)}
		</div>
	);
}

export default function Companies() {
	const companyData = [
		{
			url: '/images/companies/apple.png',
			name: 'Apple',
			description: 'Supports the next generation of developers through the Swift Student Challenge and provides industry-leading engineers to judge hackathons and mentor students in app design and development.'
		},
		{
			url: '/images/companies/google.webp',
			name: 'Google',
			description: 'Drives innovation by sponsoring university challenges like the Amazon ML Challenge and providing resources for skill development, networking, and career readiness through programs like Amazon WoW.'
		},
		{
			url: '/images/companies/amazon.png',
			name: 'Amazon',
			description: 'Drives innovation by sponsoring university challenges like the Amazon ML Challenge and providing resources for skill development, networking, and career readiness through programs like Amazon WoW.'
		},
		{
			url: '/images/companies/microsoft.png',
			name: 'Microsoft',
			description: 'Engages with students via the Microsoft Imagine Cup and mentorship initiatives like Microsoft Engage, where seasoned software engineers guide students through building real-world technology solutions.'
		},
		{
			url: '/images/companies/visa.png',
			name: 'Visa',
			description: 'Collaborates on industry-focused hackathons and innovation panels, bringing expertise in fintech and secure global payments to help students solve complex real-world problems.'
		},
		{
			url: '/images/companies/amd.png',
			name: 'AMD',
			description: 'Sponsors large-scale student hackathons such as the AMD Ryzen Slingshot challenge, providing high-performance computing resources and technical mentorship for building AI-powered solutions.'
		}
	];

	return (
		<section className="relative py-16 md:py-20" data-aos="zoom-y-out" data-aos-delay="150">
			<div className="container mx-auto px-6 md:px-12 xl:px-32">
				<div className="mb-12 md:mb-16 text-center">
					<div className="font-bold pb-4">
						<h2 className="text-3xl sm:text-4xl font-black">
							Our Partner Companies
						</h2>
					</div>
					<p className="text-gray-400 text-lg sm:text-xl lg:w-8/12 lg:mx-auto">
						We collaborate with leading companies to provide mentorship, internships, and hiring opportunities for our members.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
					{companyData.map((company, index) => (
						<div 
							key={index} 
							className="flex flex-row items-center gap-6 p-5 rounded-2xl border border-gray-800/50 bg-gray-900/10 hover:bg-gray-900/30 transition-all duration-300"
						>
							<CompanyLogo src={company.url} name={company.name} />
							
							<div className="flex-1">
								<h4 className="text-xl font-bold text-green-500">
									{company.name}
								</h4>
								<p className="text-gray-400 text-sm sm:text-base mt-1 leading-relaxed">
									{company.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}