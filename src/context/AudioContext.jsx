import React, { createContext, useRef, useState } from 'react';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const audioRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const gainNodeRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [volume, setVolume] = useState(0.8);

    // --- PROGRESS BAR STATES ---
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const initAudio = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;

            gainNodeRef.current = audioContextRef.current.createGain();
            gainNodeRef.current.gain.value = volume;

            sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);

            sourceRef.current.connect(analyserRef.current);
            analyserRef.current.connect(gainNodeRef.current);
            gainNodeRef.current.connect(audioContextRef.current.destination);
        }
    };

    const togglePlay = () => {
        initAudio();
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

    const handleVolumeChange = (e) => {
        const newVol = parseFloat(e.target.value);
        setVolume(newVol);
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = newVol;
        }
    };

    // --- PROGRESS BAR LOGIC ---
    const handleTimeUpdate = () => {
        const current = audioRef.current.currentTime;
        const dur = audioRef.current.duration;
        setCurrentTime(current);
        if (dur) {
            setDuration(dur);
            setProgress((current / dur) * 100);
        }
    };

    const handleSeek = (e) => {
        const seekTime = (e.target.value / 100) * duration;
        audioRef.current.currentTime = seekTime;
        setProgress(e.target.value);
    };

    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <AudioContext.Provider value={{
            audioRef, isPlaying, togglePlay, analyserRef, currentTrack, setCurrentTrack,
            volume, handleVolumeChange,
            progress, currentTime, duration, handleSeek, formatTime // Exporting progress logic
        }}>
            {children}
            <audio
                ref={audioRef}
                onEnded={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate} // Yeh zaroori hai time track karne ke liye
                onLoadedMetadata={handleTimeUpdate} // Gaana load hote hi duration set karega
                crossOrigin="anonymous"
            />
        </AudioContext.Provider>
    );
};