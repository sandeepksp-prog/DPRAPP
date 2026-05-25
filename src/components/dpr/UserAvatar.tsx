"use client";

import React, { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { micah } from '@dicebear/collection';

export interface AvatarTraits {
  skinTone?: 'light' | 'medium' | 'dark';
  hairStyle?: 'short' | 'long' | 'bald' | 'pixie' | 'curly' | 'braids' | 'turban';
  hairColor?: 'black' | 'brown' | 'blonde' | 'grey';
  hasBeard?: boolean;
  hasGlasses?: boolean;
  gender?: 'male' | 'female';
}

interface UserAvatarProps {
  seed: string;
  gender?: 'male' | 'female';
  traits?: AvatarTraits;
  size?: number;
  className?: string;
}

const THEME_COLORS = ['bde0fe', 'ffc8dd', 'fcf6bd', 'd8f3dc', 'cdb4db', 'ff9f1c'];

// Deterministic random number generator based on seed string
function seededRandom(seedStr: string) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return () => {
    hash = Math.imul(hash ^ (hash >>> 15), 1597334677);
    hash = Math.imul(hash ^ (hash >>> 15), 1597334677);
    return ((hash ^ (hash >>> 15)) >>> 0) / 4294967296;
  };
}

export default function UserAvatar({ seed, gender, traits, size = 48, className = "" }: UserAvatarProps) {
  const svgContent = useMemo(() => {
    const random = seededRandom(seed);
    
    // 1. Theme Colors
    const bgIndex = Math.floor(random() * THEME_COLORS.length);
    let clothesIndex = Math.floor(random() * THEME_COLORS.length);
    if (clothesIndex === bgIndex) clothesIndex = (clothesIndex + 1) % THEME_COLORS.length;

    // 2. Base Config
    let options: any = {
      seed,
      size,
      backgroundColor: [THEME_COLORS[bgIndex]],
      clothingColor: [THEME_COLORS[clothesIndex]],
      radius: 50,
    };

    // 3. Apply AI Extracted Traits if available
    if (traits) {
      // Skin Tone
      if (traits.skinTone === 'light') options.baseColor = ['F9C9B6'];
      else if (traits.skinTone === 'medium') options.baseColor = ['AC6651'];
      else if (traits.skinTone === 'dark') options.baseColor = ['77311D'];

      // Hair Color
      if (traits.hairColor === 'black') options.hairColor = ['000000'];
      else if (traits.hairColor === 'brown') options.hairColor = ['77311D'];
      else if (traits.hairColor === 'blonde') options.hairColor = ['F4D150'];
      else if (traits.hairColor === 'grey') options.hairColor = ['E0E0E0'];

      // Hair Style
      const resolvedGender = traits.gender || gender;
      if (traits.hairStyle === 'bald') options.hair = ['mrClean'];
      else if (traits.hairStyle === 'pixie') options.hair = ['pixie'];
      else if (traits.hairStyle === 'full' || traits.hairStyle === 'long') options.hair = ['full'];
      else if (traits.hairStyle === 'braids') options.hair = ['braids'];
      else if (traits.hairStyle === 'turban') options.hair = ['turban'];
      else {
        // Fallback for 'short' based on gender
        if (resolvedGender === 'female') options.hair = ['pixie'];
        else options.hair = ['fonze', 'dougFunny'];
      }

      // Facial Features
      if (traits.hasBeard) {
        options.facialHair = ['beard'];
        options.facialHairProbability = 100;
      }
      if (traits.hasGlasses) {
        options.glasses = ['square', 'round'];
        options.glassesProbability = 100;
      }
    } else {
      // Fallback if no traits provided (e.g. before onboarding)
      options.baseColor = ['F9C9B6', 'AC6651', '77311D'];
      options.hairColor = ['000000', '77311D', 'FC909F', 'F4D150'];
      if (gender === 'female') {
        options.hair = ['pixie', 'full'];
      } else if (gender === 'male') {
        options.hair = ['fonze', 'mrClean', 'dougFunny'];
      }
    }

    const avatar = createAvatar(micah, options);
    return avatar.toString();
  }, [seed, gender, traits, size]);

  return (
    <div 
      className={`rounded-full overflow-hidden border-[1.5px] border-slate-900 shadow-[0_2px_0_rgba(15,23,42,1)] bg-white flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
