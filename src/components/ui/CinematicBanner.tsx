import React, { ReactNode } from 'react';

interface CinematicBannerProps {
    children?: ReactNode;
}

const CinematicBanner: React.FC<CinematicBannerProps> = ({ children }) => {
    return (
        <div className="relative w-full min-h-[350px] bg-[#0F172A] overflow-hidden rounded-b-2xl shadow-xl border-b border-slate-800">
            {/* Layer 1: The Graphic Image */}
            <img
                src="/DATA/NEW BANNER.PNG"
                alt="KSPPL Background"
                className="absolute inset-0 w-full h-full object-cover object-left pointer-events-none z-0"
                style={{
                    WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0) 100%)',
                    maskImage: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0) 100%)'
                }}
            />

            {/* Layer 2: The Right-Corner Glow */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-sky-500/10 blur-[130px] rounded-full pointer-events-none z-0" />

            {/* Content Wrapper (The "Overdraft" Data Layer) */}
            <div className="relative z-10 w-full h-full flex flex-col p-6 lg:p-10">
                {children}
            </div>
        </div>
    );
};

export default CinematicBanner;
