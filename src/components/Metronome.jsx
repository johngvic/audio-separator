import React, { useState, useEffect } from "react";

const Metronome = () => {
  const [bpm, setBpm] = useState(120); // Default BPM
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  // Load the click sound once on component mount
  useEffect(() => {
    const loadClickSound = async () => {
      try {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(context);

        const response = await fetch("stems/click.m4a"); // Replace with your actual click sound path
        const audioData = await response.arrayBuffer();
        const decodedBuffer = await context.decodeAudioData(audioData);
        setAudioBuffer(decodedBuffer);
      } catch (error) {
        console.error("Error loading click sound:", error);
      }
    };

    loadClickSound();
  }, []);

  // Play the click sound
  const playClick = () => {
    if (!audioContext || !audioBuffer) return;

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  };

  // Start the metronome
  const startMetronome = () => {
    if (!audioBuffer) {
      console.error("Audio buffer not loaded yet!");
      return;
    }

    const interval = (60 / bpm) * 1000; // Interval in milliseconds

    // Ensure there's no existing interval running
    if (intervalId) {
      clearInterval(intervalId);
    }

    const id = setInterval(() => {
      playClick();
    }, interval);

    setIntervalId(id);
    setIsPlaying(true);
  };

  // Stop the metronome
  const stopMetronome = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    setIntervalId(null);
    setIsPlaying(false);
  };

  // Handle BPM input change
  const handleBpmChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setBpm(value > 0 ? value : 1); // Prevent non-positive BPM
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h1>Metronome</h1>
      <div>
        <label htmlFor="bpm">
          Set BPM:{" "}
          <input
            id="bpm"
            type="number"
            value={bpm}
            onChange={handleBpmChange}
            min="20"
            max="300"
            style={{ width: "60px" }}
          />
        </label>
      </div>
      <div style={{ marginTop: "20px" }}>
        {!isPlaying ? (
          <button onClick={startMetronome} style={{ padding: "10px 20px" }}>
            Start
          </button>
        ) : (
          <button onClick={stopMetronome} style={{ padding: "10px 20px" }}>
            Stop
          </button>
        )}
      </div>
    </div>
  );
};

export default Metronome;
