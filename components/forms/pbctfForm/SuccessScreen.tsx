import React from 'react';

const SuccessScreen: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-900/90 border border-green-400/30 rounded-lg p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-400/20 border border-green-400 rounded-full mb-6">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-mono text-green-300 mb-4">Registration Complete</h2>
        <p className="text-gray-400 font-mono mb-6">You've been successfully registered for PBCTF 2025</p>
        <a
          href="https://chat.whatsapp.com/HQejGLcEgM1EZFoPTeCUKb"
          className="inline-flex items-center gap-2 bg-green-400/10 hover:bg-green-400/20 border border-green-400 text-green-300 font-mono px-6 py-3 rounded-lg transition-all duration-300"
        >
          Join WhatsApp Group
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default SuccessScreen; 