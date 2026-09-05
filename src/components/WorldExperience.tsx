"use client";

import { motion } from "framer-motion";
import { WorldData } from "@/data/worlds";
import { BackgroundMedia } from "./BackgroundMedia";
import { WorldTitle } from "./WorldTitle";
import { TopBar } from "./TopBar";
import { MusicPlayer } from "./MusicPlayer";

interface WorldExperienceProps {
  world: WorldData;
  onExit: () => void;
  onSelectWorld: (world: WorldData) => void;
}

export function WorldExperience({ world, onExit, onSelectWorld }: WorldExperienceProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-10"
    >
      <BackgroundMedia world={world} />
      
      <TopBar 
        onBack={onExit} 
        currentWorldId={world.id} 
        onSelectWorld={onSelectWorld} 
      />
      
      <WorldTitle world={world} />
      
      <MusicPlayer playlistId={world.playlistId} />
    </motion.div>
  );
}
