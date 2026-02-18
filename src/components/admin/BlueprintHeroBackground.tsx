import React from 'react';

const BlueprintHeroBackground = () => {
    return (
        <div className="absolute inset-0 w-full h-full bg-[#0f172a] overflow-hidden z-0 pointer-events-none">
            {/* 1. BLUEPRINT GRID PATTERN */}
            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}>
            </div>
            <div className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: 'linear-gradient(#ffffff 0.5px, transparent 0.5px), linear-gradient(90deg, #ffffff 0.5px, transparent 0.5px)',
                    backgroundSize: '10px 10px'
                }}>
            </div>

            {/* 2. TECHNICAL DRAWING ELEMENTS (SVG) */}
            <svg className="absolute top-1/2 left-0 w-full h-full -translate-y-1/2 pointer-events-none opacity-30 mix-blend-screen" viewBox="0 0 1920 600" preserveAspectRatio="xMidYMid slice">
                <defs>
                    <pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <line x1="0" y1="0" x2="0" y2="10" stroke="white" strokeWidth="1" />
                    </pattern>
                </defs>

                {/* LEFT: OHT TOWER WIREFRAME */}
                <g transform="translate(150, 100) scale(1.2)">
                    {/* Tank Top */}
                    <ellipse cx="100" cy="50" rx="80" ry="20" fill="none" stroke="white" strokeWidth="1.5" />
                    <ellipse cx="100" cy="50" rx="70" ry="15" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="4 2" />
                    <line x1="20" y1="50" x2="20" y2="150" stroke="white" strokeWidth="1.5" />
                    <line x1="180" y1="50" x2="180" y2="150" stroke="white" strokeWidth="1.5" />
                    <ellipse cx="100" cy="150" rx="80" ry="20" fill="none" stroke="white" strokeWidth="1.5" />

                    {/* Tank Bottom / Shaft */}
                    <line x1="60" y1="150" x2="60" y2="400" stroke="white" strokeWidth="1.5" />
                    <line x1="140" y1="150" x2="140" y2="400" stroke="white" strokeWidth="1.5" />

                    {/* Cross Bracing */}
                    <line x1="60" y1="180" x2="140" y2="220" stroke="white" strokeWidth="0.5" />
                    <line x1="60" y1="220" x2="140" y2="180" stroke="white" strokeWidth="0.5" />
                    <line x1="60" y1="260" x2="140" y2="300" stroke="white" strokeWidth="0.5" />
                    <line x1="60" y1="300" x2="140" y2="260" stroke="white" strokeWidth="0.5" />

                    {/* Dimensions / Annotations */}
                    <line x1="190" y1="50" x2="210" y2="50" stroke="white" strokeWidth="0.5" />
                    <line x1="190" y1="400" x2="210" y2="400" stroke="white" strokeWidth="0.5" />
                    <line x1="200" y1="50" x2="200" y2="400" stroke="white" strokeWidth="0.5" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
                    <text x="215" y="225" fill="white" fontSize="10" fontFamily="monospace" transform="rotate(90 215,225)">HEIGHT: 18M</text>
                </g>

                {/* CENTER/RIGHT: PIPING NETWORK */}
                <g transform="translate(400, 350)">
                    <path d="M0,50 L200,50 L250,100 L600,100" fill="none" stroke="white" strokeWidth="2" />
                    <path d="M225,50 L225,0" fill="none" stroke="white" strokeWidth="1.5" />
                    <circle cx="225" cy="50" r="5" fill="#0f172a" stroke="white" strokeWidth="1.5" />
                    <text x="235" y="40" fill="white" fontSize="8" fontFamily="monospace">VALVE-01</text>

                    {/* Underground section hatch */}
                    <rect x="0" y="80" width="800" height="100" fill="url(#hatch)" opacity="0.2" />
                    <line x1="0" y1="80" x2="800" y2="80" stroke="white" strokeWidth="0.5" strokeDasharray="5 5" />
                </g>

                {/* RIGHT: EXCAVATION PLAN */}
                <g transform="translate(1100, 100) scale(0.8)">
                    <rect x="0" y="0" width="300" height="200" fill="none" stroke="white" strokeWidth="1" strokeDasharray="2 2" />
                    <text x="10" y="20" fill="white" fontSize="12" fontFamily="monospace">ZONE A: EXCAVATION</text>
                    <path d="M50,150 Q150,100 250,150" fill="none" stroke="white" strokeWidth="1" />
                    <circle cx="150" cy="125" r="30" fill="none" stroke="white" strokeWidth="1" />
                    <circle cx="150" cy="125" r="2" fill="white" />
                </g>
            </svg>

            {/* 3. VIGNETTE OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-transparent to-[#0f172a] opacity-80"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0f172a]"></div>
        </div>
    );
};

export default BlueprintHeroBackground;
