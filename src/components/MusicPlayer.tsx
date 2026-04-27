import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Waves } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Drift - AI Gen #1',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 2,
    title: 'Cyberpunk City - AI Gen #2',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 3,
    title: 'Digital Horizon - AI Gen #3',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  }
];

export default function MusicPlayer() {
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play blocked by browser", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIdx]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress(duration ? (current / duration) * 100 : 0);
    }
  };

  const skipForward = () => {
    setCurrentTrackIdx((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBack = () => {
    setCurrentTrackIdx((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTrackEnded = () => {
    skipForward();
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Active Track Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="w-full aspect-square bg-gradient-to-br from-indigo-900 to-cyan-900 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative group">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-400/20 via-transparent to-transparent opacity-50"></div>
           <div className="w-32 h-32 border-4 border-white/20 rounded-full flex items-center justify-center relative z-10">
             <div className={`w-16 h-16 bg-white rounded-full transition-opacity duration-300 ${isPlaying ? 'opacity-20 animate-pulse' : 'opacity-10'}`}></div>
             <Waves className={`absolute text-cyan-400 w-12 h-12 transition-all ${isPlaying ? 'animate-pulse scale-110 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]' : ''}`} />
           </div>
           <audio
            ref={audioRef}
            src={TRACKS[currentTrackIdx].url}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleTrackEnded}
          />
        </div>
        <div className="text-center mb-6">
          <h3 className="font-bold text-lg leading-tight mb-1 truncate text-white">{TRACKS[currentTrackIdx].title}</h3>
          <p className="text-xs text-slate-400">Neural Synthesis Lab</p>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2 mb-6">
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div 
               className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all ease-linear"
               style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>{Math.floor((audioRef.current?.currentTime || 0) / 60).toString().padStart(2, '0')}:{(Math.floor(audioRef.current?.currentTime || 0) % 60).toString().padStart(2, '0')}</span>
            <span>{Math.floor((audioRef.current?.duration || 0) / 60).toString().padStart(2, '0')}:{(Math.floor(audioRef.current?.duration || 0) % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-between px-8">
          <button onClick={skipBack} className="text-slate-400 hover:text-white transition-colors">
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          <button 
             onClick={() => setIsPlaying(!isPlaying)}
             className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
          >
             {isPlaying ? <Pause className="fill-current w-7 h-7" /> : <Play className="fill-current w-7 h-7 ml-1" />}
          </button>
          <button onClick={skipForward} className="text-slate-400 hover:text-white transition-colors">
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>
      </div>

      {/* Track List inside Player bounds simulating Left sidebar in original design */}
      <div className="flex flex-col gap-4 mt-2">
         <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Neural Playlist</h2>
         <div className="space-y-3">
             {TRACKS.map((track, idx) => (
                <div 
                   key={track.id}
                   onClick={() => {
                     setCurrentTrackIdx(idx);
                     setIsPlaying(true);
                   }}
                   className={`p-4 bg-white/5 border rounded-xl hover:bg-white/10 transition-all cursor-pointer group flex flex-col gap-1 ${
                      idx === currentTrackIdx ? 'border-white/10 border-l-4 border-l-cyan-500 shadow-xl' : 'border-white/5'
                   }`}
                >
                   <p className={`text-sm font-bold truncate transition-colors ${idx === currentTrackIdx ? 'text-cyan-400' : 'text-slate-200 group-hover:text-white'}`}>{track.title}</p>
                   <p className="text-xs text-slate-500">AI Synthesizer • Track {track.id}</p>
                </div>
             ))}
         </div>
      </div>
    </div>
  );
}
