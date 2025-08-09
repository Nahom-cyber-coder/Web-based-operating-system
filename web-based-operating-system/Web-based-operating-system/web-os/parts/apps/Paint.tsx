import React, { useRef, useState, useEffect } from 'react';
import { Brush, Eraser, Palette, Square, Circle, Minus, Save, Trash2 } from 'lucide-react';
import { useFileSystem } from '../../settings/FileSystemContext';
import { useDialog } from '../../settings/DialogContext';
import { saveImageFile, isFileSystemAccessSupported } from '../../tools/fileSystemAccess';

const Paint: React.FC = () => {
const canvasRef = useRef<HTMLCanvasElement>(null);
const [isDrawing, setIsDrawing] = useState(false);
const [tool, setTool] = useState<'brush' | 'eraser' | 'line' | 'rectangle' | 'circle'>('brush');
const [color, setColor] = useState('#000000');
const [brushSize, setBrushSize] = useState(5);
const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
const { createFile } = useFileSystem();
const { showAlert } = useDialog();

const colors = [
'#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF',
'#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A', '#808080'
];

useEffect(() => {
const canvas = canvasRef.current;
if (canvas) {
const ctx = canvas.getContext('2d');
if (ctx) {
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);
}
}
}, []);

const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
const canvas = canvasRef.current;
if (!canvas) return { x: 0, y: 0 };

const rect = canvas.getBoundingClientRect();
return {
x: e.clientX - rect.left,
y: e.clientY - rect.top
};
};

const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
const canvas = canvasRef.current;
if (!canvas) return;

const ctx = canvas.getContext('2d');
if (!ctx) return;

setIsDrawing(true);
const pos = getMousePos(e);
setLastPoint(pos);

ctx.beginPath();
ctx.moveTo(pos.x, pos.y);
};

const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
if (!isDrawing || !lastPoint) return;

const canvas = canvasRef.current;
if (!canvas) return;

const ctx = canvas.getContext('2d');
if (!ctx) return;

const pos = getMousePos(e);

if (tool === 'brush') {
ctx.globalCompositeOperation = 'source-over';
ctx.strokeStyle = color;
ctx.lineWidth = brushSize;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.lineTo(pos.x, pos.y);
ctx.stroke();
} else if (tool === 'eraser') {
ctx.globalCompositeOperation = 'destination-out';
ctx.lineWidth = brushSize;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.lineTo(pos.x, pos.y);
ctx.stroke();
}

setLastPoint(pos);
};

const stopDrawing = () => {
setIsDrawing(false);
setLastPoint(null);
};

const clearCanvas = () => {
const canvas = canvasRef.current;
if (!canvas) return;

const ctx = canvas.getContext('2d');
if (!ctx) return;

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const saveCanvas = () => {
const canvas = canvasRef.current;
if (!canvas) return;

canvas.toBlob(async (blob) => {
if (!blob) return;

const fileName = `painting-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;

if (isFileSystemAccessSupported()) {
const success = await saveImageFile(blob, fileName);
if (success) {
showAlert('Painting Saved', 'Painting saved to your system successfully!', 'success');
} else {
const dataUrl = canvas.toDataURL('image/png');
createFile(fileName, dataUrl, 'pictures');
showAlert('Painting Saved', `Painting saved to Pictures folder as ${fileName}`, 'success');
}
} else {
const dataUrl = canvas.toDataURL('image/png');
createFile(fileName, dataUrl, 'pictures');
showAlert('Painting Saved', `Painting saved to Pictures folder as ${fileName}`, 'success');
}
}, 'image/png', 0.95);
};

const ToolButton: React.FC<{
icon: React.ComponentType<any>;
isActive: boolean;
onClick: () => void;
title: string;
}> = ({ icon: Icon, isActive, onClick, title }) => (
<button
onClick={onClick}
title={title}
className={`p-2 rounded-lg transition-colors ${
isActive 
? 'bg-blue-500 text-white' 
: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
}`}
>
<Icon className="w-5 h-5" />
</button>
);

return (
<div className="h-full bg-gray-100 dark:bg-gray-900 flex flex-col">
<div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
<div className="flex items-center space-x-4">
<div className="flex items-center space-x-2">
<ToolButton
icon={Brush}
isActive={tool === 'brush'}
onClick={() => setTool('brush')}
title="Brush"
/>
<ToolButton
icon={Eraser}
isActive={tool === 'eraser'}
onClick={() => setTool('eraser')}
title="Eraser"
/>
<ToolButton
icon={Minus}
isActive={tool === 'line'}
onClick={() => setTool('line')}
title="Line"
/>
<ToolButton
icon={Square}
isActive={tool === 'rectangle'}
onClick={() => setTool('rectangle')}
title="Rectangle"
/>
<ToolButton
icon={Circle}
isActive={tool === 'circle'}
onClick={() => setTool('circle')}
title="Circle"
/>
</div>

<div className="flex items-center space-x-2">
<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
Size:
</label>
<input
type="range"
min="1"
max="50"
value={brushSize}
onChange={(e) => setBrushSize(Number(e.target.value))}
className="w-20"
/>
<span className="text-sm text-gray-600 dark:text-gray-400 min-w-8">
{brushSize}
</span>
</div>

<div className="flex items-center space-x-2">
<Palette className="w-5 h-5 text-gray-600 dark:text-gray-300" />
<div className="grid grid-cols-6 gap-1">
{colors.map((c) => (
<button
key={c}
onClick={() => setColor(c)}
className={`w-6 h-6 rounded border-2 ${
color === c ? 'border-gray-800 dark:border-gray-200' : 'border-gray-300 dark:border-gray-600'
}`}
style={{ backgroundColor: c }}
/>
))}
</div>
<input
type="color"
value={color}
onChange={(e) => setColor(e.target.value)}
className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600"
/>
</div>
</div>

<div className="flex items-center space-x-2">
<button
onClick={saveCanvas}
className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
>
<Save className="w-4 h-4" />
<span>Save</span>
</button>
<button
onClick={clearCanvas}
className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
>
<Trash2 className="w-4 h-4" />
<span>Clear</span>
</button>
</div>
</div>

<div className="flex-1 p-4 overflow-hidden">
<div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden">
<canvas
ref={canvasRef}
width={800}
height={600}
className="w-full h-full cursor-crosshair"
onMouseDown={startDrawing}
onMouseMove={draw}
onMouseUp={stopDrawing}
onMouseLeave={stopDrawing}
/>
</div>
</div>
</div>
);
};

export default Paint;