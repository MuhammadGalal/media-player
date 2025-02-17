'use client';
import { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { Box, Slider, Typography, IconButton, Tooltip } from "@mui/material";
import { PlayArrow, Pause, VolumeUp, VolumeOff, Fullscreen, FullscreenExit, Speed } from "@mui/icons-material";

export default function VideoPlayer({ url }) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const timeoutId = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleMouseActivity = () => {
    setShowCursor(true);
    clearTimeout(timeoutId.current);
    if (playing) {
      timeoutId.current = setTimeout(() => setShowCursor(false), 3000);
    }
  };

  useEffect(() => {
    if (playing) {
      timeoutId.current = setTimeout(() => setShowCursor(false), 3000);
    } else {
      setShowCursor(true);
      clearTimeout(timeoutId.current);
    }
    return () => clearTimeout(timeoutId.current);
  }, [playing]);

  const handlePlayPause = () => {
    setPlaying(!playing);
    handleMouseActivity();
  };

  const handleMuteToggle = () => setMuted(!muted);
  const handleVolumeChange = (_, value) => setVolume(value / 100);
  const handleProgress = (state) => setPlayed(state.played);
  const handleDuration = (duration) => setDuration(duration);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const secondsStr = date.getUTCSeconds().toString().padStart(2, '0');
    return hours ? `${hours}:${minutes}:${secondsStr}` : `${minutes}:${secondsStr}`;
  };

  if (!isClient) return null;

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        width: '100%',
        height: isFullScreen ? '100vh' : '56.25vw',
        maxHeight: '80vh',
        maxWidth: '100vw',
        backgroundColor: '#000',
        overflow: 'hidden',
        cursor: showCursor ? 'default' : 'none',
        '&:hover .controls': {
          opacity: 1
        }
      }}
      onMouseMove={handleMouseActivity}
      onTouchMove={handleMouseActivity}
    >
      {/* Centered Play/Pause Button */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          opacity: (!playing || showCursor) ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none'
        }}
      >
        <IconButton
          onClick={handlePlayPause}
          sx={{
            color: '#fff',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.9)' },
            width: 64,
            height: 64,
            pointerEvents: 'auto'
          }}
        >
          {playing ? <Pause sx={{ fontSize: 40 }} /> : <PlayArrow sx={{ fontSize: 40 }} />}
        </IconButton>
      </Box>
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={playing}
        volume={volume}
        muted={muted}
        // playbackRate={speed}
        onProgress={handleProgress}
        onDuration={handleDuration}
        width="100%"
        height="100%"
        onClick={handlePlayPause}
        config={{
          youtube: {
            playerVars: { modestbranding: 1, rel: 0, iv_load_policy: 3 }
          }
        }}
      />

      {/* Bottom Control Bar */}
      <Box
        className="controls"
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'rgba(0, 0, 0, 0.7)',
          p: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          backdropFilter: 'blur(4px)',
          zIndex: 2,
          transition: 'opacity 0.3s ease',
          opacity: showCursor ? 1 : 0
        }}
      >
        <Tooltip title={playing ? "Pause" : "Play"}>
          <IconButton onClick={handlePlayPause} sx={{ color: '#fff' }}>
            {playing ? <Pause /> : <PlayArrow />}
          </IconButton>
       
        </Tooltip>

        <Slider
          value={played * 100}
          onChange={(_, value) => {
            setPlayed(value / 100);
            playerRef.current.seekTo(value / 100);
          }}
          sx={{
            flex: 1,
            color: '#fff',
            '& .MuiSlider-thumb': { width: 12, height: 12 },
          }}
        />

        <Typography variant="body2" sx={{ color: '#fff', minWidth: 100 }}>
          {formatTime(duration * played)} / {formatTime(duration)}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={muted ? "Unmute" : "Mute"}>
            <IconButton onClick={handleMuteToggle} sx={{ color: '#fff' }}>
              {muted ? <VolumeOff /> : <VolumeUp />}
            </IconButton>
          </Tooltip>
          <Slider
            value={volume * 100}
            onChange={handleVolumeChange}
            sx={{ width: 80, color: '#fff' }}
          />
        </Box>

        <Tooltip title={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}>
          <IconButton onClick={toggleFullScreen} sx={{ color: '#fff' }}>
            {isFullScreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}