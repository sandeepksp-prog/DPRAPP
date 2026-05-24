"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    MessageSquare, X, Send, RefreshCw, Sparkles, 
    TrendingUp, Coins, Database, AlertTriangle, ArrowRight 
} from "lucide-react";
import { SCHEME_MAP } from "@/lib/scheme-data";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface PmxChatbotProps {
    activeTab: string;
    activeBranch: "UP" | "KERALA";
    activeSchemeId: number | null;
}

export default function PmxChatbot({ activeTab, activeBranch, activeSchemeId }: PmxChatbotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { 
            role: "assistant", 
            content: "Hii sir, I am **PICO** your project managing assistant. How can I help you today with your operations?" 
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Dynamic suggestions based on active tab and branch context
    useEffect(() => {
        if (activeBranch === "KERALA") {
            setSuggestions([
                "Why is Kerala branch suspended?",
                "What is the total halted pipeline length?",
                "Who is the manager for Kerala site?"
            ]);
            return;
        }

        const schemeName = activeSchemeId ? (SCHEME_MAP[activeSchemeId]?.name || "Active Scheme") : "";

        switch (activeTab) {
            case "scheme":
                setSuggestions([
                    schemeName ? `Calculate pipe laying completion % for ${schemeName}` : "Calculate pipe laying completion %",
                    "What is our pipe laying target vs executed?",
                    "Check total gross amount billed"
                ]);
                break;
            case "store":
                setSuggestions([
                    "Show pipe stock ledger status",
                    "Which pipe diameter has the highest stock?",
                    "Verify pipe dispatch logs"
                ]);
                break;
            case "billing":
                setSuggestions([
                    "List all submitted RA bills gross amount",
                    "Compare BOQ vs EQ billing variances",
                    "What is the status of the last RA bill?"
                ]);
                break;
            case "issues":
                setSuggestions([
                    "Summarize active site red-flags",
                    "Show high priority engineering issues",
                    "Are there any delays in Aliganj block?"
                ]);
                break;
            default:
                setSuggestions([
                    "Give me an executive operations summary",
                    "How many schemes are currently active?",
                    "What is our overall FHTC target achievement?"
                ]);
                break;
        }
    }, [activeTab, activeBranch, activeSchemeId]);

    // Auto scroll chat to bottom when messages list updates
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSendMessage = async (textToSend: string) => {
        if (!textToSend.trim() || isLoading) return;

        const userText = textToSend;
        setInput("");
        
        // Add user message immediately
        const newMessages = [...messages, { role: "user" as const, content: userText }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userText,
                    history: newMessages.slice(0, -1), // skip current message to let server manage turn
                    context: { activeTab, activeSchemeId, activeBranch }
                })
            });

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error("QUOTA_EXHAUSTED");
                }
                throw new Error("Failed to get response from AI endpoint");
            }

            setIsLoading(false);
            
            // Add an empty assistant message that we will populate dynamically with streaming chunks
            setMessages(prev => [...prev, { role: "assistant", content: "" }]);

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let accumulatedContent = "";

            if (!reader) {
                setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { 
                        role: "assistant", 
                        content: "I'm sorry, I was unable to establish a secure data stream. Please try again." 
                    };
                    return updated;
                });
                return;
            }

            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                if (value) {
                    const chunk = decoder.decode(value, { stream: true });
                    accumulatedContent += chunk;
                    setMessages(prev => {
                        const updated = [...prev];
                        updated[updated.length - 1] = {
                            role: "assistant",
                            content: accumulatedContent
                        };
                        return updated;
                    });
                }
            }

        } catch (err: any) {
            console.error("Chat error:", err);
            setIsLoading(false);
            const isQuota = err.message === "QUOTA_EXHAUSTED";
            setMessages(prev => [
                ...prev,
                { 
                    role: "assistant", 
                    content: isQuota 
                        ? "⚠️ **API Quota Limit Reached.** The daily free-tier limit for our AI engine has been exhausted. Please try again after some time, or ask Sandeep to upgrade the API key to a paid plan for uninterrupted service."
                        : "An operational error occurred while connecting to the intelligence engine. Please ensure your connection is active." 
                }
            ]);
        }
    };

    const handleClearChat = () => {
        setMessages([
            { 
                role: "assistant", 
                content: "Hii sir, I am **PICO** your project managing assistant. How can I help you today with your operations?" 
            }
        ]);
    };

    // Recharts colors
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

    const renderChart = (jsonStr: string) => {
        try {
            const config = JSON.parse(jsonStr);
            if (config.type !== "chart" || !config.data) return null;
            
            return (
                <div className="w-full my-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 overflow-hidden shadow-sm">
                    {config.title && <h4 className="text-sm font-bold text-slate-200 mb-4 text-center">{config.title}</h4>}
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            {config.chartType === "pie" ? (
                                <PieChart>
                                    <Pie data={config.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                        {config.data.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '12px' }} />
                                </PieChart>
                            ) : (
                                <BarChart data={config.data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tick={{fill: '#94a3b8'}} angle={-25} textAnchor="end" />
                                    <YAxis stroke="#94a3b8" fontSize={10} tick={{fill: '#94a3b8'}} tickFormatter={(val) => (val > 1000000 ? (val/1000000).toFixed(1)+'M' : val)} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '12px' }} cursor={{fill: '#1e293b'}} />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                                        {config.data.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>
            );
        } catch (e) {
            console.error("Failed to parse chart JSON", e);
            return null;
        }
    };

    const renderBoldText = (text: string, isUser: boolean = false) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => 
            part.startsWith('**') && part.endsWith('**') ? (
                <strong key={index} className={isUser ? "text-blue-100 font-semibold" : "text-blue-950 font-bold"}>
                    {part.slice(2, -2)}
                </strong>
            ) : part
        );
    };

    const renderTextLines = (textPart: string, isUser: boolean, keyOffset: number) => {
        return textPart.split("\n").map((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={keyOffset + idx} className="h-2"></div>;

            if (trimmed.startsWith('### ')) {
                return <h3 key={keyOffset + idx} className={`font-bold mt-3 mb-1 ${isUser ? 'text-blue-100' : 'text-blue-950'} text-sm`}>{renderBoldText(trimmed.replace('### ', ''), isUser)}</h3>;
            }
            if (trimmed.startsWith('#### ')) {
                return <h4 key={keyOffset + idx} className={`font-semibold mt-2 mb-1 ${isUser ? 'text-blue-200' : 'text-blue-800'} text-xs uppercase tracking-wider`}>{renderBoldText(trimmed.replace('#### ', ''), isUser)}</h4>;
            }
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                return (
                    <li key={keyOffset + idx} className={`ml-4 list-disc my-1 leading-relaxed text-xs ${isUser ? "text-blue-100/90 font-medium" : "text-slate-700"}`}>
                        {renderBoldText(trimmed.substring(2), isUser)}
                    </li>
                );
            }
            const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
            if (numMatch) {
                return (
                    <li key={keyOffset + idx} className={`ml-4 list-decimal my-1 leading-relaxed text-xs ${isUser ? "text-blue-100/90 font-medium" : "text-slate-700"}`}>
                        {renderBoldText(numMatch[2], isUser)}
                    </li>
                );
            }

            return (
                <p key={keyOffset + idx} className={`mb-2 leading-relaxed text-xs md:text-[13px] last:mb-0 ${isUser ? "text-blue-950 font-medium" : "text-slate-800"}`}>
                    {renderBoldText(line, isUser)}
                </p>
            );
        });
    };

    // Format markdown helper to handle bold, bullet lists, and inline images
    const formatMessageContent = (text: string, isUser: boolean = false) => {
        const parts: React.ReactNode[] = [];
        const jsonRegex = /```json\s*(\{[\s\S]*?"type":\s*"chart"[\s\S]*?\})\s*```/g;
        
        let lastIndex = 0;
        let match;
        while ((match = jsonRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                const textPart = text.slice(lastIndex, match.index);
                parts.push(...renderTextLines(textPart, isUser, parts.length));
            }
            parts.push(<React.Fragment key={`chart-${match.index}`}>{renderChart(match[1])}</React.Fragment>);
            lastIndex = match.index + match[0].length;
        }
        
        if (lastIndex < text.length) {
            const textPart = text.slice(lastIndex);
            parts.push(...renderTextLines(textPart, isUser, parts.length));
        }
        
        return parts;
    };

    return (
        <>
            {/* FLOATING ACTION BUTTON (FAB) - Brand Shady Sky Art with Revolving SVG Orbit */}
            <div className="fixed bottom-6 left-6 md:left-[304px] z-[100] flex items-center justify-center transition-all duration-300">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer shadow-[0_8px_32px_rgba(37,99,235,0.2)] hover:shadow-[0_12px_48px_rgba(37,99,235,0.35)] transition-all hover:scale-105 active:scale-95 group focus:outline-none"
                    aria-label="Toggle PICO Chatbot"
                >
                    {/* Double Orbital Rotating SVG Ring */}
                    <svg className="absolute inset-0 w-full h-full animate-spin [animation-duration:16s] pointer-events-none" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="46" fill="none" stroke="url(#skyGradient)" strokeWidth="1.5" strokeDasharray="30 20 10 40" strokeLinecap="round" />
                    </svg>
                    <svg className="absolute inset-0 w-full h-full animate-spin [animation-duration:10s] [animation-direction:reverse] pointer-events-none opacity-60" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="41" fill="none" stroke="url(#skyGradientInverse)" strokeWidth="1" strokeDasharray="15 35 40 10" strokeLinecap="round" />
                    </svg>

                    <defs>
                        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="50%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#4f46e5" />
                        </linearGradient>
                        <linearGradient id="skyGradientInverse" x1="100%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="50%" stopColor="#0ea5e9" />
                            <stop offset="100%" stopColor="#22d3ee" />
                        </linearGradient>
                    </defs>

                    {/* Radial Sky Blue core container */}
                    <div className="absolute inset-[4px] rounded-full bg-white border border-slate-200 flex items-center justify-center z-10 transition-colors group-hover:border-slate-300">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-inner group-hover:scale-95 transition-transform duration-300">
                            {isOpen ? (
                                <X size={20} className="text-white transform rotate-0 transition-transform duration-300" />
                            ) : (
                                <MessageSquare size={20} className="text-white transform group-hover:rotate-[360deg] transition-all duration-500" />
                            )}
                        </div>
                    </div>
                </button>
            </div>

            {/* SLIDE-UP GLASSMORPHIC PANEL */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.96 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="fixed bottom-24 left-6 md:left-[304px] w-[420px] max-w-[calc(100vw-2rem)] h-[620px] max-h-[calc(100vh-8rem)] rounded-[32px] border-[3px] border-blue-50/90 bg-white/98 backdrop-blur-md shadow-[0_24px_50px_rgba(37,99,235,0.18),0_4px_20px_rgba(0,0,0,0.03),inset_0_0_0_1px_rgba(255,255,255,0.7)] flex flex-col z-[100] overflow-hidden transition-all duration-300"
                    >
                        {/* PANEL HEADER */}
                        <div className="px-5 py-4 border-b border-slate-100 bg-white flex items-center justify-between relative">
                            {/* Blended Shaded Gradient Accent Line at the top of header */}
                            <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-500"></div>

                            <div className="flex items-center gap-3">
                                <div className="relative flex items-center justify-center">
                                    <div className="w-14 h-14 rounded-full bg-white border border-slate-200 p-1.5 flex items-center justify-center shadow-sm overflow-hidden transition-all duration-300 hover:scale-105">
                                        <img src="/assets/logo.png" alt="Company Logo" className="h-10 w-auto object-contain" />
                                    </div>
                                    <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse shadow-sm"></span>
                                </div>
                                <div>
                                    <h4 className="text-base font-extrabold bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-transparent tracking-wider uppercase leading-none">
                                        PICO
                                    </h4>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">
                                        {activeBranch === "KERALA" ? "ALAPPUZHA Suspended" : "Etah operations online"}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={handleClearChat}
                                    className="p-1.5 rounded-lg border border-slate-100 text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-colors shadow-sm bg-white"
                                    title="Reset chat grounding context"
                                >
                                    <RefreshCw size={14} />
                                </button>
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 rounded-lg border border-slate-100 text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-colors shadow-sm bg-white"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* MESSAGES HISTORY LOG */}
                        <div 
                            ref={chatContainerRef}
                            className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent bg-slate-50/30"
                        >
                            {messages.map((msg, index) => {
                                const isUser = msg.role === "user";
                                return (
                                    <div 
                                        key={index}
                                        className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
                                    >
                                        <div 
                                            className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                                                isUser 
                                                    ? "bg-gradient-to-br from-blue-50 to-blue-100/80 border border-blue-200/60 rounded-tr-none text-left text-blue-950 shadow-sm shadow-blue-500/5" 
                                                    : "bg-white border border-slate-200/80 rounded-tl-none text-left text-slate-800 shadow-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
                                            }`}
                                        >
                                            {formatMessageContent(msg.content, isUser)}
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {/* AI Typing Loader Indicator */}
                            {isLoading && (
                                <div className="flex w-full justify-start">
                                    <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-2 h-2 rounded-full bg-blue-600/80 animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-2 h-2 rounded-full bg-blue-600/60 animate-bounce"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* CONTEXT-AWARE PROMPT SUGGESTIONS PANEL */}
                        {suggestions.length > 0 && (
                            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/80">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                                    Context suggestions
                                </span>
                                <div className="flex flex-wrap gap-2 max-h-[85px] overflow-y-auto pr-1">
                                    {suggestions.map((suggestion, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSendMessage(suggestion)}
                                            className="text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50/60 hover:bg-blue-100/70 border border-blue-100/80 hover:border-blue-200/80 rounded-full px-3 py-1 cursor-pointer transition-all duration-200 truncate max-w-full text-left"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* INPUT PANEL FOOTER */}
                        <div className="p-4 border-t border-slate-100 bg-white">
                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage(input);
                                }}
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={
                                        activeBranch === "KERALA" 
                                            ? "Work suspend active in Kerala..." 
                                            : `Ask PICO (${activeTab} context)...`
                                    }
                                    disabled={activeBranch === "KERALA" || isLoading}
                                    className="flex-1 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500/80 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/20 text-slate-800 placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading || activeBranch === "KERALA"}
                                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 flex items-center justify-center text-white cursor-pointer shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 hover:scale-[1.03] active:scale-[0.97] transition-all disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed"
                                >
                                    <Send size={15} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CINEMATIC IMAGE PREVIEW LIGHTBOX */}
            <AnimatePresence>
                {previewImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center"
                        onClick={() => setPreviewImage(null)}
                    >
                        {/* Blurred dark backdrop */}
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

                        {/* Close button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setPreviewImage(null); }}
                            className="absolute top-6 right-6 z-[210] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95"
                            aria-label="Close preview"
                        >
                            <X size={20} />
                        </button>

                        {/* Cinematic image container */}
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="relative z-[205] w-[90vw] max-w-[900px] max-h-[80vh] flex flex-col items-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={previewImage.src}
                                alt={previewImage.alt}
                                className="w-full h-auto max-h-[72vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                                style={{ background: "#0f172a" }}
                            />
                            {previewImage.alt && (
                                <span className="mt-4 text-xs text-white/70 font-medium tracking-wider uppercase text-center max-w-[600px]">
                                    {previewImage.alt}
                                </span>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
