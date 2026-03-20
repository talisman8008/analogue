import React, { useContext,useState,useRef } from 'react';
import { AudioContext } from './context/AudioContext';
import { Play, Pause, Disc, Volume2,Upload } from 'lucide-react';
import Visualizer from './components/Visualizer';
import mySong from './assets/Future.mp3'
import Orb from './components/heroBg.jsx';

function App() {
    const {
        isPlaying, togglePlay, audioRef,
        volume, handleVolumeChange,
        progress, currentTime, duration, handleSeek, formatTime
    } = useContext(AudioContext);

    const fileInputRef = useRef(null);
    const [trackName, setTrackName] = useState("Please Upload Your Fav mp3 file");

    const handleFile = (e) => {
        const file = e.target.files[0];
        if(file){
            setTrackName(file.name.replace('.mp3',''));

            const objUrl = URL.createObjectURL(file);
            audioRef.current.src = objUrl;
            if(!isPlaying) togglePlay();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">

            <div className="absolute inset-0 w-full h-full z-0">
                {/* Orb component */}
                <Orb
                    hoverIntensity={0.5}
                    rotateOnHover={true}
                    forceHoverState={false}
                />
            </div>

                            {/*NAVBAR*/}
            <nav className=" fixed top-0 left-0 z-50 flex items-center justify-between w-full px-6 py-4 bg-black/100 backdrop-blur-lg border-b border-white/10">
                <div className="flex items-center ">
                    Logo
                </div>
                <div className="hidden  md:flex items-center gap-8 text-white/50 text-md font-medium ">
                   <span className="hover:text-white cursor-pointer transition-colors">Studio</span>
                   <span className="hover:text-white cursor-pointer transition-colors">Library</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-400 text-[10px] font-bold tracking-widest uppercase">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
                    Live
                </div>
            </nav>



            <div className="w-full max-w-md mt-[55px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 shadow-2xl">

                {/* Track Info */}
                <div className="flex flex-col items-center mb-8 relative">
                    <input
                        type="file"
                        accept="audio/*"
                        ref={fileInputRef}
                        onChange={handleFile}
                        className="hidden"
                    />

                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="absolute top-0 right-0 p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors group text-white/50 hover:text-cyan-400"
                    >
                        <Upload size={18} />
                    </button>

                    <div className="w-48 h-48 bg-linear-to-tr from-cyan-500 to-blue-600 rounded-3xl shadow-lg flex items-center justify-center mb-6 overflow-hidden relative group">
                        <Disc className={`w-24 h-24 text-white/80 ${isPlaying ? 'animate-spin-slow' : ''}`} />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-center px-4 truncate w-full">{trackName}</h1>
                    {/*<p className="text-cyan-400 font-medium opacity-80 uppercase tracking-widest text-[10px] mt-1">{trackName==="Project BeatViz"?"Active Session":"Local Playback" }</p>*/}
                </div>

                <Visualizer />

                {/* --- MISSING PROGRESS BAR (WAPAS AA GAYA) --- */}
                <div className="w-full mt-6 px-2">
                    <div className="flex justify-between text-[10px] text-white/50 mb-2 uppercase tracking-widest font-bold">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                    <div className="relative group h-4 flex items-center cursor-pointer">
                        <input
                            type="range" min="0" max="100" step="0.1"
                            value={progress} onChange={handleSeek}
                            className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="absolute w-full h-1 bg-white/10 rounded-full" />
                        <div className="absolute h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {/* --- VOLUME SLIDER --- */}
                <div className="mt-6 flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/10">
                    <Volume2 size={16} className="text-white/50 flex-shrink-0" />
                    <div className="relative flex-1 h-1.5 bg-white/10 rounded-full flex items-center group cursor-pointer">
                        <div className="absolute h-full bg-white/80 rounded-full transition-all" style={{ width: `${volume * 100}%` }} />
                        <input
                            type="range" min="0" max="1" step="0.01"
                            value={volume} onChange={handleVolumeChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                    </div>
                    <span className="text-[10px] font-mono text-white/50 w-8 text-right flex-shrink-0">
                {Math.round(volume * 100)}%
            </span>
                </div>

                {/* Play/Pause Controls */}
                <div className="flex flex-col items-center mt-8">
                    <button
                        onClick={() => {
                            if (!audioRef.current.src) audioRef.current.src = mySong;
                            togglePlay();
                        }}
                        className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl"
                    >
                        {isPlaying ? <Pause size={32} fill="black" /> : <Play size={32} fill="black" className="ml-1" />}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default App;