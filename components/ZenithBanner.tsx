import React from 'react';
import Link from 'next/link';

export default function ZenithBanner() {
    return (
        <div
            className="w-full"
            data-aos="zoom-y-out"
            data-aos-delay="600"
        >
            <Link href="https://zenith.pointblank.club">
                <div className="relative group cursor-pointer">
                    <div className="bg-black/95 backdrop-blur-sm border-2 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden relative" style={{ borderColor: 'rgba(212, 65, 17, 0.5)' }}>
                        <div className="px-4 py-3 relative border-b" style={{ background: 'rgba(212, 65, 17, 0.15)', borderColor: 'rgba(212, 65, 17, 0.3)' }}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <h2 className="font-bold text-base tracking-wider" style={{ color: 'rgb(255, 150, 120)' }}>ZENITH HACKATHON.exe</h2>
                                        <p className="text-xs font-mono" style={{ color: 'rgba(212, 65, 17, 0.8)' }}>ARCHITECT_THE_MISSING_LAYER...</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-mono" style={{ color: 'rgb(212, 65, 17)' }}>24-HOUR HACKATHON</div>
                                    <div className="text-yellow-400 text-xs font-mono">$5000 PRIZE POOL</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 space-y-3 relative">
                            <div className="space-y-2">
                                <div className="font-mono text-sm pb-1" style={{ color: 'rgb(255, 150, 120)', borderBottom: '1px solid rgba(212, 65, 17, 0.2)' }}>
                                    &gt; MISSION_BRIEF:
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="font-mono text-sm" style={{ color: 'rgb(212, 65, 17)' }}>Real Builders</div>
                                        <div className="text-xs" style={{ color: 'rgba(212, 65, 17, 0.7)' }}>No fluff—just execution</div>
                                    </div>
                                    <div className="flex-1 text-right">
                                        <div className="text-yellow-400 font-mono text-sm">Jan 31 - Feb 1</div>
                                        <div className="text-yellow-500 text-xs">100 Participants</div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2" style={{ borderTop: '1px solid rgba(212, 65, 17, 0.2)' }}>
                                <div className="relative">
                                    <div className="text-white font-mono font-bold py-3 px-4 rounded-lg text-center transition-all duration-300 shadow-lg" style={{ background: 'rgba(212, 65, 17, 0.8)', border: '1px solid rgba(212, 65, 17, 0.5)' }}>
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="animate-pulse">&gt;&gt;</span>
                                            <span className="text-sm">PULL_UP_TO_ZENITH</span>
                                            <span className="animate-pulse">&lt;&lt;</span>
                                        </div>
                                        <div className="text-xs mt-1 tracking-wider" style={{ color: 'rgb(255, 200, 180)' }}>CLICK TO REGISTER</div>
                                    </div>
                                    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" style={{ border: '1px solid rgb(255, 150, 120)' }}></div>
                                </div>
                            </div>
                            <div className="text-center pt-1 border-t border-gray-700/50">
                                <div className="text-xs text-gray-400 font-mono">
                                    SYSTEM: <span style={{ color: 'rgb(212, 65, 17)' }}>POINT_BLANK_CLUB</span>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2" style={{ borderColor: 'rgba(212, 65, 17, 0.6)' }}></div>
                        <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2" style={{ borderColor: 'rgba(212, 65, 17, 0.6)' }}></div>
                        <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2" style={{ borderColor: 'rgba(212, 65, 17, 0.6)' }}></div>
                        <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2" style={{ borderColor: 'rgba(212, 65, 17, 0.6)' }}></div>
                    </div>

                    {/* Holographic Glow */}
                    <div className="absolute -inset-2 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-700 -z-10" style={{ background: 'rgba(212, 65, 17, 0.2)' }}></div>
                    <div className="absolute -inset-4 rounded-2xl blur-2xl opacity-0 group-hover:opacity-50 transition duration-1000 -z-20" style={{ background: 'rgba(212, 65, 17, 0.1)' }}></div>
                </div>
            </Link>
        </div>
    );
}
