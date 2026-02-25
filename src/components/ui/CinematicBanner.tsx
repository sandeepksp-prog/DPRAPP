"use client";
import React, { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicBannerProps {
    children?: ReactNode;
}

const bannerData = [
    { src: '/DATA/village.png', positionClass: 'object-left' },
    { src: '/DATA/campus.png', positionClass: 'object-[center_25%]' }
];

const CinematicBanner: React.FC<CinematicBannerProps> = ({ children }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerData.length);
        }, 10000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full min-h-[350px] bg-[#0F172A] overflow-hidden shadow-2xl">
            {/* Layer 1: The Auto-Scrolling Images within a static mask container */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 90%)',
                    maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 90%)'
                }}
            >
                <AnimatePresence initial={false}>
                    <motion.img
                        key={currentIndex}
                        src={bannerData[currentIndex].src}
                        alt="Cinematic Banner Background"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ duration: 1, ease: 'easeInOut' }}
                        className={`absolute inset-0 w-full h-full object-cover opacity-90 ${bannerData[currentIndex].positionClass}`}
                    />
                </AnimatePresence>
            </div>

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
