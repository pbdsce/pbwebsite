import React, { useState } from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormData } from './types';
import RulesModal from './RulesModal';

interface RulesAgreementsProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

const RulesAgreements: React.FC<RulesAgreementsProps> = ({
  register,
  errors
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasReadRules, setHasReadRules] = useState(false);

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFullyRead = () => {
    setHasReadRules(true);
  };

  return (
    <>
      <div className="bg-gray-800/30 border border-green-400/20 rounded-lg p-4">
        <h4 className="text-green-300 font-mono text-sm mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          Terms & Conditions
        </h4>
        
        <div className="space-y-4">
          <label className="flex items-start gap-3 group">
            <input
              type="checkbox"
              {...register("agreeRules", { required: "You must agree to the CTF Rules & Code of Conduct" })}
              disabled={!hasReadRules}
              className={`
                mt-1 w-4 h-4 rounded focus:ring-green-400 focus:ring-2
                ${hasReadRules 
                  ? 'text-green-400 bg-gray-900/50 border-green-400/30 cursor-pointer' 
                  : 'text-gray-600 bg-gray-700/50 border-gray-600 cursor-not-allowed'
                }
              `}
            />
            <div className="flex flex-col">
              <span className="text-green-300 font-mono text-sm">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={handleOpenModal}
                  className="text-green-400 underline hover:text-green-200 transition-colors"
                >
                  CTF Rules & Code of Conduct
                </button>
              </span>
              {!hasReadRules && (
                <span className="text-xs text-yellow-400 font-mono mt-1">
                  ⚠️ Please read the rules first to enable this option
                </span>
              )}
              {hasReadRules && (
                <span className="text-xs text-green-400 font-mono mt-1">
                  ✅ Rules have been read
                </span>
              )}
            </div>
          </label>
          {errors.agreeRules && (
            <p className="text-xs text-red-400 font-mono ml-7">
              {errors.agreeRules.message}
            </p>
          )}

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              {...register("consentLeaderboard", { required: "You must consent to leaderboard listing" })}
              className="mt-1 w-4 h-4 text-green-400 bg-gray-900/50 border-green-400/30 rounded focus:ring-green-400 focus:ring-2"
            />
            <span className="text-green-300 font-mono text-sm group-hover:text-green-200 transition-colors">
              I consent to my name/team being listed on the leaderboard
            </span>
          </label>
          {errors.consentLeaderboard && (
            <p className="text-xs text-red-400 font-mono ml-7">
              {errors.consentLeaderboard.message}
            </p>
          )}

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              {...register("allowContact", { required: "You must allow organizers to contact you" })}
              className="mt-1 w-4 h-4 text-green-400 bg-gray-900/50 border-green-400/30 rounded focus:ring-green-400 focus:ring-2"
            />
            <span className="text-green-300 font-mono text-sm group-hover:text-green-200 transition-colors">
              I allow organizers to contact me for event updates
            </span>
          </label>
          {errors.allowContact && (
            <p className="text-xs text-red-400 font-mono ml-7">
              {errors.allowContact.message}
            </p>
          )}
        </div>
      </div>

      <RulesModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onFullyRead={handleFullyRead}
        hasBeenFullyRead={hasReadRules}
      />
    </>
  );
};

export default RulesAgreements; 