import React, { useRef, useEffect, useContext } from 'react';
import { AudioContext } from '../context/AudioContext';

const Visualizer = () => {
    const canvasRef = useRef(null);
    const animationFrameId = useRef(null);
    const { analyserRef, isPlaying } = useContext(AudioContext);

    useEffect(() => {
        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');

        // Function to draw the visualization
        const draw = () => {
            // 1. requestAnimationFrame loop chalao (smooth animation ke liye)
            animationFrameId.current = requestAnimationFrame(draw);

            if (!analyserRef.current) return;

            const analyser = analyserRef.current;
            const bufferLength = analyser.frequencyBinCount; // frequencyData ka size (128 bars)
            const dataArray = new Uint8Array(bufferLength); // Data store karne ke liye array

            // 2. Real-time Frequency Data fetch karo (This is the Core Logic!)
            analyser.getByteFrequencyData(dataArray);

            // 3. Canvas cleanup aur background set karo
            const width = canvas.width;
            const height = canvas.height;
            canvasCtx.clearRect(0, 0, width, height);

            // Glassmorphic look ke liye semi-transparent background
            canvasCtx.fillStyle = 'rgba(15, 23, 42, 0.5)';
            canvasCtx.fillRect(0, 0, width, height);

            // 4. Bar customization setup
            const barWidth = (width / bufferLength) * 2.5;
            let x = 0;

            // 5. Loop through dataArray and draw each bar
            for (let i = 0; i < bufferLength; i++) {
                // Frequency data (0-255) ko bar height (0 to canvas height) mein map karo
                const barHeight = (dataArray[i] / 255) * height * 0.8; // 0.8 is to keep some padding

                // --- THE WOW FACTOR: Velocity/Beat Effect ---
                // Agar high frequency (bass) detected hai, toh color change aur glowing effect do
                let red, green, blue;
                if (dataArray[i] > 200) { // High Bass detected!
                    // Velocity Pulse Color (Cyan glowing)
                    red = 34; green = 211; blue = 238;
                    canvasCtx.shadowBlur = 15;
                    canvasCtx.shadowColor = 'rgba(34, 211, 238, 0.8)';
                } else {
                    // Default Color (Blueish fade)
                    const hue = i * 2; // Fade effect from left to right
                    red = 59; green = 130; blue = 246;
                    canvasCtx.shadowBlur = 0;
                }

                canvasCtx.fillStyle = `rgb(${red}, ${green}, ${blue})`;

                // 6. Draw the rectangle (The bar itself)
                // (x, y_start, width, height)
                // Height is negative to draw from bottom to top
                canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight);

                x += barWidth + 1; // Move to the next bar position with 1px spacing
            }
        };

        // --- Animation Control Logic ---
        if (isPlaying) {
            // if playing start animation
            draw();
        } else {
            //stop animation
            cancelAnimationFrame(animationFrameId.current);
            // Optional: Clear canvas on pause
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        }

        // --- Cleanup on component unmount ---
        return () => {
            cancelAnimationFrame(animationFrameId.current);
        };
    }, [isPlaying, analyserRef]); // Run whenever playing state or analyzer changes

    return (
        <div className="w-full h-40 bg-black/20 rounded-2xl overflow-hidden border border-white/5 mt-6 mb-2 relative">
            <canvas
                ref={canvasRef}
                width={400} // Increase width/height for better resolution
                height={160}
                className="w-full h-full"
            />
            {/* Visual representation jab music paused ho */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white/30 text-xs uppercase tracking-widest animate-pulse">
                        Waiting for beat...</p>
                </div>
                )}
        </div>
    );
};

export default Visualizer;