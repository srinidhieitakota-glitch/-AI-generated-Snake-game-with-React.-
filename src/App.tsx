/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00ffff] selection:bg-[#ff00ff]/30 overflow-hidden relative font-mono">
      {/* Glitch Overlays */}
      <div className="fixed inset-0 noise z-50" />
      <div className="fixed inset-0 crt-overlay z-40" />
      <div className="scanline" />

      <main className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center gap-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <h1 
            className="text-7xl md:text-9xl font-black tracking-tighter uppercase glitch-text"
            data-text="VOID_SIGNAL"
          >
            VOID_SIGNAL
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-[2px] w-16 bg-[#ff00ff]" />
            <p className="text-sm uppercase tracking-[0.5em] text-[#ff00ff] animate-pulse">
              TERMINAL_SESSION_ACTIVE // 0x7F42
            </p>
            <div className="h-[2px] w-16 bg-[#ff00ff]" />
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-16 w-full max-w-6xl">
          {/* Left Side: Cryptic Logs */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="hidden xl:flex flex-col gap-6 w-72 border-l-4 border-[#ff00ff] bg-[#ff00ff]/5 p-6"
          >
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#ff00ff]">LOG_STREAM</h4>
              <div className="text-[10px] space-y-2 opacity-80">
                <p className="animate-pulse">{'>'} INITIALIZING_NEURAL_LINK...</p>
                <p>{'>'} PACKET_LOSS_DETECTED_IN_SECTOR_7</p>
                <p className="text-[#ff00ff]">{'>'} WARNING: GHOST_IN_THE_SHELL</p>
                <p>{'>'} SYNCING_AUDIO_WAVES_TO_GRID</p>
                <p className="animate-bounce">{'>'} _WAITING_FOR_INPUT_</p>
              </div>
            </div>
          </motion.div>

          {/* Center: Snake Game */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex-1 flex justify-center relative"
          >
            <div className="absolute -inset-4 border-2 border-[#ff00ff]/20 animate-pulse pointer-events-none" />
            <SnakeGame />
          </motion.div>

          {/* Right Side: Music Player */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-full max-w-[400px] space-y-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#ff00ff] animate-ping" />
              <span className="text-xs uppercase tracking-[0.3em] text-[#ff00ff]">AUDIO_DECODER_RUNNING</span>
            </div>
            
            <MusicPlayer />
            
            {/* System Commands */}
            <div className="border-2 border-[#00ffff]/30 p-6 space-y-4 bg-black/50 backdrop-blur-sm">
              <h5 className="text-xs font-bold uppercase tracking-widest text-[#00ffff]">GRID_COMMANDS</h5>
              <div className="grid grid-cols-1 gap-3 text-[10px]">
                <div className="flex justify-between border-b border-[#00ffff]/20 pb-1">
                  <span className="text-[#ff00ff]">NAVIGATE</span>
                  <span>[ARROW_KEYS]</span>
                </div>
                <div className="flex justify-between border-b border-[#00ffff]/20 pb-1">
                  <span className="text-[#ff00ff]">INTERRUPT</span>
                  <span>[SPACE_BAR]</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#ff00ff]">REBOOT</span>
                  <span>[AUTO_ON_DEATH]</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-16 pb-6 w-full flex justify-between items-end opacity-40 text-[10px] tracking-[0.2em]">
          <p>ESTABLISHED_1994 // VOID_CORP</p>
          <p className="animate-pulse">CONNECTED_TO_THE_ETHER</p>
          <p>V.4.0.1_STABLE</p>
        </footer>
      </main>
    </div>
  );
}
