"use client";

import { useEffect, useRef, useState } from "react";
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
  const [upperContentShift, setUpperContentShift] = useState(0);
  const appliedShiftRef = useRef(0);

  useEffect(() => {
    const experience = document.querySelector<HTMLElement>('[data-world-experience="true"]');
    if (!experience) return;

    const upperContent = experience.querySelector<HTMLElement>('[data-world-upper-content="true"]');
    const actionControls = experience.querySelector<HTMLElement>('[data-world-actions="true"]');
    if (!upperContent || !actionControls) return;

    const calculateUpperContentShift = () => {
      const previousTransform = upperContent.style.transform;
      upperContent.style.transform = "none";
      const upperContentBottom = upperContent.getBoundingClientRect().bottom;
      const actionControlsTop = actionControls.getBoundingClientRect().top;
      upperContent.style.transform = previousTransform;

      const minimumSafeGap = 12;
      const requiredShift = Math.max(
        0,
        Math.ceil(upperContentBottom + minimumSafeGap - actionControlsTop)
      );

      if (requiredShift !== appliedShiftRef.current) {
        appliedShiftRef.current = requiredShift;
        setUpperContentShift(requiredShift);
      }
    };

    const scheduleCalculation = () => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(calculateUpperContentShift);
      });
    };

    const initialFrame = window.requestAnimationFrame(calculateUpperContentShift);
    const settledCalculation = window.setTimeout(calculateUpperContentShift, 1200);
    const resizeObserver = new ResizeObserver(scheduleCalculation);
    resizeObserver.observe(upperContent);
    resizeObserver.observe(actionControls);
    window.addEventListener("resize", scheduleCalculation);
    window.addEventListener("orientationchange", scheduleCalculation);

    return () => {
      window.cancelAnimationFrame(initialFrame);
      window.clearTimeout(settledCalculation);
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleCalculation);
      window.removeEventListener("orientationchange", scheduleCalculation);
    };
  }, [world.id]);

  const upperContentStyle = upperContentShift
    ? { transform: `translateY(-${upperContentShift}px)` }
    : undefined;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-10"
      data-world-experience="true"
    >
      <BackgroundMedia world={world} />
      
      <TopBar 
        onBack={onExit} 
        currentWorldId={world.id} 
        onSelectWorld={onSelectWorld} 
      />
      
      <WorldTitle world={world} style={upperContentStyle} />
      
      <MusicPlayer 
        playlistId={world.playlistId}
        onSelectWorld={onSelectWorld}
        currentWorldId={world.id}
      />
    </motion.div>
  );
}
