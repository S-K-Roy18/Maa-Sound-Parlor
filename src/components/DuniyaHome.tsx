"use client";

import { useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { WORLDS, WorldData } from "@/data/worlds";
import { LogIn } from "lucide-react";

interface DuniyaHomeProps {
  onSelectWorld: (world: WorldData) => void;
}

export function DuniyaHome({ onSelectWorld }: DuniyaHomeProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  // Parallax for the massive background text
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -300]);

  // Stagger animation for the grid
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 80,
        damping: 15,
        duration: 0.8 
      }
    },
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-24 px-6 sm:px-12 pb-32 relative z-10 overflow-x-hidden perspective-1000">
      
      {/* Crazy Background Marquee Text */}
      <div className="fixed inset-0 pointer-events-none flex flex-col justify-center overflow-hidden z-[-1] opacity-5">
        <motion.h1 style={{ y: y1 }} className="text-[25vw] font-hindi whitespace-nowrap text-white leading-none font-black select-none">
          साउंड पार्लर साउंड पार्लर साउंड पार्लर
        </motion.h1>
        <motion.h1 style={{ y: y2, x: -500 }} className="text-[25vw] font-hindi whitespace-nowrap text-white leading-none font-black select-none mt-[-5vw]">
          दुनिया दुनिया दुनिया दुनिया दुनिया
        </motion.h1>
      </div>

      {/* Main Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-24 relative"
      >
        <h1 className="text-7xl md:text-9xl font-hindi text-white mb-6 text-cinematic tracking-tight">
          माँ साउंड पार्लर
        </h1>

        <div className="flex items-center justify-center gap-8 text-white/50 mb-12">
          <motion.div 
            initial={{ width: 0 }} animate={{ width: 100 }} transition={{ duration: 1, delay: 1 }}
            className="h-[1px] bg-gradient-to-r from-transparent to-white"
          />
          <motion.span 
            initial={{ opacity: 0, letterSpacing: "0em" }} 
            animate={{ opacity: 1, letterSpacing: "1em" }} 
            transition={{ duration: 1.5, delay: 1 }}
            className="text-xl font-light pl-4" // pl-4 to offset the tracking
          >
            DUNIYA
          </motion.span>
          <motion.div 
            initial={{ width: 0 }} animate={{ width: 100 }} transition={{ duration: 1, delay: 1 }}
            className="h-[1px] bg-gradient-to-l from-transparent to-white"
          />
        </div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="text-3xl md:text-5xl font-hindi text-brand-mustard text-cinematic animate-pulse"
        >
          "आज कहाँ बैठोगे?"
        </motion.h2>
      </motion.div>

      {/* Grid of Worlds */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-wrap justify-center gap-6 max-w-[1500px] w-full mx-auto"
        style={{ perspective: "1500px" }}
      >
        {WORLDS.map((world, i) => {
          const isHovered = hoveredId === world.id;
          
          return (
            <motion.div
              key={world.id}
              variants={itemVariants}
              onHoverStart={() => setHoveredId(world.id)}
              onHoverEnd={() => setHoveredId(null)}
              onClick={() => onSelectWorld(world)}
              className={`group relative w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] aspect-[4/3] rounded-xl overflow-hidden cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 border-2 ${isHovered ? 'border-brand-amber shadow-[0_0_40px_rgba(255,191,0,0.4)] z-50' : 'border-transparent z-10'}`}
            >
              {/* Note: NO OVERLAYS. Original media only, as requested. */}
              {world.mediaType === "video" ? (
                <video
                  src={world.background}
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay={isHovered}
                />
              ) : (
                <img
                  src={world.background}
                  alt={world.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              
              {/* Information overlay - only visible on hover so the media is 100% visible most of the time */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end"
                  >
                    <h3 className="text-4xl font-hindi text-white mb-2 text-cinematic drop-shadow-[0_4px_24px_rgba(0,0,0,1)]">
                      {world.title}
                    </h3>
                    <p className="text-white font-hindi text-lg drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                      {world.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Title when NOT hovered (minimal) */}
              <AnimatePresence>
                {!isHovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center p-6"
                  >
                    <h3 className="text-5xl font-hindi text-white text-center text-cinematic drop-shadow-[0_0_30px_rgba(0,0,0,1)] mix-blend-overlay">
                      {world.title}
                    </h3>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Enter Icon */}
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: isHovered ? 1 : 0, opacity: isHovered ? 1 : 0 }}
                className="absolute top-4 right-4 bg-brand-amber p-3 rounded-full text-black shadow-[0_0_20px_rgba(255,191,0,0.8)]"
              >
                <LogIn className="w-5 h-5" />
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
