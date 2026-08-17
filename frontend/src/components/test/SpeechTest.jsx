import React, { useRef, useState } from "react";

const SpeechTest = () => {

    const [transcript, setTranscript] = useState("");
    const [isListening, setIsListening] = useState(false);

    const recognitionRef = useRef(null);

    const startListening = () => {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();

        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onstart = () => {

            console.log("Listening...");

            setIsListening(true);
        };

        recognition.onresult = (event) => {

            let text = "";

            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {

                text += event.results[i][0].transcript;
            }

            console.log("Transcript:", text);

            setTranscript(text);
        };

        recognition.onerror = (event) => {

            console.error(
                "Speech recognition error:",
                event.error
            );

            setIsListening(false);
        };

        recognition.onend = () => {

            console.log("Recognition ended");

            setIsListening(false);
        };

        recognitionRef.current = recognition;

        recognition.start();
    };


    const stopListening = () => {

        if (recognitionRef.current) {

            recognitionRef.current.stop();

        }
    };


    return (
        <div>

            <button
                onClick={startListening}
                disabled={isListening}
            >
                🎤 Start Listening
            </button>

            <button
                onClick={stopListening}
                disabled={!isListening}
            >
                ⏹ Stop
            </button>

            <p>
                {transcript}
            </p>

        </div>
    );
};

export default SpeechTest;
