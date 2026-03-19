import React, { useContext } from 'react';
import { AudioContext } from './context/AudioContext';
import { Play, Pause, Music, Disc } from 'lucide-react'; // Sexy icons ke liye
import Visualizer from './components/Visualizer';
import mySong from './assets/Future.mp3'

function App() {
  const { isPlaying, togglePlay, audioRef } = useContext(AudioContext);

  // Yeh tab chalega jab tu koi song select karega
  // Abhi ke liye hum hardcoded path use kar rahe hain test karne ke liye
  // const testSong = "/test.mp3"; // Make sure ye file public folder mein ho

  return (
      <div className="min-h-screen flex items-center justify-center p-4">
        {/* Main Player Card */}
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 shadow-2xl">

          {/* Track Info Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-48 h-48 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-3xl shadow-lg flex items-center justify-center mb-6 overflow-hidden relative group">
              <Disc className={`w-24 h-24 text-white/80 ${isPlaying ? 'animate-spin-slow' : ''}`} />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight">Project BeatViz</h1>
            <p className="text-cyan-400 font-medium opacity-80">Devesh's Audio Engine</p>
          </div>

          {/* Visualizer Placeholder - Real magic yahan hoga */}
          <Visualizer />

          {/* Simple Controls */}
          <div className="flex flex-col items-center mt-8">
            <button
                onClick={() => {
                  if (!audioRef.current.src) audioRef.current.src = mySong;
                  togglePlay();
                }}
                className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl"
            >
              {isPlaying ? <Pause size={32} fill="black" /> : <Play size={32} fill="black" className="ml-1" />}
            </button>

            <p className="mt-4 text-xs text-white/40 uppercase tracking-[0.2em]">
              {isPlaying ? "Now Playing" : "Paused"}
            </p>
          </div>
        </div>
      </div>
  );
}

export default App;