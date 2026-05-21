"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    MessageSquare, X, Send, RefreshCw, Sparkles, 
    TrendingUp, Coins, Database, AlertTriangle, ArrowRight 
} from "lucide-react";
import { SCHEME_MAP } from "@/lib/scheme-data";

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
            content: "Hello! I am your **JJM PMX Copilot**. I am connected to the live database and grounded in your active view context.\n\nAsk me anything about pipe progress, RA bills, inventory stock ledger, or active site red-flags!" 
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    
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

        } catch (err) {
            console.error("Chat error:", err);
            setIsLoading(false);
            setMessages(prev => [
                ...prev,
                { 
                    role: "assistant", 
                    content: "An operational error occurred while connecting to the intelligence engine. Please ensure your connection is active." 
                }
            ]);
        }
    };

    const handleClearChat = () => {
        setMessages([
            { 
                role: "assistant", 
                content: "Chat history cleared. Grounding session reinitialized. Ask me anything!" 
            }
        ]);
    };

    // Format markdown helper to handle bold and bullet lists elegantly
    const formatMessageContent = (text: string) => {
        return text.split("\n").map((line, idx) => {
            let renderedLine = line;
            
            // Bullet lists
            if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
                const content = line.trim().substring(2);
                return (
                    <li key={idx} className="ml-4 list-disc text-slate-300 my-1 leading-relaxed text-xs">
                        {renderBoldText(content)}
                    </li>
                );
            }
            
            // Numbered lists
            const numMatch = line.trim().match(/^(\d+)\.\s(.*)/);
            if (numMatch) {
                return (
                    <li key={idx} className="ml-4 list-decimal text-slate-300 my-1 leading-relaxed text-xs">
                        {renderBoldText(numMatch[2])}
                    </li>
                );
            }

            // Paragraph layout
            return (
                <p key={idx} className="mb-2 leading-relaxed text-xs md:text-[13px] last:mb-0">
                    {renderBoldText(renderedLine)}
                </p>
            );
        });
    };

    const renderBoldText = (text: string) => {
        const parts = text.split(/\*\*(.*?)\*\*/g);
        return parts.map((part, index) => 
            index % 2 === 1 ? <strong key={index} className="text-cyan-400 font-bold">{part}</strong> : part
        );
    };

    return (
        <>
            {/* FLOATING ACTION BUTTON (FAB) - Brand Shady Sky Art with Revolving SVG Orbit */}
            <div className="fixed bottom-6 right-6 z-[100] flex items-center justify-center">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer shadow-[0_8px_32px_rgba(14,165,233,0.3)] hover:shadow-[0_12px_48px_rgba(14,165,233,0.5)] transition-all hover:scale-105 active:scale-95 group focus:outline-none"
                    aria-label="Toggle JJM Copilot"
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
                    <div className="absolute inset-[4px] rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center z-10 transition-colors group-hover:border-slate-700">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-400/90 to-blue-600/90 flex items-center justify-center shadow-inner group-hover:scale-95 transition-transform duration-300">
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
                        className="fixed bottom-24 right-6 w-[420px] max-w-[calc(100vw-2rem)] h-[620px] max-h-[calc(100vh-8rem)] rounded-2xl border border-slate-800/80 bg-slate-950/95 backdrop-blur-xl shadow-[0_24px_64px_rgba(0,0,0,0.6)] flex flex-col z-[100] overflow-hidden"
                    >
                        {/* PANEL HEADER */}
                        <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center shadow-md">
                                        <Sparkles size={14} className="text-white" />
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-950 animate-pulse"></span>
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-slate-200 tracking-wider uppercase leading-none">
                                        JJM Copilot
                                    </h4>
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1 block">
                                        {activeBranch === "KERALA" ? "ALAPPUZHA Suspended" : "Etah operations online"}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={handleClearChat}
                                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                                    title="Reset chat grounding context"
                                >
                                    <RefreshCw size={14} />
                                </button>
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* MESSAGES HISTORY LOG */}
                        <div 
                            ref={chatContainerRef}
                            className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
                        >
                            {messages.map((msg, index) => {
                                const isUser = msg.role === "user";
                                return (
                                    <div 
                                        key={index}
                                        className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
                                    >
                                        <div 
                                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-slate-200 shadow-md ${
                                                isUser 
                                                    ? "bg-gradient-to-br from-blue-600/90 to-indigo-600/95 border border-blue-500/20 rounded-tr-none text-right" 
                                                    : "bg-slate-900/60 border border-slate-800/80 rounded-tl-none text-left"
                                            }`}
                                        >
                                            {formatMessageContent(msg.content)}
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {/* AI Typing Loader Indicator */}
                            {isLoading && (
                                <div className="flex w-full justify-start">
                                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 shadow-md flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-2 h-2 rounded-full bg-cyan-400/80 animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-2 h-2 rounded-full bg-cyan-400/60 animate-bounce"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* CONTEXT-AWARE PROMPT SUGGESTIONS PANEL */}
                        {suggestions.length > 0 && (
                            <div className="px-5 py-2 border-t border-slate-900/60 bg-slate-950/40">
                                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest block mb-2">
                                    Context suggestions
                                </span>
                                <div className="flex flex-wrap gap-2 max-h-[85px] overflow-y-auto pr-1">
                                    {suggestions.map((suggestion, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSendMessage(suggestion)}
                                            className="text-[10px] font-medium text-slate-400 hover:text-cyan-400 bg-slate-900/50 hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-500/30 rounded-full px-3 py-1 cursor-pointer transition-all duration-200 truncate max-w-full text-left"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* INPUT PANEL FOOTER */}
                        <div className="p-4 border-t border-slate-800 bg-slate-900/20">
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
                                            : `Ask Copilot (${activeTab} context)...`
                                    }
                                    disabled={activeBranch === "KERALA" || isLoading}
                                    className="flex-1 bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500/30 text-white placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading || activeBranch === "KERALA"}
                                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 flex items-center justify-center text-white cursor-pointer shadow-md shadow-sky-900/10 hover:shadow-cyan-900/20 hover:scale-[1.03] active:scale-[0.97] transition-all disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed"
                                >
                                    <Send size={15} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
