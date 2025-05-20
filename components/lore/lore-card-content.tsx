import React from 'react';
import { motion } from 'framer-motion';

interface LoreContentProps {
    story: string[];
  }

export default function LoreContent({ story }: LoreContentProps) {

    const variants = {
        hidden: { opacity: 0 },
        show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.3
        }
        }
    };

    return (
        <motion.div 
        className="space-y-6"
        variants={variants}
        initial="hidden"
        animate="show"
        >
        {story.map((paragraph, index) => (
            <motion.p 
            key={index} 
            className="text-lg text-gray-300 leading-relaxed first-letter:text-3xl first-letter:font-bold first-letter:text-[#00c853] first-letter:mr-1 first-letter:float-left"
            variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
            >
            {paragraph}
            </motion.p>
        ))}
        </motion.div>
    );
};