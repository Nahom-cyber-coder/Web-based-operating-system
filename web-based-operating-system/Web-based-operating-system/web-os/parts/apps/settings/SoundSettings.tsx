import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../../../settings/OSContext';
import { Volume2, VolumeX, TestTube, Play, Pause } from 'lucide-react';

const SoundSettings: React.FC = () => {
const { volume, setVolume } = useOS();
const [isMuted, setIsMuted] = useState(false);
const [isTestPlaying, setIsTestPlaying] = useState(false);
const audioRef = useRef<HTMLAudioElement>(null);

const createTestTone = () => {
try {
const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
const oscillator = audioContext.createOscillator();
const gainNode = audioContext.createGain();

oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);

oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
oscillator.type = 'sine';

gainNode.gain.setValueAtTime(0, audioContext.currentTime);
gainNode.gain.linearRampToValueAtTime(0.3 * (volume / 100), audioContext.currentTime + 0.1);
gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);

oscillator.start(audioContext.currentTime);
oscillator.stop(audioContext.currentTime + 1);

return new Promise(resolve => {
setTimeout(resolve, 1000);
});
} catch (error) {
return Promise.resolve();
}
};

const handleTestSound = async () => {
if (isTestPlaying) return;

setIsTestPlaying(true);
try {
await createTestTone();
} catch (error) {
}
setIsTestPlaying(false);
};

const handleVolumeChange = (newVolume: number) => {
setVolume(newVolume);
if (newVolume === 0) {
setIsMuted(true);
} else if (isMuted) {
setIsMuted(false);
}
};

const toggleMute = () => {
setIsMuted(!isMuted);
};

return (
<div className="space-y-6">
<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sound Settings</h3>

<div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
<div className="flex items-center justify-between mb-4">
<div className="flex items-center space-x-3">
{isMuted || volume === 0 ? (
<VolumeX className="w-6 h-6 text-red-500" />
) : (
<Volume2 className="w-6 h-6 text-blue-500" />
)}
<div>
<h4 className="font-medium text-gray-900 dark:text-white">Master Volume</h4>
<p className="text-sm text-gray-600 dark:text-gray-400">
Controls system-wide audio level
</p>
</div>
</div>
<button
onClick={toggleMute}
className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
>
{isMuted ? (
<VolumeX className="w-5 h-5 text-red-500" />
) : (
<Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
)}
</button>
</div>

<div className="space-y-3">
<div className="flex items-center space-x-4">
<span className="text-sm text-gray-600 dark:text-gray-400 w-8">0%</span>
<input
type="range"
min="0"
max="100"
value={isMuted ? 0 : volume}
onChange={(e) => handleVolumeChange(Number(e.target.value))}
className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
/>
<span className="text-sm text-gray-600 dark:text-gray-400 w-12">100%</span>
</div>

<div className="text-center">
<span className="text-lg font-semibold text-gray-900 dark:text-white">
{isMuted ? 'Muted' : `${volume}%`}
</span>
</div>
</div>
</div>

<div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
<div className="flex items-center justify-between">
<div className="flex items-center space-x-3">
<TestTube className="w-6 h-6 text-green-500" />
<div>
<h4 className="font-medium text-gray-900 dark:text-white">Test Sound</h4>
<p className="text-sm text-gray-600 dark:text-gray-400">
Play a test tone to check your audio
</p>
</div>
</div>
<button
onClick={handleTestSound}
disabled={isTestPlaying || isMuted || volume === 0}
className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
>
{isTestPlaying ? (
<>
<Pause className="w-4 h-4" />
<span>Playing...</span>
</>
) : (
<>
<Play className="w-4 h-4" />
<span>Test Sound</span>
</>
)}
</button>
</div>
</div>

<div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
<h4 className="font-medium text-gray-900 dark:text-white mb-4">Audio Devices</h4>
<div className="space-y-3">
<div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
<div>
<p className="font-medium text-gray-900 dark:text-white">Default Audio Device</p>
<p className="text-sm text-gray-600 dark:text-gray-400">System Default</p>
</div>
<span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
Active
</span>
</div>
</div>
</div>

<div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
<h4 className="font-medium text-gray-900 dark:text-white mb-4">System Sounds</h4>
<div className="space-y-3">
<div className="flex items-center justify-between">
<span className="text-sm text-gray-700 dark:text-gray-300">Notification sounds</span>
<button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
<span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
</button>
</div>
<div className="flex items-center justify-between">
<span className="text-sm text-gray-700 dark:text-gray-300">Window sounds</span>
<button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700">
<span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
</button>
</div>
<div className="flex items-center justify-between">
<span className="text-sm text-gray-700 dark:text-gray-300">Error sounds</span>
<button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
<span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
</button>
</div>
</div>
</div>

<audio ref={audioRef} className="hidden">
<source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWTwwNUKvn8LdlGgU6ktjzxnkpBSl+zPDajjkJGGS57OihUgwLTKXh8bllHgU2jdXzzn0vBSF1xe7dkz8JE1u16OyrWBELRJzd8sFuIAUuhM/z3Is2Bhxqvu7mnEoODlCq5O+2ZRoFOpPY88Z5KQUpfsz" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</div>
);
};

export default SoundSettings;