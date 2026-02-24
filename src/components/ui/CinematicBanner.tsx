import React, { ReactNode } from 'react';
import Image from 'next/image';

interface CinematicBannerProps {
    children?: ReactNode;
}

const CinematicBanner: React.FC<CinematicBannerProps> = ({ children }) => {
    return (
        <div className="relative w-full min-h-[300px] overflow-hidden bg-slate-900 shadow-lg">
            {/* LAYER 1: The Graphic Image with smooth Left-to-Right Opacity Mask */}
            {/* 
         mask-image: linear-gradient 
         Left side: 65% opacity
         Middle: 35% opacity
         Right side: 0% opacity 
      */}
            <div
                className="absolute inset-0 w-full h-full pointer-events-none z-0"
                style={{
                    maskImage: 'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 100%)'
                }}
            >
                <Image
                    src="/hero-banner.png"
                    alt="Construction Graphic Background"
                    fill
                    className="object-cover object-left"
                    priority
                />
            </div>

            {/* LAYER 2: The Gradient & Core Solid Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-blue-900/80 to-blue-950 pointer-events-none z-0">
                {/* Special Effect: Soft Top-Right Glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 blur-[100px] rounded-full pointer-events-none" />
            </div>

            {/* CONTENT WRAPPER */}
            <div className="z-10 relative flex w-full h-full items-center">
                {children}
            </div>
        </div>
    );
};

export default CinematicBanner;
