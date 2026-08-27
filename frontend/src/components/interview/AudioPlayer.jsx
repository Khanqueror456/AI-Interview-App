import { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

const AudioPlayer = ({ audioUrl }) => {

    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {

        // Reset whenever question/audio changes
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        setIsPlaying(false);

    }, [audioUrl]);


    const toggleAudio = async () => {

        const audio = audioRef.current;

        if (!audio) return;

        if (isPlaying) {

            audio.pause();
            setIsPlaying(false);

        } else {

            // If audio has already finished, start from beginning
            if (audio.ended) {
                audio.currentTime = 0;
            }

            try {
                await audio.play();
                setIsPlaying(true);
            } catch (error) {
                console.error("Audio playback failed:", error);
            }
        }
    };


    const handleEnded = () => {

        setIsPlaying(false);

        // Reset so next click starts from beginning
        audioRef.current.currentTime = 0;
    };


    return (
        <>
            <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={handleEnded}
                preload="auto"
            />

            <button
                onClick={toggleAudio}
                aria-label={isPlaying ? "Pause question" : "Play question"}
                title={isPlaying ? "Pause" : "Play question"}
                className={`
                    flex h-10 w-10 items-center justify-center
                    rounded-full
                    transition-all duration-200
                    ${
                        isPlaying
                            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                            : "bg-slate-800 text-slate-300 hover:bg-indigo-500 hover:text-white hover:scale-105"
                    }
                `}
            >
                {isPlaying ? (
                    <FaPause className="text-sm" />
                ) : (
                    <FaPlay className="ml-0.5 text-sm" />
                )}
            </button>
        </>
    );
};

export default AudioPlayer;