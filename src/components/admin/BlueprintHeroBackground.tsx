import React from 'react';
import Image from 'next/image';

const BlueprintHeroBackground = () => {
    return (
        <div className="absolute inset-0 w-full h-full bg-[#0f172a] overflow-hidden z-0 pointer-events-none">
            {/* 1. ORIGINAL LEFT SIDE (OHT & Solar Array) */}
            <div className="absolute inset-y-0 left-0 w-[1200px] opacity-100 z-10">
                <Image
                    src="/new_banner_final.png"
                    alt="JJM Banner"
                    fill
                    className="object-contain object-left"
                    priority
                />
            </div>

            {/* 2. THE PIPE EXTENSION TRICK */}
            {/* We take the image again, but pin it to the right and let it stretch across the remaining space.
                Because the right edge of the source image is just straight horizontal pipes and grid, 
                stretching it creates a continuous long line! */}
            <div className="absolute inset-y-0 right-0 left-[800px] opacity-100 z-0">
                <Image
                    src="/new_banner_final.png"
                    alt="JJM Pattern Extension"
                    fill
                    className="object-cover object-right"
                    priority
                />
            </div>

            {/* 3. SEAMLESS BLEND MASK */}
            {/* Fades any slight color mismatches between the two image blocks */}
            <div className="absolute inset-y-0 left-[750px] w-[200px] bg-gradient-to-r from-transparent via-[#13243e] to-transparent z-20 pointer-events-none" />

            {/* 4. OVERALL EDGE FADE (Smooth transition to deep navy on far right) */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0f172a] sm:from-60% md:from-70% xl:from-80% z-30 pointer-events-none" />
        </div>
    );
};

export default BlueprintHeroBackground;
