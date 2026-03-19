import React, { createContext, useRef, useState } from 'react';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const audioRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);

    // Function to initialize the Audio Engine
    const initAudio = () => {
        if (!audioContextRef.current) {
            // 1. Create Audio Context
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

            // 2. Create Analyser Node (This is the "Wow Factor" data source)
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256; // High frequency resolution

            // 3. Connect Audio Element to Context
            sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
            sourceRef.current.connect(analyserRef.current);
            analyserRef.current.connect(audioContextRef.current.destination);
        }
    };

    const togglePlay = () => {
        initAudio(); // Initialize on first click

        // Chrome/Edge "Resume" fix
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <AudioContext.Provider value={{ audioRef, isPlaying, togglePlay, analyserRef, currentTrack, setCurrentTrack }}>
            {children}
            {/* Hidden Audio Tag: All logic happens here */}
            <audio
                ref={audioRef}
                onEnded={() => setIsPlaying(false)}
                crossOrigin="anonymous"
            />
        </AudioContext.Provider>
    );
};