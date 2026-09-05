"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { WorldData } from "@/data/worlds";
import { DuniyaHome } from "@/components/DuniyaHome";
import { WorldExperience } from "@/components/WorldExperience";

import { WORLDS } from "@/data/worlds";

export default function Home() {
  const [activeWorld, setActiveWorld] = useState<WorldData | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedWorldId = localStorage.getItem("duniya_active_world_id");
    if (savedWorldId) {
      const world = WORLDS.find(w => w.id === savedWorldId);
      if (world) {
        setActiveWorld(world);
      }
    }
    setIsHydrated(true);
  }, []);

  const handleSelectWorld = (world: WorldData) => {
    setActiveWorld(world);
    localStorage.setItem("duniya_active_world_id", world.id);
  };

  const handleExitWorld = () => {
    setActiveWorld(null);
    localStorage.removeItem("duniya_active_world_id");
  };

  if (!isHydrated) {
    return <main className="relative w-full min-h-screen bg-black" />;
  }

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
            onSelectWorld={handleSelectWorld}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
