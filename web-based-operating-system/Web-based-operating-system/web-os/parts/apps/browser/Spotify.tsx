import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, Heart } from 'lucide-react';
import { useOS } from '../../../settings/OSContext';

interface Track {
id: string;
title: string;
artist: string;
duration: string;
cover: string;
liked: boolean;
}

const Spotify: React.FC = () => {
const { volume } = useOS();
const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
const [isPlaying, setIsPlaying] = useState(false);
const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);
const [trackVolume, setTrackVolume] = useState(100);
const [isMuted, setIsMuted] = useState(false);
const [isShuffled, setIsShuffled] = useState(false);
const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
const audioRef = useRef<HTMLAudioElement>(null);

const tracks: Track[] = [
{
id: '1',
title: 'Eminem - Mockingbird [Official Music Video]',
artist: 'EminemMusic',
duration: '4:17',
cover: 'https://upload.wikimedia.org/wikipedia/en/f/fc/Mockingbird_%28Eminem_song%29_cover.jpg',
liked: true
},
{
id: '2',
title: 'Lukas Graham - 7 Years [Official Music Video]',
artist: 'Lukas Graham',
duration: '4:00',
cover: 'https://f4.bcbits.com/img/a4130126625_16.jpg',
liked: false
},
{
id: '3',
title: 'Glass Animals - Heat Waves (Official Video)',
artist: 'Glass Animals',
duration: '3:59',
cover: 'https://ekm.co/wp-content/uploads/2020/07/Heat-Waves-Video-Still_2-1068x601.jpg',
liked: true
},
{
id: '4',
title: 'XXXTENTACION - SAD!',
artist: 'XXXTENTACION',
duration: '2:46',
cover: 'https://m.media-amazon.com/images/M/MV5BYmNmZmVlNmEtZWNiYS00MGFhLTgyMzMtMmI1NTJlZjg0ZTdlXkEyXkFqcGc@._V1_QL75_UX606_.jpg',
liked: false
},
{
id: '5',
title: 'Post Malone, Swae Lee - Sunflower (Spider-Man: Into the Spider-Verse) (Official Video)',
artist: 'Post Malone',
duration: '2:41',
cover: 'https://reactormag.com/wp-content/uploads/2023/06/Miles-Across-the-Spider-Verse-1100x733.png',
liked: true
},
];

useEffect(() => {
if (audioRef.current) {
audioRef.current.volume = (isMuted ? 0 : trackVolume / 100) * (volume / 100);
}
}, [volume, trackVolume, isMuted]);

const playTrack = (track: Track) => {
setCurrentTrack(track);
setIsPlaying(true);
setCurrentTime(0);
};

const togglePlay = () => {
setIsPlaying(!isPlaying);
};

const nextTrack = () => {
if (!currentTrack) return;
const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
const nextIndex = isShuffled 
? Math.floor(Math.random() * tracks.length)
: (currentIndex + 1) % tracks.length;
playTrack(tracks[nextIndex]);
};

const previousTrack = () => {
if (!currentTrack) return;
const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
playTrack(tracks[prevIndex]);
};

const toggleLike = (trackId: string) => {
};

const formatTime = (seconds: number) => {
const mins = Math.floor(seconds / 60);
const secs = Math.floor(seconds % 60);
return `${mins}:${secs.toString().padStart(2, '0')}`;
};

return (
<div className="h-full bg-black text-white flex flex-col">
<div className="bg-gradient-to-r from-green-600 to-green-400 p-6">
<div className="flex items-center space-x-3">
<div className="text-3xl">🎵</div>
<h1 className="text-3xl font-bold">Spotify</h1>
</div>
<p className="text-green-100 mt-2">Music for everyone</p>
</div>

<div className="flex-1 flex">
<div className="w-64 bg-gray-900 p-4">
<nav className="space-y-4">
<div>
<h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
Your Library
</h3>
<ul className="space-y-2">
<li><a href="#" className="text-white hover:text-green-400 transition-colors">Recently Played</a></li>
<li><a href="#" className="text-white hover:text-green-400 transition-colors">Liked Songs</a></li>
<li><a href="#" className="text-white hover:text-green-400 transition-colors">Albums</a></li>
<li><a href="#" className="text-white hover:text-green-400 transition-colors">Artists</a></li>
</ul>
</div>

<div>
<h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
Playlists
</h3>
<ul className="space-y-2">
<li><a href="#" className="text-gray-300 hover:text-white transition-colors">Chill Vibes</a></li>
<li><a href="#" className="text-gray-300 hover:text-white transition-colors">Workout Mix</a></li>
<li><a href="#" className="text-gray-300 hover:text-white transition-colors">Focus Music</a></li>
</ul>
</div>
</nav>
</div>

<div className="flex-1 overflow-y-auto">
<div className="p-6">
<h2 className="text-2xl font-bold mb-6">Popular Tracks</h2>

<div className="space-y-2">
{tracks.map((track, index) => (
<div
key={track.id}
className={`flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer ${
currentTrack?.id === track.id ? 'bg-gray-800' : ''
}`}
onClick={() => playTrack(track)}
>
<div className="text-gray-400 w-6 text-center">
{currentTrack?.id === track.id && isPlaying ? (
<div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
) : (
<span>{index + 1}</span>
)}
</div>

<img
src={track.cover}
alt={track.album}
className="w-12 h-12 rounded object-cover"
/>

<div className="flex-1">
<h4 className="font-medium text-white">{track.title}</h4>
<p className="text-sm text-gray-400">{track.artist}</p>
</div>

<button
onClick={(e) => {
e.stopPropagation();
toggleLike(track.id);
}}
className={`p-2 rounded-full hover:bg-gray-700 transition-colors ${
track.liked ? 'text-green-500' : 'text-gray-400'
}`}
>
<Heart className={`w-4 h-4 ${track.liked ? 'fill-current' : ''}`} />
</button>

<div className="text-sm text-gray-400 w-12 text-right">{track.duration}</div>
</div>
))}
</div>
</div>
</div>
</div>

{currentTrack && (
<div className="bg-gray-900 border-t border-gray-700 p-4">
<div className="flex items-center justify-between">
<div className="flex items-center space-x-3 flex-1">
<img
src={currentTrack.cover}
alt={currentTrack.album}
className="w-14 h-14 rounded object-cover"
/>
<div>
<h4 className="font-medium text-white">{currentTrack.title}</h4>
<p className="text-sm text-gray-400">{currentTrack.artist}</p>
</div>
<button
onClick={() => toggleLike(currentTrack.id)}
className={`p-2 rounded-full hover:bg-gray-700 transition-colors ${
currentTrack.liked ? 'text-green-500' : 'text-gray-400'
}`}
>
<Heart className={`w-4 h-4 ${currentTrack.liked ? 'fill-current' : ''}`} />
</button>
</div>

<div className="flex flex-col items-center space-y-2 flex-1">
<div className="flex items-center space-x-4">
<button
onClick={() => setIsShuffled(!isShuffled)}
className={`p-2 rounded-full hover:bg-gray-700 transition-colors ${
isShuffled ? 'text-green-500' : 'text-gray-400'
}`}
>
<Shuffle className="w-4 h-4" />
</button>

<button
onClick={previousTrack}
className="p-2 rounded-full hover:bg-gray-700 transition-colors text-white"
>
<SkipBack className="w-5 h-5" />
</button>

<button
onClick={togglePlay}
className="p-3 bg-white text-black rounded-full hover:scale-105 transition-transform"
>
{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
</button>

<button
onClick={nextTrack}
className="p-2 rounded-full hover:bg-gray-700 transition-colors text-white"
>
<SkipForward className="w-5 h-5" />
</button>

<button
onClick={() => setRepeatMode(repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off')}
className={`p-2 rounded-full hover:bg-gray-700 transition-colors ${
repeatMode !== 'off' ? 'text-green-500' : 'text-gray-400'
}`}
>
<Repeat className="w-4 h-4" />
</button>
</div>

<div className="flex items-center space-x-2 w-full max-w-md">
<span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
<input
type="range"
min="0"
max={duration || 0}
value={currentTime}
onChange={(e) => setCurrentTime(Number(e.target.value))}
className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
/>
<span className="text-xs text-gray-400">{currentTrack.duration}</span>
</div>
</div>

<div className="flex items-center space-x-2 flex-1 justify-end">
<button
onClick={() => setIsMuted(!isMuted)}
className="p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-400"
>
{isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
</button>
<input
type="range"
min="0"
max="100"
value={trackVolume}
onChange={(e) => setTrackVolume(Number(e.target.value))}
className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
/>
</div>
</div>

<audio
ref={audioRef}
onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
>
<source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</div>
)}
</div>
);
};

export default Spotify;