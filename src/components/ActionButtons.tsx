"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Check, Copy } from "lucide-react";
import { WORLDS, WorldData } from "@/data/worlds";

interface ActionButtonsProps {
  onSelectWorld: (world: WorldData) => void;
  currentWorldId: string;
}

// WhatsApp SVG icon (official green brand)
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

export function ActionButtons({ onSelectWorld, currentWorldId }: ActionButtonsProps) {
  // 1. Rotating Duniya — reads emoji directly from world data (single source of truth)
  const [rotatingIndex, setRotatingIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingIndex((prev) => (prev + 1) % WORLDS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const rotatingWorld = WORLDS[rotatingIndex];

  // 2. WhatsApp Share — always shares main home URL
  const handleShare = () => {
    const text = "भाई, playlist नहीं है… पूरी दुनिया है यहाँ. एक बार अंदर आ 😭🎧\n\nhttps://live-maa-sound-parlor.vercel.app";
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  // 3. Support Me Modal
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportAmount, setSupportAmount] = useState<number | "custom">(20);
  const [customAmount, setCustomAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const upiId = "suryarahulroy321@okaxis";

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSupportUPI = () => {
    const amt = supportAmount === "custom" ? customAmount : supportAmount;
    if (!amt || isNaN(Number(amt)) || Number(amt) <= 0) return;
    const upiLink = `upi://pay?pa=${upiId}&pn=Maa%20Sound%20Parlour&am=${amt}&cu=INR`;
    window.open(upiLink, "_blank");
  };

  // Shared pill button classes — all three get identical width/height/alignment (no blur)
  const basePill =
    "w-36 h-9 flex items-center justify-center gap-1.5 bg-black/80 rounded-full transition-all shadow-lg overflow-hidden shrink-0";

  return (
    <>
      {/* Three equal-width pill buttons */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
        className="flex items-center justify-center gap-1.5 sm:gap-2 w-full flex-wrap"
      >

        {/* 1. Rotating Duniya */}
        <motion.button
          onClick={() => onSelectWorld(rotatingWorld)}
          className={`${basePill} border border-white/10 text-white/90 hover:bg-black hover:text-white`}
          title={rotatingWorld.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.45, ease: "easeOut" }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={rotatingWorld.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex items-center justify-center gap-1.5 w-full px-2"
            >
              <span className="text-sm shrink-0">{rotatingWorld.emoji}</span>
              <span className="font-hindi text-xs truncate">{rotatingWorld.title}</span>
            </motion.span>
          </AnimatePresence>
        </motion.button>

        {/* 2. WhatsApp Share */}
        <motion.button
          onClick={handleShare}
          className={`${basePill} border border-green-500/30 text-green-400 hover:bg-black hover:border-green-400 hover:text-green-300`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.55, ease: "easeOut" }}
        >
          <WhatsAppIcon className="w-4 h-4 shrink-0" />
          <span className="font-sans text-xs font-medium uppercase tracking-wider">Share</span>
        </motion.button>

        {/* 3. Support Me */}
        <motion.button
          onClick={() => setIsSupportOpen(true)}
          className={`${basePill} border border-brand-amber/30 text-brand-amber/90 hover:bg-black hover:border-brand-amber/50 hover:text-brand-amber`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.65, ease: "easeOut" }}
        >
          <Heart className="w-4 h-4 shrink-0" />
          <span className="font-sans text-xs font-medium uppercase tracking-wider">Support</span>
        </motion.button>
      </motion.div>

      {/* Support Modal */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isSupportOpen && (
            <>
            {/* Backdrop: solid tint, no blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSupportOpen(false)}
              className="fixed inset-0 bg-black/75 z-50 pointer-events-auto"
            />
            {/* Modal Box: bigger layout, no blur */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-97.5 overflow-hidden bg-[#141414] border border-white/15 rounded-3xl shadow-2xl z-50 pointer-events-auto"
            >
              {/* Header */}
              <div className="relative p-4 text-center border-b border-white/10">
                <button
                  onClick={() => setIsSupportOpen(false)}
                  className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-1"
                >
                  ✕
                </button>
                <div className="flex justify-center mb-2">
                  <div className="w-11 h-11 rounded-full bg-brand-amber/15 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-brand-amber" />
                  </div>
                </div>
                <h3 className="text-white text-lg font-medium">Support This Project</h3>
                <p className="text-white/60 text-xs mt-1 leading-relaxed">
                  Enjoying this little world?<br />You can support its creation.
                </p>
              </div>

              {/* QR Code — larger layout & clear visibility */}
              <div className="p-4 flex flex-col items-center border-b border-white/10 bg-black/30">
                <div className="bg-white p-2.5 rounded-2xl mb-3 shadow-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/Duniya/upi-qr.jpeg"
                    alt="UPI QR Code"
                    width={220}
                    height={220}
                    className="w-44 h-44 sm:w-52 sm:h-52 object-contain rounded-xl block"
                  />
                </div>
                <button
                  onClick={handleCopyUpi}
                  className="flex items-center gap-2 text-white/60 hover:text-white text-xs transition-colors py-1 px-3 rounded-full hover:bg-white/5"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? "UPI ID copied ✓" : "Copy UPI ID"}
                </button>
              </div>

              {/* Amount Selection */}
              <div className="p-4 bg-white/2">
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {([20, 50, 100] as number[]).map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setSupportAmount(amt)}
                      className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        supportAmount === amt
                          ? "bg-brand-amber text-black"
                          : "bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                  <button
                    onClick={() => setSupportAmount("custom")}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      supportAmount === "custom"
                        ? "bg-brand-amber text-black"
                        : "bg-white/5 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    Custom
                  </button>
                </div>

                <AnimatePresence>
                  {supportAmount === "custom" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mb-4 overflow-hidden"
                    >
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50">₹</span>
                        <input
                          type="number"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="w-full bg-white/5 border border-white/15 rounded-xl py-2.5 pl-8 pr-3 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-amber/50"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleSupportUPI}
                  className="w-full py-3 bg-white/10 hover:bg-brand-amber hover:text-black text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Heart className="w-4 h-4" />
                  Support via UPI
                </button>
              </div>
            </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
