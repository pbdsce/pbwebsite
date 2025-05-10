import React from 'react';
import { Calendar, MapPin, ChevronUp, ChevronDown } from 'lucide-react';
import { Lore } from '@/components/lore/types/lore';
import { motion, AnimatePresence } from 'framer-motion';
// import Carousel from '../carousel.component';
import LoreContent from './lore-card-content';
import EmblaCarousel from '../ui/carousel/EmblaCarousel';

interface LoreCardProps {
  lore: Lore;
  isExpanded: boolean;
  onCardClick: () => void;
  index: number;
}


export default function LoreCard({
  lore: Lore,
  isExpanded,
  onCardClick: onCardClick,
  index
}: LoreCardProps ){
  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: index * 0.1
      }
    }
  };
  const expandvariants = {
    collapsed: { 
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
        opacity: { duration: 0.3 }
      }
    },
    expanded: { 
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.6, ease: [0.04, 0.62, 0.23, 0.98] },
        opacity: { duration: 0.4, delay: 0.2 }
      }
    }
  };

  return (
    <motion.div 
      className="relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-black to-gray-900/5 backdrop-blur-sm border border-gray-800 hover:border-[#00c853]/30 transition-all duration-500"
      variants={item}
      whileHover={{ 
        boxShadow: "0 0 20px 0 rgba(0, 200, 83, 0.2)"
      }}
    >
      <div 
        className="cursor-pointer"
        onClick={onCardClick}
      >
      <div className="flex flex-col md:flex-row gap-6 p-8">
        <div className="bg-black rounded-2xl shadow-lg overflow-hidden p-4 max-w-2xl mx-auto" onClick={(e)=> e.stopPropagation()}>

        <EmblaCarousel slides={Lore.images} options={{ loop: true }}/>
      </div>

          <div className="md:w-2/3">
            <h2 className="text-5xl font-bold mb-4 text-[#00c853] group">
              <span className="relative inline-block">
                {Lore.title}
              </span>
            </h2>
            <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{Lore.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{Lore.location}</span>
              </div>
            </div>
            <p className="text-lg text-gray-300">{Lore.preview}</p>
            <div className="flex items-center gap-2 mt-4 text-[#00c853] font-medium">
              <span>{isExpanded ? "Read less" : "Read more"}</span>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div 
            variants={expandvariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="overflow-hidden"
          >
            <div className="p-8 pt-0">
              <div className="max-w-4xl mx-auto space-y-8">
                <LoreContent story={Lore.story} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};