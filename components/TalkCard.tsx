"use client";
import React from 'react';

// FIX: No internal useEffect or state here to avoid render-loops
const TalkCard = ({ talk }: any) => {
  return (
    <div
      className="group p-8 rounded-[2rem] bg-[#0c0c0c] border border-zinc-900 
      hover:border-green-500/50 hover:-translate-y-2 transition-all duration-500 
      flex flex-col cursor-pointer min-h-[340px] shadow-2xl block relative z-10"
    >
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-white mb-2">{talk.name}</h3>
        <h4 className="text-2xl font-bold text-[#00C853] mb-4">{talk.title}</h4>
        <p className="text-zinc-500 text-sm line-clamp-4">{talk.description}</p>
      </div>
      <div className="mt-8 pt-6 border-t border-zinc-900 text-zinc-700 text-[10px] uppercase tracking-widest">
        {talk.conference}
      </div>
    </div>
  );
};

export default TalkCard;