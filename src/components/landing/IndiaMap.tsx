"use client";

import React, { useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { scaleQuantile } from "d3-scale";

// India TopoJSON URL
const INDIA_TOPO_JSON = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-states.json";

interface IndiaMapProps {
    onStateClick: (stateName: string) => void;
    activeState: string | null;
}

const activeStates = ["Uttar Pradesh", "Kerala"];

const IndiaMap: React.FC<IndiaMapProps> = ({ onStateClick, activeState }) => {
    const [tooltipContent, setTooltipContent] = useState("");
    const [position, setPosition] = useState({ coordinates: [78.9629, 22.5937], zoom: 1 });

    React.useEffect(() => {
        if (activeState === "Uttar Pradesh") {
            setPosition({ coordinates: [80.9462, 26.8467], zoom: 4 });
        } else if (activeState === "Kerala") {
            setPosition({ coordinates: [76.2711, 10.8505], zoom: 6 });
        } else {
            setPosition({ coordinates: [78.9629, 22.5937], zoom: 1 });
        }
    }, [activeState]);

    const handleGeographyClick = (geo: any) => {
        const { name } = geo.properties;
        if (activeStates.includes(name)) {
            onStateClick(name);
        } else {
            // Toast handled by parent or local state?
            // For now, let's just log or show tooltip
            console.log("Inactive state clicked");
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center bg-[#0F172A] relative overflow-hidden">
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 1000,
                    center: [78.9629, 22.5937] // Center of India
                }}
                className="w-full h-full"
            >
                <ZoomableGroup zoom={position.zoom} center={position.coordinates as [number, number]} onMoveEnd={(pos) => setPosition(pos)}>
                    <Geographies geography={INDIA_TOPO_JSON}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                const isActive = activeStates.includes(geo.properties.name);
                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        onMouseEnter={() => {
                                            setTooltipContent(`${geo.properties.name} ${!isActive ? "(Coming Soon)" : ""}`);
                                        }}
                                        onMouseLeave={() => {
                                            setTooltipContent("");
                                        }}
                                        onClick={() => handleGeographyClick(geo)}
                                        style={{
                                            default: {
                                                fill: isActive ? "#1E293B" : "#334155",
                                                stroke: isActive ? "#38BDF8" : "#475569",
                                                strokeWidth: 0.75,
                                                outline: "none",
                                                transition: "all 250ms"
                                            },
                                            hover: {
                                                fill: isActive ? "#334155" : "#475569",
                                                stroke: isActive ? "#0EA5E9" : "#64748B",
                                                strokeWidth: 1,
                                                outline: "none",
                                                cursor: isActive ? "pointer" : "not-allowed"
                                            },
                                            pressed: {
                                                fill: isActive ? "#0F172A" : "#334155",
                                                outline: "none"
                                            }
                                        }}
                                    />
                                );
                            })
                        }
                    </Geographies>

                    {/* Floating Diamond/Rhombus Markers for Active States */}
                    {/* UP Coordinates approx: 80.9462, 26.8467 */}
                    <Marker coordinates={[80.9462, 26.8467]}>
                        <g
                            fill="none"
                            stroke="#0EA5E9"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            transform="translate(-12, -24)"
                        >
                            <motion.path
                                d="M12 2 L2 12 L12 22 L22 12 Z"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1, y: [0, -5, 0] }}
                                transition={{
                                    scale: { duration: 0.5 },
                                    y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                                }}
                                fill="rgba(14, 165, 233, 0.3)"
                            />
                            <circle cx="12" cy="12" r="2" fill="#0EA5E9" />
                        </g>
                        <text textAnchor="middle" y={-30} style={{ fontFamily: "system-ui", fill: "#E2E8F0", fontSize: "10px", fontWeight: "bold" }}>
                            UP Project
                        </text>
                    </Marker>

                    {/* Kerala Coordinates approx: 76.2711, 10.8505 */}
                    <Marker coordinates={[76.2711, 10.8505]}>
                        <g
                            fill="none"
                            stroke="#0EA5E9"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            transform="translate(-12, -24)"
                        >
                            <motion.path
                                d="M12 2 L2 12 L12 22 L22 12 Z"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1, y: [0, -5, 0] }}
                                transition={{
                                    scale: { duration: 0.5 },
                                    y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                                }}
                                fill="rgba(14, 165, 233, 0.3)"
                            />
                            <circle cx="12" cy="12" r="2" fill="#0EA5E9" />
                        </g>
                        <text textAnchor="middle" y={-30} style={{ fontFamily: "system-ui", fill: "#E2E8F0", fontSize: "10px", fontWeight: "bold" }}>
                            Kerala Project
                        </text>
                    </Marker>

                </ZoomableGroup>
            </ComposableMap>

            {/* Tooltip or Toast would go here */}
            {tooltipContent && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm border border-white/10 pointer-events-none">
                    {tooltipContent}
                </div>
            )}
        </div>
    );
};

export default IndiaMap;
