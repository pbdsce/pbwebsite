import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { FormData } from './types';

interface ParticipationTypeSelectionProps {
  register: UseFormRegister<FormData>;
  participationType: "solo" | "duo" | undefined;
}

const ParticipationTypeSelection: React.FC<ParticipationTypeSelectionProps> = ({
  register,
  participationType
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label className={`
        flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300
        ${participationType === 'solo' ? 'border-green-400 bg-green-400/10' : 'border-green-400/30 hover:border-green-400/50'}
      `}>
        <input
          type="radio"
          {...register("participationType", { required: true })}
          value="solo"
          className="sr-only"
        />
        <div className="text-center">
          <div className="text-2xl mb-2">👤</div>
          <div className="text-green-300 font-mono">Solo</div>
          <div className="text-xs text-gray-400 font-mono">Individual participation</div>
        </div>
      </label>
      
      <label className={`
        flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300
        ${participationType === 'duo' ? 'border-green-400 bg-green-400/10' : 'border-green-400/30 hover:border-green-400/50'}
      `}>
        <input
          type="radio"
          {...register("participationType", { required: true })}
          value="duo"
          className="sr-only"
        />
        <div className="text-center">
          <div className="text-2xl mb-2">👥</div>
          <div className="text-green-300 font-mono">Duo</div>
          <div className="text-xs text-gray-400 font-mono">Team of 2 members</div>
        </div>
      </label>
    </div>
  );
};

export default ParticipationTypeSelection; 