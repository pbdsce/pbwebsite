
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

function CompanyLogo({ src, name, sizeClass = 'w-24 h-24 sm:w-36 sm:h-36', width = 144, height = 144 }: CompanyLogoProps) {
	const [errored, setErrored] = React.useState(false);
	const initials = name
		.split(' ')
		.map((s: string) => s[0])
		.slice(0, 2)
		.join('')
		.toUpperCase();

	if (errored) {
		return (
			<div className={`${sizeClass} mx-auto flex items-center justify-center bg-gray-900 rounded-xl`}>
				<span className="text-lg sm:text-xl font-bold text-green-500">{initials}</span>
			</div>
		);
	}

	return (
		<Image
			className={`${sizeClass} mx-auto object-contain`}
			src={src}
			alt={name}
			width={width}
			height={height}
			onError={() => setErrored(true)}
		/>
	);
}

export default function Companies() {
	const companyData = [
		{
			url: '/images/companies/apple.png',
			name: 'Apple',
			description: 'Engineers and leaders judging hackathons and mentoring students.'
		},
		{
			url: '/images/companies/google.webp',
			name: 'Google',
			description: 'Support for events like "Code for Good" and student mentorship programs.'
		},
		{
			url: '/images/companies/amazon.png',
			name: 'Amazon',
			description: 'Participation in panel discussions and judging innovation challenges.'
		},
		{
			url: '/images/companies/microsoft.png',
			name: 'Microsoft',
			description: 'Engagement through "Code for Good" initiatives and technical mentorship.'
		},
		{
			url: '/images/companies/visa.png',
			name: 'Visa',
			description: 'Collaboration on "Code for Good" and industry-focused judging panels.'
		},
		{
			url: '/images/companies/amd.png',
			name: 'AMD',
			description: 'Sponsorship and support for large-scale student hackathons.'
		}
	];

	return (
		<section className="relative" data-aos="zoom-y-out" data-aos-delay="150">
			<div className="py-16 md:py-20">
				<div className="container mx-auto px-6 md:px-12 xl:px-32">
					<div className="mb-12 md:mb-16 text-center">
						<div className="font-bold pt-10 md:pt-20 pb-4">
							<h2 className="text-3xl sm:text-4xl text-center font-black">
								Our Partner Companies
							</h2>
						</div>
						<p className="text-gray-300 text-lg sm:text-xl lg:w-8/12 lg:mx-auto">
							We collaborate with leading companies to provide mentorship, internships and hiring opportunities for our members.
						</p>
					</div>

					<div className="flex flex-col md:flex-row flex-wrap gap-8 justify-center">
						{companyData.map((company, index) => (
								<div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-1 text-center space-y-4">
									<CompanyLogo src={company.url} name={company.name} sizeClass="w-24 h-24 sm:w-36 sm:h-36" width={144} height={144} />
								<div className="px-4">
									<h4 className="text-xl sm:text-2xl font-bold text-green-500">
										{company.name}
									</h4>
									<p className="text-gray-300 text-sm sm:text-base mt-2">
										{company.description}
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
