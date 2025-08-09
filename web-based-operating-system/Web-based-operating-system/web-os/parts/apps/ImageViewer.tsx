import React, { useState, useEffect, useCallback } from 'react';
import { useFileSystem } from '../../settings/FileSystemContext';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download, Trash2, X } from 'lucide-react';

interface ImageViewerProps {
initialImageId?: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ initialImageId }) => {
const { items, deleteItem } = useFileSystem();
const [currentImageIndex, setCurrentImageIndex] = useState(0);
const [zoom, setZoom] = useState(100);
const [rotation, setRotation] = useState(0);
const [imageFiles, setImageFiles] = useState<any[]>([]);
const [isLoading, setIsLoading] = useState(false);

const getAllImageFiles = useCallback(() => {
return items.filter(item => 
item.type === 'file' && 
!item.isDeleted &&
(item.content?.startsWith('data:image/') || 
item.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/))
);
}, [items]);

useEffect(() => {
const newImageFiles = getAllImageFiles();
setImageFiles(newImageFiles);

if (initialImageId && newImageFiles.length > 0) {
const index = newImageFiles.findIndex(img => img.id === initialImageId);
if (index !== -1) {
setCurrentImageIndex(index);
} else {
setCurrentImageIndex(0);
}
} else if (newImageFiles.length > 0) {
setCurrentImageIndex(prev => Math.min(prev, newImageFiles.length - 1));
}
}, [items, initialImageId, getAllImageFiles]);

const currentImage = imageFiles[currentImageIndex];

const navigateToImage = useCallback((newIndex: number) => {
if (newIndex < 0 || newIndex >= imageFiles.length) return;

setIsLoading(true);
setCurrentImageIndex(newIndex);
setZoom(100);
setRotation(0);

setTimeout(() => setIsLoading(false), 100);
}, [imageFiles.length]);

const nextImage = useCallback(() => {
if (imageFiles.length === 0) return;

const nextIndex = currentImageIndex >= imageFiles.length - 1 ? 0 : currentImageIndex + 1;
navigateToImage(nextIndex);
}, [currentImageIndex, imageFiles.length, navigateToImage]);

const previousImage = useCallback(() => {
if (imageFiles.length === 0) return;

const prevIndex = currentImageIndex <= 0 ? imageFiles.length - 1 : currentImageIndex - 1;
navigateToImage(prevIndex);
}, [currentImageIndex, imageFiles.length, navigateToImage]);

const zoomIn = useCallback(() => {
setZoom(prev => Math.min(prev + 25, 500));
}, []);

const zoomOut = useCallback(() => {
setZoom(prev => Math.max(prev - 25, 25));
}, []);

const rotate = useCallback(() => {
setRotation(prev => (prev + 90) % 360);
}, []);

const downloadImage = useCallback(() => {
if (!currentImage || !currentImage.content) return;

const link = document.createElement('a');
link.href = currentImage.content;
link.download = currentImage.name;
link.click();
}, [currentImage]);

const deleteCurrentImage = useCallback(() => {
if (!currentImage) return;

if (confirm(`Are you sure you want to delete "${currentImage.name}"?`)) {
const currentIndex = currentImageIndex;
deleteItem(currentImage.id);

if (imageFiles.length <= 1) {
return;
}

if (currentIndex >= imageFiles.length - 1) {
setCurrentImageIndex(Math.max(0, imageFiles.length - 2));
}
}
}, [currentImage, currentImageIndex, imageFiles.length, deleteItem]);

useEffect(() => {
const handleKeyDown = (e: KeyboardEvent) => {
switch (e.key) {
case 'ArrowLeft':
e.preventDefault();
previousImage();
break;
case 'ArrowRight':
e.preventDefault();
nextImage();
break;
case 'Escape':
e.preventDefault();
break;
case '+':
case '=':
e.preventDefault();
zoomIn();
break;
case '-':
e.preventDefault();
zoomOut();
break;
case 'r':
case 'R':
e.preventDefault();
rotate();
break;
}
};

window.addEventListener('keydown', handleKeyDown);
return () => window.removeEventListener('keydown', handleKeyDown);
}, [nextImage, previousImage, zoomIn, zoomOut, rotate]);

if (imageFiles.length === 0) {
return (
<div className="h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
<div className="text-center">
<div className="text-6xl mb-4">🖼️</div>
<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Images Found</h2>
<p className="text-gray-600 dark:text-gray-400">
Take some photos with the Camera app or add images to your file system.
</p>
</div>
</div>
);
}

return (
<div className="h-full bg-black flex flex-col">
<div className="bg-gray-900 p-4 flex items-center justify-between flex-shrink-0">
<div className="flex items-center space-x-4">
<h1 className="text-white font-semibold">{currentImage?.name || 'Loading...'}</h1>
<span className="text-gray-400 text-sm">
{currentImageIndex + 1} of {imageFiles.length}
</span>
</div>

<div className="flex items-center space-x-2">
<button
onClick={zoomOut}
disabled={zoom <= 25}
className="p-2 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
title="Zoom Out"
>
<ZoomOut className="w-5 h-5" />
</button>

<span className="text-white text-sm min-w-16 text-center">{zoom}%</span>

<button
onClick={zoomIn}
disabled={zoom >= 500}
className="p-2 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
title="Zoom In"
>
<ZoomIn className="w-5 h-5" />
</button>

<button
onClick={rotate}
className="p-2 text-white hover:bg-gray-700 rounded transition-colors"
title="Rotate"
>
<RotateCw className="w-5 h-5" />
</button>

<button
onClick={downloadImage}
disabled={!currentImage?.content}
className="p-2 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
title="Download"
>
<Download className="w-5 h-5" />
</button>

<button
onClick={deleteCurrentImage}
disabled={!currentImage}
className="p-2 text-red-400 hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
title="Delete"
>
<Trash2 className="w-5 h-5" />
</button>
</div>
</div>

<div className="flex-1 relative overflow-hidden flex items-center justify-center">
{isLoading ? (
<div className="flex items-center justify-center">
<div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
</div>
) : currentImage && currentImage.content ? (
<img
key={currentImage.id}
src={currentImage.content}
alt={currentImage.name}
className="max-w-none transition-all duration-300 ease-in-out"
style={{
transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
maxHeight: zoom <= 100 ? '100%' : 'none',
maxWidth: zoom <= 100 ? '100%' : 'none'
}}
onLoad={() => setIsLoading(false)}
onError={() => setIsLoading(false)}
/>
) : (
<div className="text-white text-center">
<div className="text-6xl mb-4">❌</div>
<p>Failed to load image</p>
</div>
)}

{imageFiles.length > 1 && !isLoading && (
<>
<button
onClick={previousImage}
className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 hover:scale-110"
title="Previous Image (←)"
>
<ChevronLeft className="w-6 h-6" />
</button>

<button
onClick={nextImage}
className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 hover:scale-110"
title="Next Image (→)"
>
<ChevronRight className="w-6 h-6" />
</button>
</>
)}
</div>

{imageFiles.length > 1 && (
<div className="bg-gray-900 p-4 flex-shrink-0">
<div className="flex space-x-2 overflow-x-auto">
{imageFiles.map((image, index) => (
<button
key={image.id}
onClick={() => navigateToImage(index)}
className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all duration-200 ${
index === currentImageIndex 
? 'border-blue-500 scale-110' 
: 'border-gray-600 hover:border-gray-400 hover:scale-105'
}`}
>
{image.content && (
<img
src={image.content}
alt={image.name}
className="w-full h-full object-cover"
loading="lazy"
/>
)}
</button>
))}
</div>
</div>
)}
</div>
);
};

export default ImageViewer;