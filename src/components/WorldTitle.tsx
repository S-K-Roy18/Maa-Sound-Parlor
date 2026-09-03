"use client";

import { motion } from "framer-motion";
import { WorldData } from "@/data/worlds";
import { LiveChat } from "./LiveChat";

interface WorldTitleProps {
  world: WorldData;
}

export function WorldTitle({ world }: WorldTitleProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 p-4">
      <motion.div
        key={`title-${world.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        className="text-center"
      >
        <h1 className="text-6xl md:text-8xl font-hindi text-white mb-4 text-cinematic tracking-wide">
          {world.title}
        </h1>
        {world.subtitle && (
          <p className="text-xl md:text-2xl font-hindi text-white/90 text-cinematic mb-2">
            {world.subtitle}
          </p>
        )}
        <p className="text-lg md:text-xl font-hindi text-brand-cream/80 text-cinematic mt-4 max-w-lg mx-auto">
          {world.description}
        </p>
        
        <div className="pointer-events-auto flex justify-center">
          <LiveChat />
        </div>
      </motion.div>
    </div>
  );
}
