import React, { useState, useRef } from "react";
import api from "../../services/api";

const VoiceTest = () => {

    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const [transcript, setTranscript] = useState("");
    const [isTranscribing, setIsTranscribing] = useState(false);

    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);

    const uploadAudio = async (formData) => {

        try {

            setIsTranscribing(true);

            console.log("Sending audio for transcription...");

            const response = await api.post(
                "/speech/transcribe",
                formData
            );

            console.log(
                "Transcript:",
                response.data.transcript
            );

            setTranscript(response.data.transcript);

        } catch (error) {

            console.error(
                "Transcription failed:",
                error
            );
        } finally {

            setIsTranscribing(false);
        }
    };

    const startRecording = async () => {

        try {

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: true
            })

            streamRef.current = mediaStream;
            console.log("Microphone access granted");
            console.log(mediaStream);
            console.log(mediaStream.getTracks());
            console.log(mediaStream.getAudioTracks());

            // Understanding MediaRecorder
            const recorder = new MediaRecorder(streamRef.current);

            mediaRecorderRef.current = recorder;

            const chunks = [];

            recorder.ondataavailable = (event) => {
                chunks.push(event.data);
            }

            recorder.onstop = async () => {

                console.log("Recorder stopped")

                const audioBlob = new Blob(chunks, {
                    type: "audio/webm"
                })

                console.log(audioBlob);

                const audioURL = URL.createObjectURL(audioBlob);

                console.log("Audio URL", audioURL);

                setAudioURL(audioURL);

                // const audio = new Audio(audioURL);

                // audio.play();

                const formData = new FormData();
                formData.append("audio", audioBlob, "answer.webm");

                await uploadAudio(formData);
            }

            recorder.start();

            setIsRecording(true);

        } catch (error) {

            console.log("Microphone error", error);

        }
    };

    const stopRecording = () => {

        if (!mediaRecorderRef.current) return;

        mediaRecorderRef.current.stop();

        streamRef.current?.getTracks().forEach(track => {
            track.stop();
        });

        setIsRecording(false);

        URL.revokeObjectURL(audioURL);

        console.log("Microphone stopped");
    }



    return (
        <div>



            <button onClick={startRecording}>
                🎤 Start Recording
            </button>

            <button onClick={stopRecording}>
                ⏹ Stop Recording
            </button>

            {audioURL && (
                <audio
                    controls
                    src={audioURL}
                />
            )}

            {isTranscribing && (
                <p>⏳ Transcribing...</p>
            )}
        </div>
    );
}

export default VoiceTest;