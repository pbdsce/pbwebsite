'use client';
import { cn } from "@/lib/server/utils";
import HyperText from "./magicui/hyper-text";
import Image from "next/image";
import { motion } from "framer-motion";
import Carousel from "@/components/carousel.component";

interface ActivityCardProps {
    LeftAligned: boolean;
    Title: string;
    Subtitle: string | React.ReactNode;
    Description: string;
    ImageSrc: string[];
}

export default function ActivityCard({...props}: ActivityCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={cn(
                "flex flex-col-reverse pt-44 md:flex-row gap-4 h-full px-4 sm:px-8 md:px-24 text-center",
                !props.LeftAligned ? "md:text-left" : "md:text-right",
                props.LeftAligned ? "" : "md:flex-row-reverse",
            )}

        >
            <div className="highlight flex-6">
                <div className="flex flex-col p-4 md:p-24 justify-center content-center bg-black-800">
                    <div
                        className={cn(
                            "mx-auto",
                            !props.LeftAligned ? "md:mr-auto md:ml-0" : "md:ml-auto md:mr-0"
                        )}
                    >
                        <HyperText
                            className={cn("text-4xl sm:text-7xl font-bold text-green-500 sm:mb-5")}
                            duration={200}
                            text={props.Title}
                        />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 -mt-2 sm:-mt-4 px-0">
                        {props.Subtitle}
                    </h2>
                    <p className="text-base sm:text-lg px-0 text-gray-300">
                        {props.Description}
                    </p>
                </div>
            </div>

            <div className="highlight flex-6 my-auto px-4 sm:px-8">
                <div className="highlight w-full h-64 sm:w-96 sm:h-96 flex items-center justify-center bg-black-900">
                    <Carousel 
                        slides={props.ImageSrc}
                        useScrollHoverEffects={true}
                        className="ActivityCard"
                    />
                </div>
            </div>
        </motion.div>
    );
}