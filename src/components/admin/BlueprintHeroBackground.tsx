import React from 'react';
import Image from 'next/image';

const BlueprintHeroBackground = () => {
    return (
        <div className="absolute inset-0 w-full h-full bg-[#0f172a] overflow-hidden z-0 pointer-events-none">
            {/* 1. THE DESIGN (Fills bounds, Left-Aligned for OHT) 
                mix-blend-lighten combined with the #0f172a background magically removes 
                the faint, dark square grid from the original image while keeping the cyan lines! */}
            <div className="absolute inset-0 w-full h-full opacity-100 mix-blend-lighten z-0">
                <Image
                    src="/hero-banner.png"
                    alt="JJM Cinematic Blueprint"
                    fill
                    className="object-cover object-left"
                    priority
                />
            </div>

            {/* 2. THE INTENSITY FADE (Solid on left -> Transparent on right)
               This creates the "intensity increases from left to right" effect 
               the user requested, keeping a solid dark shade behind the text.
            */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/70 to-transparent sm:from-20% md:from-35% lg:from-45% pointer-events-none z-10" />

            {/* Bottom transition line fade */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0f172a] to-transparent pointer-events-none z-10" />
        </div>
    );
};

export default BlueprintHeroBackground;
