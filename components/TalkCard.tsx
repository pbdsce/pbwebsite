"use client";
import React from "react";

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
      <div className="mt-8 pt-6 border-t border-zinc-900 text-[10px] uppercase tracking-widest flex justify-between items-center">
        <span className="text-zinc-400 font-bold">{talk.conference}</span>

        <div className="flex items-center gap-3">
          {talk.links?.length > 0 && (
            <span className="text-[#00C853] font-bold">
              {talk.links.length} Links
            </span>
          )}

          <span className="text-zinc-500 font-medium">{talk.date}</span>
        </div>
      </div>
    </div>
  );
};

export default TalkCard;
