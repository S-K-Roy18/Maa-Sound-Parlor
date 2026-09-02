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
          className="text-white/50 hover:text-[#1DB954] text-xs tracking-wider font-sans uppercase transition-colors flex items-center gap-2"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.54-1.02.72-1.56.3z" />
          </svg>
          Spotify ↗
        </a>
        <a
          href="https://music.youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 hover:text-[#FF0000] text-xs tracking-wider font-sans uppercase transition-colors flex items-center gap-2"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          YT Music ↗
        </a>
      </div>
    </motion.div>
  );
}
