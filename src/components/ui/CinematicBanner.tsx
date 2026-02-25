import React, { ReactNode } from 'react';

interface CinematicBannerProps {
    children?: ReactNode;
}

const CinematicBanner: React.FC<CinematicBannerProps> = ({ children }) => {
    return (
        <div className="relative w-full min-h-[350px] bg-[#0F172A] overflow-hidden shadow-2xl">
            {/* Layer 1: The Realistic Field Image */}
            <img
                src="/DATA/village.png"
                alt="Realistic Campus View"
                className="absolute inset-0 w-full h-full object-cover object-left opacity-90 pointer-events-none z-0"
                style={{
                    WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 90%)',
                    maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 90%)'
                }}
            />

            {/* Layer 2: The Smooth Glass Gradient Over Realistic Image */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/30 via-[#0F172A]/80 to-[#0F172A] pointer-events-none z-0" />

            {/* Layer 3: The Cinematic Corner Glow */}
            <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0" />

            {/* Layer 5: Content Wrapper */}
            <div className="relative z-10 w-full h-full flex flex-col p-6 lg:p-10">
                {children}
            </div>
        </div>
    );
};

export default CinematicBanner;
