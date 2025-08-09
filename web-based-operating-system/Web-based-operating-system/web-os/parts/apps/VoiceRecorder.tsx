import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Save, Trash2, MicOff, Headphones } from 'lucide-react';
import { useFileSystem } from '../../settings/FileSystemContext';
import { useDialog } from '../../settings/DialogContext';
import { useWindows } from '../../settings/WindowContext';
import { saveAudioFile, blobFromDataUrl, isFileSystemAccessSupported } from '../../tools/fileSystemAccess';

interface Recording {
id: string;
name: string;
blob: Blob;
dataUrl: string;
duration: number;
timestamp: Date;
}

const VoiceRecorder: React.FC = () => {
const [isRecording, setIsRecording] = useState(false);
const [isPaused, setIsPaused] = useState(false);
const [recordings, setRecordings] = useState<Recording[]>([]);
const [recordingTime, setRecordingTime] = useState(0);
const [playingId, setPlayingId] = useState<string | null>(null);
const [error, setError] = useState<string | null>(null);
const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

const mediaRecorderRef = useRef<MediaRecorder | null>(null);
const audioChunksRef = useRef<Blob[]>([]);
const timerRef = useRef<NodeJS.Timeout | null>(null);
const audioRef = useRef<HTMLAudioElement | null>(null);
const streamRef = useRef<MediaStream | null>(null);
const { createFile } = useFileSystem();
const { showAlert } = useDialog();
const { openWindow } = useWindows();

useEffect(() => {
return () => {
if (timerRef.current) {
clearInterval(timerRef.current);
}
if (streamRef.current) {
streamRef.current.getTracks().forEach(track => track.stop());
}
};
}, []);

const requestMicrophonePermission = async () => {
try {
const stream = await navigator.mediaDevices.getUserMedia({ 
audio: {
echoCancellation: true,
noiseSuppression: true,
sampleRate: 44100
}
});
setPermission('granted');
setError(null);
return stream;
} catch (err) {
setPermission('denied');
setError('Microphone access denied. Please allow microphone access and try again.');
return null;
}
};

const startRecording = async () => {
const stream = await requestMicrophonePermission();
if (!stream) return;

try {
streamRef.current = stream;
const mediaRecorder = new MediaRecorder(stream, {
mimeType: 'audio/webm;codecs=opus'
});
mediaRecorderRef.current = mediaRecorder;
audioChunksRef.current = [];

mediaRecorder.ondataavailable = (event) => {
if (event.data.size > 0) {
audioChunksRef.current.push(event.data);
}
};

mediaRecorder.onstop = async () => {
const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });

const reader = new FileReader();
reader.onload = () => {
const dataUrl = reader.result as string;
const newRecording: Recording = {
id: Date.now().toString(),
name: `Recording ${recordings.length + 1}`,
blob: audioBlob,
dataUrl: dataUrl,
duration: recordingTime,
timestamp: new Date()
};

setRecordings(prev => [...prev, newRecording]);
};
reader.readAsDataURL(audioBlob);

stream.getTracks().forEach(track => track.stop());
streamRef.current = null;
};

mediaRecorder.start();
setIsRecording(true);
setRecordingTime(0);

timerRef.current = setInterval(() => {
setRecordingTime(prev => prev + 1);
}, 1000);

} catch (err) {
setError('Failed to start recording. Please try again.');
}
};

const stopRecording = () => {
if (mediaRecorderRef.current && isRecording) {
mediaRecorderRef.current.stop();
setIsRecording(false);
setIsPaused(false);

if (timerRef.current) {
clearInterval(timerRef.current);
timerRef.current = null;
}
}
};

const pauseRecording = () => {
if (mediaRecorderRef.current && isRecording) {
if (isPaused) {
mediaRecorderRef.current.resume();
timerRef.current = setInterval(() => {
setRecordingTime(prev => prev + 1);
}, 1000);
} else {
mediaRecorderRef.current.pause();
if (timerRef.current) {
clearInterval(timerRef.current);
}
}
setIsPaused(!isPaused);
}
};

const playRecording = (recording: Recording) => {
if (playingId === recording.id) {
if (audioRef.current) {
audioRef.current.pause();
audioRef.current.currentTime = 0;
}
setPlayingId(null);
return;
}

const audio = new Audio(recording.dataUrl);
audioRef.current = audio;

audio.onended = () => {
setPlayingId(null);
};

audio.play();
setPlayingId(recording.id);
};

const handleSaveToSystem = async (recording: Recording) => {
const fileName = `${recording.name.replace(/\s+/g, '-')}-${Date.now()}.wav`;
const success = await saveAudioFile(recording.blob, fileName);

if (success) {
showAlert('Recording Saved', `Recording saved to your system as ${fileName}`, 'success');
} else {
showAlert('Save Failed', 'Failed to save recording to system. Try saving to virtual file system instead.', 'error');
}
};

const handleSaveToVirtualFS = (recording: Recording) => {
const fileName = `${recording.name.replace(/\s+/g, '-')}-${Date.now()}.wav`;

// Save to current-user folder (Users/user)
createFile(fileName, recording.dataUrl, 'current-user');

showAlert(
'Recording Saved', 
'✅ Your file has been saved. You can find it in the Users folder inside the C: Drive.', 
'success'
);
};

const openInAudioPlayer = (recording: Recording) => {
const fileName = `${recording.name}-${Date.now()}.wav`;

let dataUrl = recording.dataUrl;
if (!dataUrl.startsWith('data:audio/')) {
dataUrl = dataUrl.replace(/^data:[^;]+/, 'data:audio/wav');
}

createFile(fileName, dataUrl, 'music');

setTimeout(() => {
openWindow({
title: 'Audio Player',
appId: 'audio-player',
position: 'center',
size: { width: 800, height: 600 },
icon: '🎵'
});
}, 100);
};

const deleteRecording = (id: string) => {
if (confirm('Are you sure you want to delete this recording?')) {
setRecordings(prev => prev.filter(r => r.id !== id));

if (playingId === id) {
setPlayingId(null);
if (audioRef.current) {
audioRef.current.pause();
}
}
}
};

const formatTime = (seconds: number) => {
const mins = Math.floor(seconds / 60);
const secs = seconds % 60;
return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const formatDate = (date: Date) => {
return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

if (permission === 'denied' || error) {
return (
<div className="h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
<div className="text-center">
<MicOff className="w-16 h-16 mx-auto mb-4 text-gray-400" />
<h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Microphone Access Required</h2>
<p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
{error || 'This app needs access to your microphone to record audio. Please allow microphone access in your browser settings.'}
</p>
<button
onClick={requestMicrophonePermission}
className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
>
Grant Access
</button>
</div>
</div>
);
}

return (
<div className="h-full bg-gray-100 dark:bg-gray-900 flex flex-col">
<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
<div className="flex items-center space-x-2">
<Mic className="w-6 h-6 text-red-500" />
<h1 className="text-xl font-semibold text-gray-900 dark:text-white">Voice Recorder</h1>
</div>
</div>

<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
<div className="text-center">
<div className="text-4xl font-mono text-gray-900 dark:text-white mb-6">
{formatTime(recordingTime)}
</div>

<div className="flex items-center justify-center space-x-6 mb-6">
{!isRecording ? (
<button
onClick={startRecording}
className="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
>
<Mic className="w-8 h-8" />
</button>
) : (
<>
<button
onClick={pauseRecording}
className="w-12 h-12 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full flex items-center justify-center transition-colors"
>
{isPaused ? <Play className="w-6 h-6" /> : <span>⏸</span>}
</button>

<button
onClick={stopRecording}
className="w-16 h-16 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors"
>
<Square className="w-8 h-8" />
</button>
</>
)}
</div>

{isRecording && (
<div className="mt-4">
<div className="flex items-center justify-center space-x-2">
<div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
<span className="text-red-500 font-medium">
{isPaused ? 'Paused' : 'Recording...'}
</span>
</div>
</div>
)}
</div>
</div>

<div className="flex-1 p-4 overflow-y-auto">
<h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
Recordings ({recordings.length})
</h2>

{recordings.length === 0 ? (
<div className="text-center py-8 text-gray-500 dark:text-gray-400">
<Mic className="w-12 h-12 mx-auto mb-2 opacity-50" />
<p>No recordings yet. Start recording to create your first audio file.</p>
</div>
) : (
<div className="space-y-2">
{recordings.map((recording) => (
<div
key={recording.id}
className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
>
<div className="flex items-center justify-between">
<div className="flex-1">
<h3 className="font-medium text-gray-900 dark:text-white">{recording.name}</h3>
<div className="text-sm text-gray-500 dark:text-gray-400">
<span>{formatTime(recording.duration)}</span>
<span className="mx-2">•</span>
<span>{formatDate(recording.timestamp)}</span>
</div>
</div>

<div className="flex items-center space-x-2">
<button
onClick={() => playRecording(recording)}
className={`p-2 rounded-lg transition-colors ${
playingId === recording.id
? 'bg-red-500 hover:bg-red-600 text-white'
: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
}`}
>
{playingId === recording.id ? (
<Square className="w-4 h-4" />
) : (
<Play className="w-4 h-4" />
)}
</button>

<button
onClick={() => handleSaveToSystem(recording)}
className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
title={isFileSystemAccessSupported() ? 'Save to System' : 'Download'}
>
<Save className="w-4 h-4" />
</button>

<button
onClick={() => handleSaveToVirtualFS(recording)}
className="p-2 bg-purple-200 dark:bg-purple-700 hover:bg-purple-300 dark:hover:bg-purple-600 text-purple-700 dark:text-purple-300 rounded-lg transition-colors"
title="Save to Virtual File System"
>
<Save className="w-4 h-4" />
</button>

<button
onClick={() => openInAudioPlayer(recording)}
className="p-2 bg-blue-200 dark:bg-blue-700 hover:bg-blue-300 dark:hover:bg-blue-600 text-blue-700 dark:text-blue-300 rounded-lg transition-colors"
>
<Headphones className="w-4 h-4" />
</button>

<button
onClick={() => deleteRecording(recording.id)}
className="p-2 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-colors"
>
<Trash2 className="w-4 h-4" />
</button>
</div>
</div>
</div>
))}
</div>
)}
</div>

</div>
);
};

export default VoiceRecorder;