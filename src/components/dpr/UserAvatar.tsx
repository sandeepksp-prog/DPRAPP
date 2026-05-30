"use client";

import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';

interface UserAvatarProps {
  seed?: string;
  size?: number;
  className?: string;
}

export default function UserAvatar({ seed, size = 48, className = "" }: UserAvatarProps) {
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

  useEffect(() => {
    // Try to load user profile from localStorage to see if an avatar was saved
    try {
      const stored = localStorage.getItem('dpr_user_profile');
      if (stored) {
        const profile = JSON.parse(stored);
        if (profile.avatar) {
          setAvatarSrc(profile.avatar);
        }
      }
    } catch (e) {
      console.error('Error loading avatar from local storage', e);
    }
  }, []);

  return (
    <div 
      className={`rounded-full overflow-hidden border-[1.5px] border-slate-900 bg-slate-50 flex items-center justify-center shadow-[2px_2px_0_rgba(15,23,42,1)] ${className}`}
      style={{ width: size, height: size }}
    >
      {avatarSrc ? (
        <img src={avatarSrc} alt={seed || "User Avatar"} className="w-full h-full object-cover" />
      ) : (
        <User size={size * 0.5} className="text-slate-400" />
      )}
    </div>
  );
}
