"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { WorldData } from "@/data/worlds";
import { DuniyaHome } from "@/components/DuniyaHome";
import { WorldExperience } from "@/components/WorldExperience";

export default function Home() {
  const [activeWorld, setActiveWorld] = useState<WorldData | null>(null);

  const handleSelectWorld = (world: WorldData) => {
    setActiveWorld(world);
  };

  const handleExitWorld = () => {
    setActiveWorld(null);
  };

  return (
    <main className="relative w-full min-h-screen">
      <AnimatePresence mode="wait">
        {!activeWorld ? (
          <DuniyaHome key="home" onSelectWorld={handleSelectWorld} />
        ) : (
          <WorldExperience 
            key={`world-${activeWorld.id}`} 
            world={activeWorld} 
            onExit={handleExitWorld} 
          />
        )}
      </AnimatePresence>
    </main>
  );
}
