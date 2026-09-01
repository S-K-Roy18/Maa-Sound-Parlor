"use client";

import { motion, AnimatePresence } from "framer-motion";
import { WorldData } from "@/data/worlds";

interface BackgroundMediaProps {
  world: WorldData | null;
}

export function BackgroundMedia({ world }: BackgroundMediaProps) {
  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden bg-black">
      <AnimatePresence mode="popLayout">
        {world && (
          <motion.div
            key={world.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {world.mediaType === "video" ? (
              <video
                src={world.background}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <motion.img
                src={world.background}
                alt={world.title}
                className="w-full h-full object-cover"
                initial={{ scale: 1.05 }}
                animate={{ scale: 1.15 }}
                transition={{
                  duration: 20,
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
