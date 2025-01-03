import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import {
  PlayIcon,
  PauseIcon,
  RewindIcon,
  FastForwardIcon,
  MutedIcon
} from '../assets';

const StemPlayer = () => {
  const { song } = useParams();
  const stems = ['vocals', 'drums', 'bass', 'other'];
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElements, setAudioElements] = useState({
    vocals: new Audio(),
    drums: new Audio(),
    bass: new Audio(),
    other: new Audio(),
  });

  const [isMuted, setIsMuted] = useState({
    vocals: false,
    drums: false,
    bass: false,
    other: false,
  });

  // Initialize audio elements on mount
  useEffect(() => {
    const vocals = new Audio("stems/vocals.m4a");
    const drums = new Audio("stems/drums.m4a");
    const bass = new Audio("stems/bass.m4a");
    const other = new Audio("stems/other.m4a");

    // Set audio elements to state
    setAudioElements({ vocals, drums, bass, other });

    // Cleanup on unmount
    return () => {
      vocals.pause();
      drums.pause();
      bass.pause();
      other.pause();
    };
  }, []);

  // Play, pause, and synchronize stems
  const playStems = () => {
    Object.values(audioElements).forEach((audio) => audio && audio.play());
  };

  const pauseStems = () => {
    Object.values(audioElements).forEach((audio) => audio && audio.pause());
  };

  const syncTime = (time) => {
    const currentTime = time || audioElements.vocals?.currentTime || 0; // Use vocals as the master time
    setCurrentTime(currentTime);
    Object.values(audioElements).forEach((audio) => {
      if (audio && Math.abs(audio.currentTime - currentTime) > 0.1) {
        audio.currentTime = currentTime;
      }
    });
  };

  // Mute/unmute logic
  const toggleMute = (stem) => {
    const audio = audioElements[stem];
    if (audio) {
      audio.muted = !audio.muted;
      setIsMuted((prev) => ({
        ...prev,
        [stem]: audio.muted,
      }));
    }
  };

  useEffect(() => {
    const handleTimeUpdate = () => syncTime();
  
    // Clean up and add event listeners
    Object.values(audioElements).forEach((audio) => {
      if (audio && typeof audio.removeEventListener === "function") {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
      }
      if (audio && typeof audio.addEventListener === "function") {
        audio.addEventListener("timeupdate", handleTimeUpdate);
      }
    });
  
    return () => {
      Object.values(audioElements).forEach((audio) => {
        if (audio && typeof audio.removeEventListener === "function") {
          audio.removeEventListener("timeupdate", handleTimeUpdate);
        }
      });
    };
  }, [audioElements]);

  useEffect(() => {
    isPlaying ? playStems() : pauseStems();
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const getFormattedTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  const updateVolume = (stem, newVolume) => {
    setAudioElements((prev) => {
      const updatedAudio = prev[stem]; // Retrieve the actual `HTMLAudioElement`
      updatedAudio.volume = newVolume; // Update its volume
      return { ...prev }; // Return the updated state (same object references preserved)
    });
  };

  return (
    <div>
      <h1 style={{marginLeft: "5rem"}}>Stem Player</h1>
      <Container>
        <StemContainer>
          {stems.map((it) => (
            <Stem>
              <StemDetails>
                <ToggleStemButton onClick={() => toggleMute(it)}>
                  {isMuted[it] ? "M" : "U"}
                </ToggleStemButton>
                <p>{it.split('').map((l, index) => index === 0 ? l.toUpperCase() : l)}</p>
              </StemDetails>

              <VolumeContainer>
                <VolumeButton
                  type="range"
                  min={0}
                  max={100}
                  value={audioElements[it].volume * 100}
                  onChange={(e) => {
                    const newVolume = e.target.value / 100;
                    updateVolume(it, newVolume);
                  }}
                />

                {
                  isMuted[it] || audioElements[it].volume === 0 ?
                  <img src={MutedIcon} alt="Mute icon"/> :
                  <p>{(audioElements[it].volume * 100).toFixed(0)}</p>
                }

              </VolumeContainer>
            </Stem>
          ))}
        </StemContainer>

        <PlayerContainer>
          <IconsContainer>
            <img src={RewindIcon} alt="Rewind icon" style={{ transform: "rotate(180deg)" }} />
            <img src={!isPlaying ? PlayIcon : PauseIcon} alt="Play/Pause icon" onClick={handlePlayPause} />
            <img src={FastForwardIcon} alt="Fast Forward icon" />
          </IconsContainer>

          <TimestampContainer>
            <p>{getFormattedTime(currentTime)}</p>
            <ProgressBar
              type="range"
              min={0}
              max={audioElements.vocals.duration}
              value={currentTime}
              onChange={(e) => {
                syncTime(Number(e.target.value));
              }}
            />
            <p>{getFormattedTime(audioElements.vocals.duration)}</p>
          </TimestampContainer>
        </PlayerContainer>

        {/* <Metronome/> */}
      </Container>
    </div>
  );
};

export default StemPlayer;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 10rem;
  margin-left: 5rem;
`

const StemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 50vw;
`

const Stem = styled.div`
  display: flex;
  flex-direction: column;
`

const StemDetails = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  height: 2rem;
`

const VolumeContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
  height: 3rem;
`

const VolumeButton = styled.input`
  margin-top: .5rem;
  width: 8rem;
  height: 4px;
  border-radius: 3px;
  position: relative;
  background-color: #262626;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-repeat: no-repeat;
  background-image: linear-gradient(90deg,#00dae8,#0affa7);
  background-size: 100%;
  cursor: pointer;
`

const ToggleStemButton = styled.button`
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  font-weight: 700;
  background: none;
  border: 1px solid #D3D3D3;
  border-radius: .3rem;
  cursor: pointer;
`

const PlayerContainer = styled.div`
  width: fit-content;
  text-align: center;
  margin-top: 3rem;

  img {
    cursor: pointer;
  }
`

const IconsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`

const TimestampContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;

  p {
    width: 3rem;
    text-align: center;
  }
`

const ProgressBar = styled.input`
  width: 15rem;
  height: 4px;
  cursor: pointer;
  border-radius: 3px;
  position: relative;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-size: 0;
  background-repeat: no-repeat;
  background-color: #333;
  background-image: linear-gradient(#666,#666);
`