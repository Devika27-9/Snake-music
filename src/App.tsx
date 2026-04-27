/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#020203] text-white font-sans flex flex-col overflow-x-hidden p-4 md:p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 flex-col sm:flex-row gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rotate-45"></div>
          </div>
          <div className="flex flex-col text-center sm:text-left">
            <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              NEON·SNAKE
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-[0.2em] uppercase">AI Music Edition</p>
          </div>
        </div>
        <div className="flex gap-6 items-center text-sm font-medium tracking-widest text-slate-400 uppercase hidden md:flex">
          <span className="text-cyan-400 border-b-2 border-cyan-400 pb-1">Arcade Mode</span>
          <span className="hover:text-white cursor-pointer transition-colors">Zen Mode</span>
          <span className="hover:text-white cursor-pointer transition-colors">Global Highscores</span>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
        
        <section className="col-span-1 lg:col-span-2 hidden lg:flex flex-col gap-4 h-full">
           <div className="mt-auto p-4 rounded-xl bg-gradient-to-b from-transparent to-cyan-900/20 border border-cyan-500/20">
             <p className="text-[10px] uppercase tracking-widest text-cyan-300/60 mb-2">System Status</p>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
               <p className="text-xs text-cyan-100">Neural Link Active</p>
             </div>
           </div>
        </section>

        {/* Center: Snake Game Window */}
        <section className="col-span-1 lg:col-span-6 flex flex-col items-center justify-center w-full">
          <SnakeGame />
        </section>

        {/* Sidebar Right: Music Player */}
        <section className="col-span-1 lg:col-span-4 flex flex-col gap-6 w-full max-w-sm mx-auto lg:max-w-none">
          <MusicPlayer />
        </section>
      </main>

      {/* Footer Status Bar */}
      <footer className="hidden md:flex mt-8 pt-4 border-t border-white/10 justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-widest">
        <div className="flex gap-8">
          <span>Session: <span className="text-slate-300">00:42:15</span></span>
          <span>Visualizer: <span className="text-cyan-400">Reactive (v2.1)</span></span>
        </div>
        <div className="flex gap-4">
          <span className="text-slate-300">Lat: 12ms</span>
          <span className="text-slate-300">FPS: 60</span>
        </div>
      </footer>
    </div>
  );
}
