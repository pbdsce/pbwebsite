import React from 'react';

// Animated completion indicator component
const CompletionIndicator = () => (
  <div className="relative">
    {/* Pulsing outer ring */}
    <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-green-400 animate-ping opacity-75"></div>
    
    {/* Static outer ring */}
    <div className="relative w-8 h-8 rounded-full border-2 border-green-400 bg-green-400/10 flex items-center justify-center">
      {/* Inner core with rotating animation */}
      <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse"></div>
      
      {/* Rotating scanner line */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className="absolute top-0 left-1/2 w-px h-4 bg-green-300 origin-bottom animate-spin"></div>
      </div>
    </div>
    
    {/* Glowing effect */}
    <div className="absolute inset-0 w-8 h-8 rounded-full bg-green-400/20 blur-sm animate-pulse"></div>
  </div>
);

export default CompletionIndicator; 