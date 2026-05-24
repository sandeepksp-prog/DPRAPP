"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data representing nodes on a map
const NODES = [
  { id: 'n1', x: 20, y: 30, name: 'Aliganj Main', status: 'active', engineer: 'Rajiv Sharma', fhtc: 120 },
  { id: 'n2', x: 45, y: 50, name: 'Sakit Pump', status: 'pending', engineer: 'Amit Kumar', fhtc: 45 },
  { id: 'n3', x: 70, y: 40, name: 'Marehra OHT', status: 'issue', engineer: 'Vikram Singh', fhtc: 0 },
  { id: 'n4', x: 85, y: 70, name: 'Jalesar Zone B', status: 'active', engineer: 'Anil Verma', fhtc: 300 },
  { id: 'n5', x: 30, y: 80, name: 'Awagarh Hub', status: 'active', engineer: 'Suresh Das', fhtc: 85 },
];

export default function NetworkMapOverlay() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  // Real-time pulse effect setup can go here, but CSS animations handle it fine.
  
  return (
    <div className="relative w-full h-[350px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-inner group">
      {/* Background Grid & Blur */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />

      {/* SVG Canvas for Map and Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Mock connections */}
        <motion.path 
          d="M 20% 30% L 45% 50% L 70% 40% L 85% 70% L 30% 80% Z" 
          fill="none" 
          stroke="rgba(56, 189, 248, 0.2)" 
          strokeWidth="2"
          strokeDasharray="4 4"
        />
      </svg>

      {/* Nodes */}
      {NODES.map((node) => (
        <div
          key={node.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
        >
          {/* Pulsing indicator based on status */}
          <div className="relative w-6 h-6 flex items-center justify-center">
            {node.status === 'active' && (
              <>
                <motion.div animate={{ scale: [1, 2.5], opacity: [0.8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 rounded-full bg-emerald-500" />
                <div className="w-3 h-3 bg-emerald-400 rounded-full z-10 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              </>
            )}
            {node.status === 'issue' && (
              <>
                 <motion.div animate={{ scale: [1, 2], opacity: [0.8, 0] }} transition={{ duration: 1, repeat: Infinity }} className="absolute inset-0 rounded-full bg-rose-500" />
                 <div className="w-3 h-3 bg-rose-500 rounded-full z-10 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
              </>
            )}
            {node.status === 'pending' && (
              <div className="w-3 h-3 bg-slate-400 rounded-full z-10" />
            )}
          </div>
        </div>
      ))}

      {/* Hover Overlay Details */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none"
          >
            {NODES.filter(n => n.id === hoveredNode).map(node => (
              <div key={node.id} className="bg-slate-800/90 backdrop-blur-md border border-slate-600 rounded-xl p-4 shadow-xl flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold text-sm tracking-wide">{node.name}</h4>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Eng: <span className="text-sky-400 font-semibold">{node.engineer}</span></p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-white leading-none">{node.fhtc}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">FHTC Done</div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Title */}
      <div className="absolute top-4 left-4 z-0 pointer-events-none">
         <h3 className="text-sm font-bold text-slate-300 tracking-widest uppercase">Live Geomatics</h3>
      </div>
    </div>
  );
}
