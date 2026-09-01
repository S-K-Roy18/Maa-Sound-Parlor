"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, SkipForward, SkipBack, 
  Volume2, VolumeX, Disc3, Maximize2, Minimize2 
} from "lucide-react";
import { songMetadataOverride } from "@/data/songMetadata";

interface MusicPlayerProps {
  playlistId: string;
}

export function MusicPlayer({ playlistId }: MusicPlayerProps) {
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const [currentSong, setCurrentSong] = useState({
    title: "Loading...",
    artist: "...",
  });
  
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const updateSongData = useCallback((playerInstance: any) => {
    if (!playerInstance) return;
    try {
      const data = playerInstance.getVideoData();
      if (data && data.video_id) {
        const override = songMetadataOverride[data.video_id];
        setCurrentSong({
          title: override?.title || data.title || "Unknown Song",
          artist: override?.artist || override?.singer || data.author || "Unknown Artist",
        });
      }
    } catch (e) {
      console.error("Error getting video data", e);
    }
  }, []);

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    setPlayer(event.target);
    event.target.setVolume(volume);
    
    // Try to play immediately if the browser allows it
    event.target.playVideo();
    
    updateSongData(event.target);
  };

  const onPlayerStateChange: YouTubeProps["onStateChange"] = (event) => {
    const state = event.data;
    
    // -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    if (state === 1) { // Playing
      setIsPlaying(true);
      setAutoplayBlocked(false);
      setDuration(event.target.getDuration());
      updateSongData(event.target);
      
      if (progressInterval.current) clearInterval(progressInterval.current);
      progressInterval.current = setInterval(() => {
        setProgress(event.target.getCurrentTime());
      }, 1000);
    } else {
      setIsPlaying(false);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      
      // If it's unstarted and we tried to play, autoplay might be blocked
      if (state === -1 && !isPlaying) {
        // We could assume autoplay is blocked if it stays in -1 for a while,
        // but for now, we rely on user interaction to start it.
      }
    }
  };

  const onPlayerError: YouTubeProps["onError"] = (event) => {
    console.error("YouTube Player Error:", event.data);
    // 150 = Video not available in embedded player. Move to next.
    if (player) player.nextVideo();
  };

  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
      setAutoplayBlocked(false);
    }
  };

  const nextTrack = () => {
    if (player) player.nextVideo();
  };

  const prevTrack = () => {
    if (player) player.previousVideo();
  };

  const toggleMute = () => {
    if (!player) return;
    if (isMuted) {
      player.unMute();
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input (though we don't have inputs here)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
          nextTrack();
          break;
        case "ArrowLeft":
          prevTrack();
          break;
        case "m":
        case "M":
          toggleMute();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [player, isPlaying, isMuted, togglePlay]);

  // Clean up interval
  useEffect(() => {
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, []);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <>
      {/* Hidden YouTube Player */}
      <div className="hidden">
        <YouTube
          videoId=""
          opts={{
            height: "0",
            width: "0",
            playerVars: {
              listType: "playlist",
              list: playlistId,
              autoplay: 1,
              controls: 0,
              disablekb: 1,
              fs: 0,
              iv_load_policy: 3,
              modestbranding: 1,
              rel: 0,
            },
          }}
          onReady={onPlayerReady}
          onStateChange={onPlayerStateChange}
          onError={onPlayerError}
        />
      </div>

      {/* Floating UI */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-4"
      >
        {autoplayBlocked && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center mb-4"
          >
            <button 
              onClick={togglePlay}
              className="bg-brand-amber text-black px-6 py-2 rounded-full font-hindi font-bold shadow-lg hover:bg-yellow-400 transition-colors animate-pulse"
            >
              गाना चलाएँ
            </button>
          </motion.div>
        )}

        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 shadow-2xl transition-all duration-500">
          
          {/* Top row: Minimize button */}
          <div className="flex justify-end mb-1">
            <button 
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white/40 hover:text-white transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {!isMinimized && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                {/* Now Playing Info */}
                <div className="flex items-center gap-4 mb-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                    <Disc3 className="w-6 h-6 text-brand-amber/80" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h3 className="text-white font-medium text-sm truncate">
                      {currentSong.title}
                    </h3>
                    <p className="text-white/60 text-xs truncate">
                      {currentSong.artist}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-2 group cursor-pointer" onClick={(e) => {
                  if (!player || !duration) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  player.seekTo(pos * duration, true);
                  setProgress(pos * duration);
                }}>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden relative">
                    <div 
                      className="absolute top-0 left-0 h-full bg-brand-amber transition-all duration-300 ease-linear"
                      style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] text-white/40 font-mono">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <button 
              onClick={toggleMute}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={prevTrack}
                className="p-2 text-white/80 hover:text-white transition-colors"
              >
                <SkipBack className="w-6 h-6 fill-current" />
              </button>
              
              <button 
                onClick={togglePlay}
                className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors border border-white/20"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current ml-1" />
                )}
              </button>
              
              <button 
                onClick={nextTrack}
                className="p-2 text-white/80 hover:text-white transition-colors"
              >
                <SkipForward className="w-6 h-6 fill-current" />
              </button>
            </div>
            
            {/* Empty space to balance the mute button on the left */}
            <div className="w-9"></div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
