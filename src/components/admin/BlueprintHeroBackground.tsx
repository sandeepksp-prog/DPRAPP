import React from 'react';
import Image from 'next/image';

const BlueprintHeroBackground = () => {
    return (
        <div className="absolute inset-0 w-full h-full bg-[#0f172a] overflow-hidden z-0 pointer-events-none">
            {/* 1. MINIMALISTIC SOOTHING BACKGROUND */}
            <div className="absolute inset-y-0 left-0 w-full opacity-100">
                <Image
                    src="/new_banner_final.png"
                    alt="JJM Banner"
                    fill
                    className="object-contain object-left opacity-100"
                    priority
                />

                {/* 2. ABSOLUTE GRADIENT OVERLAY (Fades the hard right edge into the dark navy) */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#13243e] to-[#0f172a] sm:from-40% md:from-50% lg:from-60% xl:from-65% z-10 pointer-events-none" />
            </div>
        </div>
    );
};

export default BlueprintHeroBackground;
