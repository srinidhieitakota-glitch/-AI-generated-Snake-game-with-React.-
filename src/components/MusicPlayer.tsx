import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { DUMMY_TRACKS } from '@/src/constants';
import { motion, AnimatePresence } from 'motion/react';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      const newTime = (value[0] / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
  };

  return (
    <div className="w-full max-w-[400px] bg-black border-2 border-[#ff00ff]/30 p-6 shadow-[0_0_30px_rgba(255,0,255,0.05)] relative overflow-hidden">
      {/* Glitch lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-[#ff00ff]/20 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#ff00ff]/20 animate-pulse" />

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      <div className="flex flex-col gap-8">
        {/* Track Info */}
        <div className="flex items-center gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="relative w-24 h-24 flex-shrink-0 border-2 border-[#00ffff]"
            >
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                className="w-full h-full object-cover grayscale contrast-125"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[#00ffff]/10 mix-blend-overlay" />
              {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="flex gap-1 items-end h-8">
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [4, 24, 4] }}
                        transition={{ repeat: Infinity, duration: 0.4, delay: i * 0.1 }}
                        className="w-1 bg-[#ff00ff]"
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          
          <div className="flex flex-col overflow-hidden space-y-1">
            <motion.h3 
              key={currentTrack.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-[#00ffff] truncate tracking-tighter uppercase glitch-text"
              data-text={currentTrack.title}
            >
              {currentTrack.title}
            </motion.h3>
            <motion.p 
              key={currentTrack.artist}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] text-[#ff00ff] font-mono uppercase tracking-[0.3em] truncate"
            >
              ID: {currentTrack.artist}
            </motion.p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-3">
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-[#00ffff]/60">
            <span>BIT_STREAM_POS</span>
            <span>{Math.floor(progress)}%</span>
          </div>
          <Slider
            value={[progress]}
            max={100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-crosshair"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handlePrev} 
              className="text-[#00ffff]/60 hover:text-[#ff00ff] hover:bg-[#ff00ff]/10 rounded-none border border-transparent hover:border-[#ff00ff]/30"
            >
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button 
              size="icon" 
              onClick={togglePlay}
              className="w-14 h-14 rounded-none bg-transparent border-2 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all relative group"
            >
              <div className="absolute inset-0 bg-[#00ffff]/20 translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform" />
              <span className="relative z-10">
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
              </span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleNext} 
              className="text-[#00ffff]/60 hover:text-[#ff00ff] hover:bg-[#ff00ff]/10 rounded-none border border-transparent hover:border-[#ff00ff]/30"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-3 w-24">
            <Volume2 className="w-4 h-4 text-[#ff00ff]" />
            <Slider
              value={[volume * 100]}
              max={100}
              onValueChange={(v) => setVolume(v[0] / 100)}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
