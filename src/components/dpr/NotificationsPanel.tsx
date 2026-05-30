"use client";

import React, { useState, useEffect } from 'react';
import { X, Bell, Clock, CheckCircle2, AlertTriangle, PartyPopper, CalendarDays, Wallet, Box } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function NotificationsPanel({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    
    // Intelligence Logic for Notifications
    const currentHour = new Date().getHours();
    const generated = [];

    // 1. Time-based DPR reminders
    if (currentHour < 11) {
      generated.push({
        id: 'dpr-morning',
        type: 'reminder',
        icon: <Clock size={16} className="text-amber-600" strokeWidth={2.5} />,
        title: "Morning DPR Due Soon",
        message: "It's almost 11 AM. Please submit your morning progress report.",
        time: "Just now",
        color: "bg-[#fcf6bd]" // Yellow tint
      });
    } else if (currentHour >= 11 && currentHour < 16) {
      generated.push({
        id: 'dpr-evening',
        type: 'reminder',
        icon: <Clock size={16} className="text-amber-600" strokeWidth={2.5} />,
        title: "Evening DPR Due Soon",
        message: "It's almost 4 PM. Please wrap up the day's progress report.",
        time: "Just now",
        color: "bg-[#fcf6bd]" 
      });
    } else if (currentHour >= 16) {
      generated.push({
        id: 'dpr-eod',
        type: 'reminder',
        icon: <CheckCircle2 size={16} className="text-emerald-700" strokeWidth={2.5} />,
        title: "Day Wrapped Up",
        message: "Great job today! Make sure all tools are secured.",
        time: "1 hour ago",
        color: "bg-[#d8f3dc]" // Green tint
      });
    }

    // 2. Attendance Streaks
    // Let's randomize a bit to make it feel alive, but consistently positive
    const streak = Math.floor(Math.random() * 5) + 5; // 5 to 9 days
    generated.push({
      id: 'attendance-streak',
      type: 'achievement',
      icon: <PartyPopper size={16} className="text-slate-900" strokeWidth={2.5} />,
      title: "Attendance Streak!",
      message: `Hurray! You have a ${streak} day present streak. Keep it up!`,
      time: "2 hours ago",
      color: "bg-[#ffc8dd]" // Pink tint
    });

    // 3. Approvals
    generated.push({
      id: 'approval-bills',
      type: 'approval',
      icon: <Wallet size={16} className="text-emerald-700" strokeWidth={2.5} />,
      title: "Labour Bill Approved",
      message: "Gang B payout of ₹12,500 has been approved by the Project Manager.",
      time: "4 hours ago",
      color: "bg-[#d8f3dc]"
    });

    // 4. Material Status
    generated.push({
      id: 'material-status',
      type: 'update',
      icon: <Box size={16} className="text-indigo-700" strokeWidth={2.5} />,
      title: "Material Arriving",
      message: "50 bags of cement arriving at Sarnau WTP site by 2 PM tomorrow.",
      time: "Yesterday",
      color: "bg-[#bde0fe]" // Blue tint
    });

    setNotifications(generated);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-[100]"
          />
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-[80vh] bg-[#F2F5F8] border-t-[1.5px] border-x-[1.5px] border-slate-900 rounded-t-[32px] z-[110] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b-[1.5px] border-slate-900 bg-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ffc8dd] border-[1.5px] border-slate-900 flex items-center justify-center shadow-[0_2px_0_rgba(15,23,42,1)]">
                  <Bell size={18} className="text-slate-900" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 uppercase leading-none">Notifications</h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">{notifications.length} New Alerts</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 border-[1.5px] border-slate-900 flex items-center justify-center shadow-[0_2px_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-0.5 transition-all"
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 custom-scrollbar bg-slate-50">
              {notifications.map((notif, idx) => (
                <motion.div 
                  key={notif.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 + 0.1 }}
                  className="p-4 rounded-[20px] border-[1.5px] border-slate-900 bg-white shadow-[0_3px_0_rgba(15,23,42,1)] flex gap-4"
                >
                  <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center border-[1.5px] border-slate-900 shadow-[0_2px_0_rgba(15,23,42,1)] ${notif.color}`}>
                    {notif.icon}
                  </div>
                  <div className="pt-0.5 flex-1">
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <h3 className="text-sm font-black text-slate-900 leading-tight">{notif.title}</h3>
                      <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">{notif.time}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-600 leading-snug">{notif.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Mark all as read footer button */}
            <div className="p-4 bg-white border-t-[1.5px] border-slate-900 shrink-0">
               <button 
                 onClick={onClose}
                 className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-sm uppercase tracking-wide border-[1.5px] border-slate-900 shadow-[0_3px_0_rgba(15,23,42,0.3)] active:shadow-none active:translate-y-1 transition-all"
               >
                 Mark All As Read
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
