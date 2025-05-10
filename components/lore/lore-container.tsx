"use client"

import React, { useState } from 'react';
import { Lore } from '@/components/lore/types/lore';
import LoreCard from './lore-card';
import { motion } from 'framer-motion';

interface LoresContainerProps {
  Lores: Lore[];
}

const LoresContainer = ({ Lores }: LoresContainerProps) => {
  const [expandedLore, setExpandedLore] = useState<string | null>(null);
  const handleLoreClick = (LoreId: string) => {
    if (expandedLore === LoreId) {
      setExpandedLore(null);
    } else {
      setExpandedLore(LoreId);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <motion.div 
      className="px-6 md:px-12 lg:px-24 pb-24 space-y-12"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {Lores.map((Lore, index) => (
        <LoreCard
          key={Lore.id}
          lore={Lore}
          isExpanded={expandedLore === Lore.id}
          onCardClick={() => handleLoreClick(Lore.id)}
          index={index}
        />
      ))}
    </motion.div>
  );
};

export default LoresContainer;