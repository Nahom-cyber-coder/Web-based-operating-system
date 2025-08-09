import React, { useRef, useEffect, useState } from 'react';
import { Camera, Circle, RotateCcw, Eye } from 'lucide-react';
import { useFileSystem } from '../../settings/FileSystemContext';
import { useDialog } from '../../settings/DialogContext';
import { useWindows } from '../../settings/WindowContext';

const CameraApp: React.FC = () => {
const videoRef = useRef<HTMLVideoElement>(null);
const canvasRef = useRef<HTMLCanvasElement>(null);
const [stream, setStream] = useState<MediaStream | null>(null);
const [capturedImage, setCapturedImage] = useState<string | null>(null);
const [error, setError] = useState<string | null>(null);
const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

const { createFile } = useFileSystem();
const { showAlert } = useDialog();
const { openWindow } = useWindows();

useEffect(() => {
startCamera();

return () => {
if (stream) {
stream.getTracks().forEach(track => track.stop());
}
};
}, []);

const startCamera = async () => {
try {
const mediaStream = await navigator.mediaDevices.getUserMedia({
video: {
width: { ideal: 1280 },
height: { ideal: 720 }
}
});

setStream(mediaStream);
setCameraPermission('granted');
setError(null);

if (videoRef.current) {
videoRef.current.srcObject = mediaStream;
}
} catch (err) {
setCameraPermission('denied');
setError('Camera access denied. Please allow camera access and refresh the page.');
}
};

const capturePhoto = () => {
if (!videoRef.current || !canvasRef.current) return;

const canvas = canvasRef.current;
const video = videoRef.current;
const context = canvas.getContext('2d');

if (context) {
canvas.width = video.videoWidth;
canvas.height = video.videoHeight;

context.drawImage(video, 0, 0, canvas.width, canvas.height);

canvas.toBlob((blob) => {
if (blob) {
const reader = new FileReader();
reader.onload = () => {
const dataUrl = reader.result as string;
setCapturedImage(dataUrl);

const fileName = `photo-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;

// Save to current-user folder (Users/user)
createFile(fileName, dataUrl, 'current-user');

showAlert(
'Photo Saved', 
'✅ Your file has been saved. You can find it in the Users folder inside the C: Drive.', 
'success'
);
};
reader.readAsDataURL(blob);
}
}, 'image/png', 0.95);
}
};

const viewInImageViewer = () => {
openWindow({
title: 'Image Viewer',
appId: 'image-viewer',
position: 'center',
size: { width: 900, height: 700 },
icon: '🖼️'
});

setCapturedImage(null);
};

const retakePhoto = () => {
setCapturedImage(null);
};

if (cameraPermission === 'denied' || error) {
return (
<div className="h-full bg-gray-900 flex items-center justify-center">
<div className="text-center text-white">
<Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
<h2 className="text-xl font-semibold mb-2">Camera Access Required</h2>
<p className="text-gray-400 mb-4 max-w-md">
{error || 'This app needs access to your camera to take photos. Please allow camera access in your browser settings.'}
</p>
<button
onClick={startCamera}
className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
>
Try Again
</button>
</div>
</div>
);
}

return (
<div className="h-full bg-gray-900 flex flex-col overflow-hidden">
<div className="bg-gray-800 p-3 flex items-center justify-between flex-shrink-0">
<div className="flex items-center space-x-2">
<Camera className="w-6 h-6 text-white" />
<h1 className="text-white font-semibold">Camera</h1>
</div>
<div className="text-sm text-gray-300">
Photos auto-save to Pictures folder
</div>
</div>

<div className="flex-1 relative overflow-hidden">
{capturedImage ? (
<div className="h-full flex items-center justify-center bg-black overflow-hidden">
<img
src={capturedImage}
alt="Captured"
className="w-full h-full object-contain"
/>
</div>
) : (
<div className="h-full flex items-center justify-center bg-black overflow-hidden">
<video
ref={videoRef}
autoPlay
playsInline
muted
className="w-full h-full object-contain"
/>
</div>
)}

<canvas ref={canvasRef} className="hidden" />
</div>

<div className="bg-gray-800 p-4 flex-shrink-0">
<div className="flex items-center justify-center space-x-6">
{capturedImage ? (
<>
<button
onClick={retakePhoto}
className="flex items-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
>
<RotateCcw className="w-5 h-5" />
<span>Retake</span>
</button>

<button
onClick={viewInImageViewer}
className="flex items-center space-x-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
>
<Eye className="w-5 h-5" />
<span>View in Pictures</span>
</button>
</>
) : (
<button
onClick={capturePhoto}
disabled={!stream}
className="w-14 h-14 bg-white hover:bg-gray-200 disabled:bg-gray-400 rounded-full flex items-center justify-center transition-colors"
>
<Circle className="w-7 h-7 text-gray-800" />
</button>
)}
</div>
</div>
</div>
);
};

export default CameraApp;