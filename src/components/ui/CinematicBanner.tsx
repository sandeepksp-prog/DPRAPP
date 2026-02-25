import React, { ReactNode } from 'react';

interface CinematicBannerProps {
    children?: ReactNode;
}

const CinematicBanner: React.FC<CinematicBannerProps> = ({ children }) => {
    return (
        <div className="relative w-full min-h-[350px] bg-slate-950 overflow-hidden border-b border-slate-800 shadow-2xl">
            {/* Layer 1: The Engineering Grid (Left Anchored) */}
            <div
                className="absolute inset-0 w-full h-full opacity-50 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none z-0"
                style={{ maskImage: 'linear-gradient(to right, white 0%, transparent 60%)', WebkitMaskImage: 'linear-gradient(to right, white 0%, transparent 60%)' }}
            />

            {/* Layer 2: The "Etched" Draft Image */}
            <img
                src="/DATA/NEW BANNER.PNG"
                alt="Blueprint Draft"
                className="absolute inset-0 w-full h-full object-cover object-left opacity-70 mix-blend-screen pointer-events-none z-0"
                style={{
                    WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0) 80%)',
                    maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0) 80%)'
                }}
            />

            {/* Layer 3: The Smooth Glass Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/10 via-slate-950/90 to-slate-950 pointer-events-none z-0" />

            {/* Layer 4: The Cinematic Corner Glow */}
            <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0" />

            {/* Layer 5: Content Wrapper */}
            <div className="relative z-10 w-full h-full flex flex-col p-6 lg:p-10">
                {children}
            </div>
        </div>
    );
};

export default CinematicBanner;
