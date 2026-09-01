"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Users } from "lucide-react";

interface TopBarProps {
  onBack: () => void;
}

export function TopBar({ onBack }: TopBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
      className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20"
    >
      <button
        onClick={onBack}
        className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 font-hindi text-lg"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        दुनिया
      </button>

      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full border border-white/10 text-white/80 text-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <Users className="w-3 h-3 opacity-50" />
          <span className="font-sans text-xs tracking-wider">29 online</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 items-end">
        <a
          href="https://open.spotify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 hover:text-white text-xs tracking-wider font-sans uppercase transition-colors flex items-center gap-1"
        >
          Spotify ↗
        </a>
        <a
          href="https://music.youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 hover:text-white text-xs tracking-wider font-sans uppercase transition-colors flex items-center gap-1"
        >
          YT Music ↗
        </a>
      </div>
    </motion.div>
  );
}
