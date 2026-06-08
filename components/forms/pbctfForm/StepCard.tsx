import React, { ReactNode } from 'react';
import CompletionIndicator from './CompletionIndicator';

interface StepCardProps {
  stepNumber: number;
  title: string;
  isCompleted: boolean;
  isExpanded: boolean;
  isLocked?: boolean;
  children: ReactNode;
  onStepClick: (stepNumber: number) => void;
}

const StepCard: React.FC<StepCardProps> = ({
  stepNumber,
  title,
  isCompleted,
  isExpanded,
  isLocked = false,
  children,
  onStepClick
}) => {
  return (
    <div 
      className={`
        relative bg-gray-900/50 border rounded-lg transition-all duration-300
        ${isLocked ? 'border-gray-700 opacity-60' : 'border-green-400/30 hover:border-green-400/50'}
        ${isExpanded ? 'ring-1 ring-green-400/50' : ''}
      `}
    >
      <div className="p-6">
        <div 
          className={`flex items-center gap-3 ${
            isLocked ? 'cursor-not-allowed' : 'cursor-pointer'
          } ${isExpanded ? 'mb-4' : 'mb-0'}`}
          onClick={() => {
            if (!isLocked) onStepClick(stepNumber);
          }}
          aria-disabled={isLocked}
        >
          <div className={`
            w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono text-sm
            ${isCompleted ? 'border-green-400 bg-green-400/20 text-green-300' : 'border-green-400/50 text-green-400'}
          `}>
            {isCompleted ? <CompletionIndicator /> : (
              <div className="w-2 h-2 bg-green-400/50 rounded-full"></div>
            )}
          </div>
          <h3 className="font-mono text-lg text-green-300">
            {title}
          </h3>
          <div className="ml-auto flex items-center gap-2">
            {isLocked && (
              <span className="text-xs font-mono text-gray-400">
                LOCKED
              </span>
            )}
            {isCompleted && (
              <>
                <span className="hidden sm:inline-block text-xs font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/30">
                  COMPLETE
                </span>
                {/* <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div> */}
              </>
            )}
            <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isLocked ? "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm3-10V7a3 3 0 016 0v4" : "M19 9l-7 7-7-7"}
                />
              </svg>
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div 
            className="space-y-4 animate-in slide-in-from-top-2 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default StepCard;
