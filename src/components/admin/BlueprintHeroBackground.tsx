import React from 'react';
import Image from 'next/image';

const BlueprintHeroBackground = () => {
    return (
        <div className="absolute inset-0 w-full h-full bg-[#0f172a] overflow-hidden z-0 pointer-events-none">
            {/* 1. THE USER BANNER (Fills the bounds naturally, right-aligned) */}
            <div className="absolute inset-0 w-full h-full opacity-90 mix-blend-screen z-0">
                <Image
                    src="/hero-banner.png"
                    alt="JJM Cinematic Blueprint"
                    fill
                    className="object-cover object-right"
                    priority
                />
            </div>

            {/* 2. THE CINEMATIC FADE (Intensity increases from Left to Right) */}
            {/* 
               The left is covered in solid navy (hiding the background grid and ensuring crisp white text).
               It fades out towards the right, revealing the bright, high-intensity blueprint design.
            */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/90 to-transparent sm:from-30% md:from-45% lg:from-55% pointer-events-none z-10" />

            {/* Optional soft bottom fade to prevent any sharp lines from the image bounding box */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0f172a] to-transparent pointer-events-none z-10" />
        </div>
    );
};

export default BlueprintHeroBackground;
