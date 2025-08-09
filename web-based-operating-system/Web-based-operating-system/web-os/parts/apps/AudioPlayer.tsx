import React, { useState, useRef, useEffect } from 'react';
import { useFileSystem } from '../../settings/FileSystemContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, List } from 'lucide-react';

interface AudioPlayerProps {
initialAudioId?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ initialAudioId }) => {
const { items } = useFileSystem();
const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
const [isPlaying, setIsPlaying] = useState(false);
const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);
const [volume, setVolume] = useState(100);
const [isMuted, setIsMuted] = useState(false);
const [isShuffled, setIsShuffled] = useState(false);
const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
const [showPlaylist, setShowPlaylist] = useState(false);

const audioRef = useRef<HTMLAudioElement>(null);

const audioFiles = items.filter(item => 
item.type === 'file' && 
!item.isDeleted &&
(item.content?.startsWith('data:audio/') || 
item.name.toLowerCase().match(/\.(mp3|wav|ogg|m4a|aac|flac)$/))
);

useEffect(() => {
if (initialAudioId && audioFiles.length > 0) {
const index = audioFiles.findIndex(audio => audio.id === initialAudioId);
if (index !== -1) {
setCurrentTrackIndex(index);
} else {
setCurrentTrackIndex(0);
}
} else if (audioFiles.length > 0) {
setCurrentTrackIndex(prev => Math.min(prev, audioFiles.length - 1));
}
}, [items, initialAudioId, audioFiles]);

useEffect(() => {
if (audioRef.current) {
audioRef.current.volume = isMuted ? 0 : volume / 100;
}
}, [volume, isMuted]);

const currentTrack = audioFiles[currentTrackIndex];

const togglePlay = () => {
if (!audioRef.current || !currentTrack) return;

if (isPlaying) {
audioRef.current.pause();
} else {
audioRef.current.play();
}
setIsPlaying(!isPlaying);
};

const nextTrack = () => {
if (audioFiles.length === 0) return;

let nextIndex;
if (isShuffled) {
nextIndex = Math.floor(Math.random() * audioFiles.length);
} else {
nextIndex = (currentTrackIndex + 1) % audioFiles.length;
}

setCurrentTrackIndex(nextIndex);
setCurrentTime(0);

if (isPlaying && audioRef.current) {
setTimeout(() => {
audioRef.current?.play();
}, 100);
}
};

const previousTrack = () => {
if (audioFiles.length === 0) return;

const prevIndex = currentTrackIndex === 0 ? audioFiles.length - 1 : currentTrackIndex - 1;
setCurrentTrackIndex(prevIndex);
setCurrentTime(0);

if (isPlaying && audioRef.current) {
setTimeout(() => {
audioRef.current?.play();
}, 100);
}
};

const handleTimeUpdate = () => {
if (audioRef.current) {
setCurrentTime(audioRef.current.currentTime);
setDuration(audioRef.current.duration || 0);
}
};

const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
const time = parseFloat(e.target.value);
if (audioRef.current) {
audioRef.current.currentTime = time;
setCurrentTime(time);
}
};

const handleEnded = () => {
if (repeatMode === 'one') {
if (audioRef.current) {
audioRef.current.currentTime = 0;
audioRef.current.play();
}
} else if (repeatMode === 'all' || currentTrackIndex < audioFiles.length - 1) {
nextTrack();
} else {
setIsPlaying(false);
}
};

const formatTime = (seconds: number) => {
if (isNaN(seconds)) return '0:00';
const mins = Math.floor(seconds / 60);
const secs = Math.floor(seconds % 60);
return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const toggleMute = () => {
setIsMuted(!isMuted);
};

const toggleShuffle = () => {
setIsShuffled(!isShuffled);
};

const toggleRepeat = () => {
setRepeatMode(prev => {
switch (prev) {
case 'off': return 'all';
case 'all': return 'one';
case 'one': return 'off';
default: return 'off';
}
});
};

if (audioFiles.length === 0) {
return (
<div className="h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
<div className="text-center">
<div className="text-6xl mb-4">🎵</div>
<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Audio Files Found</h2>
<p className="text-gray-600 dark:text-gray-400">
Record some audio with the Voice Recorder app or add audio files to your file system.
</p>
</div>
</div>
);
}

return (
<div className="h-full bg-gradient-to-br from-purple-900 to-blue-900 text-white flex flex-col">
<div className="p-6 text-center">
<h1 className="text-2xl font-bold mb-2">🎵 Audio Player</h1>
<p className="text-purple-200">Now Playing</p>
</div>

<div className="flex-1 flex items-center justify-center p-8">
<div className="text-center">
<div className="w-64 h-64 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-2xl">
<div className="text-6xl">🎵</div>
</div>

<h2 className="text-2xl font-bold mb-2">{currentTrack?.name}</h2>
<p className="text-purple-200 mb-4">Audio File</p>

<div className="w-80 mx-auto mb-6">
<div className="flex items-center space-x-2 mb-2">
<span className="text-sm">{formatTime(currentTime)}</span>
<input
type="range"
min="0"
max={duration || 0}
value={currentTime}
onChange={handleSeek}
className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
/>
<span className="text-sm">{formatTime(duration)}</span>
</div>
</div>

<div className="flex items-center justify-center space-x-6 mb-6">
<button
onClick={toggleShuffle}
className={`p-2 rounded-full transition-colors ${
isShuffled ? 'text-green-400' : 'text-white/60 hover:text-white'
}`}
>
<Shuffle className="w-5 h-5" />
</button>

<button
onClick={previousTrack}
className="p-3 rounded-full hover:bg-white/10 transition-colors"
>
<SkipBack className="w-6 h-6" />
</button>

<button
onClick={togglePlay}
className="p-4 bg-white text-purple-900 rounded-full hover:bg-white/90 transition-colors"
>
{isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
</button>

<button
onClick={nextTrack}
className="p-3 rounded-full hover:bg-white/10 transition-colors"
>
<SkipForward className="w-6 h-6" />
</button>

<button
onClick={toggleRepeat}
className={`p-2 rounded-full transition-colors ${
repeatMode !== 'off' ? 'text-green-400' : 'text-white/60 hover:text-white'
}`}
>
<Repeat className="w-5 h-5" />
{repeatMode === 'one' && (
<span className="absolute -mt-1 -ml-1 text-xs">1</span>
)}
</button>
</div>

<div className="flex items-center justify-center space-x-3">
<button onClick={toggleMute} className="text-white/80 hover:text-white">
{isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
</button>
<input
type="range"
min="0"
max="100"
value={volume}
onChange={(e) => setVolume(Number(e.target.value))}
className="w-24 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
/>
<button
onClick={() => setShowPlaylist(!showPlaylist)}
className="text-white/80 hover:text-white"
>
<List className="w-5 h-5" />
</button>
</div>
</div>
</div>

{showPlaylist && (
<div className="bg-black/30 backdrop-blur-sm border-t border-white/10 max-h-64 overflow-y-auto">
<div className="p-4">
<h3 className="font-semibold mb-3">Playlist ({audioFiles.length} tracks)</h3>
<div className="space-y-2">
{audioFiles.map((track, index) => (
<button
key={track.id}
onClick={() => {
setCurrentTrackIndex(index);
setCurrentTime(0);
if (isPlaying && audioRef.current) {
setTimeout(() => {
audioRef.current?.play();
}, 100);
}
}}
className={`w-full text-left p-2 rounded hover:bg-white/10 transition-colors ${
index === currentTrackIndex ? 'bg-white/20' : ''
}`}
>
<div className="flex items-center space-x-3">
<span className="text-sm text-white/60 w-6">{index + 1}</span>
<span className="flex-1 truncate">{track.name}</span>
{index === currentTrackIndex && isPlaying && (
<div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
)}
</div>
</button>
))}
</div>
</div>
</div>
)}

{currentTrack && currentTrack.content && (
<audio
ref={audioRef}
src={currentTrack.content}
onTimeUpdate={handleTimeUpdate}
onLoadedMetadata={handleTimeUpdate}
onEnded={handleEnded}
className="hidden"
/>
)}
</div>
);
};

export default AudioPlayer;