import React from 'react';
import Image from 'next/image';

const BlueprintHeroBackground = () => {
    return (
        <div className="absolute inset-0 w-full h-full bg-[#0f172a] overflow-hidden z-0 pointer-events-none">
            {/* 1. MINIMALISTIC SOOTHING BACKGROUND */}
            <div className="absolute inset-y-0 left-0 w-full max-w-[1200px] opacity-100">
                <Image
                    src="/new_banner_final.png"
                    alt="JJM Banner"
                    fill
                    className="object-contain object-left opacity-100"
                    priority
                />
            </div>
        </div>
    );
};

export default BlueprintHeroBackground;
