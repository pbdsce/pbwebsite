import React from 'react';
import Link from 'next/link';

export default function RecruitmentBanner() {
    return (
        <div 
            className="flex-shrink-0 w-full lg:w-[32rem]"
            data-aos="zoom-y-out"
            data-aos-delay="800"
        >
            <Link href="../recruitment">
                <div className="relative group cursor-pointer">
                    <div className="bg-black/95 backdrop-blur-sm border-2 border-purple-400/50 rounded-2xl shadow-2xl group-hover:border-purple-300/80 group-hover:bg-black/98 transition-all duration-300 overflow-hidden relative">
                        <div className="bg-gradient-to-r from-purple-900/50 via-purple-900/50 to-purple-900/50 px-4 py-3 relative border-b border-purple-400/30">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <h2 className="text-purple-300 font-bold text-base tracking-wider">PB RECRUITMENT.exe</h2>
                                        <p className="text-purple-500/80 text-xs font-mono">SCANNING_CANDIDATES...</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-purple-400 text-xs font-mono">STATUS: ACTIVE</div>
                                    <div className="text-yellow-400 text-xs font-mono">SLOTS: LIMITED</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 space-y-3 relative">
                            <div className="space-y-2">
                                <div className="text-purple-300 font-mono text-sm border-b border-purple-400/20 pb-1">
                                    &gt; RECRUITMENT_OBJECTIVES:
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="text-purple-400 font-mono text-sm">Join Elite Community</div>
                                        <div className="text-purple-500 text-xs">Tech excellence awaits</div>
                                    </div>
                                    <div className="flex-1 text-right">
                                        <div className="text-yellow-400 font-mono text-sm">CP • Dev • AI • Security</div>
                                        <div className="text-yellow-500 text-xs">Multiple domains available</div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-purple-400/20">
                                <div className="relative">
                                    <div className="bg-gradient-to-r from-purple-600/80 via-purple-600/80 to-purple-600/80 text-white font-mono font-bold py-3 px-4 rounded-lg text-center group-hover:from-purple-500/90 group-hover:to-purple-500/90 transition-all duration-300 shadow-lg group-hover:shadow-purple-400/20 border border-purple-400/50">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="animate-pulse">&gt;&gt;</span>
                                            <span className="text-sm">ACCEPT_CHALLENGE</span>
                                            <span className="animate-pulse">&lt;&lt;</span>
                                        </div>
                                        <div className="text-xs text-purple-200 mt-1 tracking-wider">PROVE YOUR WORTH</div>
                                    </div>
                                    <div className="absolute inset-0 border border-purple-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                                </div>
                            </div>

                            <div className="text-center pt-1 border-t border-gray-700/50">
                                <div className="text-xs text-gray-400 font-mono">
                                    SYSTEM: <span className="text-purple-400">POINT_BLANK_CLUB</span> | 
                                    NODE: <span className="text-purple-400">DSCE</span>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-purple-400/60"></div>
                        <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-purple-400/60"></div>
                        <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-purple-400/60"></div>
                        <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-purple-400/60"></div>
                    </div>

                    {/* Holographic Glow */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-400/20 via-purple-400/20 to-purple-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-700 -z-10"></div>
                    <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/10 via-purple-600/10 to-purple-600/10 rounded-2xl blur-2xl opacity-0 group-hover:opacity-50 transition duration-1000 -z-20"></div>
                </div>
            </Link>
        </div>
    );
}