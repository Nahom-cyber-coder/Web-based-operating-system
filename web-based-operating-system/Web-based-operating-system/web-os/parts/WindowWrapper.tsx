import React, { useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import { Minimize, Maximize, X, Maximize2 } from 'lucide-react';

interface WindowWrapperProps {
title: string;
children: React.ReactNode;
onClose?: () => void;
onMinimize?: () => void;
onMaximize?: () => void;
onFocus?: () => void;
isActive?: boolean;
icon?: string;
initialSize?: { width: number; height: number };
initialPosition?: { x: number; y: number };
}

const WindowWrapper: React.FC<WindowWrapperProps> = ({
title,
children,
onClose,
onMinimize,
onMaximize,
onFocus,
isActive = true,
icon,
initialSize = { width: 800, height: 600 },
initialPosition
}) => {
const [isMaximized, setIsMaximized] = useState(false);
const [size, setSize] = useState(initialSize);
const [position, setPosition] = useState(() => {
if (initialPosition) return initialPosition;

const taskbarHeight = 48;
const screenW = window.innerWidth;
const screenH = window.innerHeight;

return {
x: Math.max(0, (screenW - initialSize.width) / 2),
y: Math.max(0, (screenH - initialSize.height - taskbarHeight) / 2)
};
});

const [normalSize, setNormalSize] = useState(initialSize);
const [normalPosition, setNormalPosition] = useState(position);

const taskbarHeight = 48;

const handleMaximize = () => {
if (isMaximized) {
setSize(normalSize);
setPosition(normalPosition);
setIsMaximized(false);
} else {
setNormalSize(size);
setNormalPosition(position);
setSize({ 
width: window.innerWidth, 
height: window.innerHeight - taskbarHeight 
});
setPosition({ x: 0, y: 0 });
setIsMaximized(true);
}
onMaximize?.();
};

const handleMinimize = () => {
onMinimize?.();
};

const handleDragStop = (e: any, d: any) => {
if (!isMaximized) {
setPosition({ x: d.x, y: d.y });
setNormalPosition({ x: d.x, y: d.y });
}
};

const handleResizeStop = (e: any, direction: any, ref: any, delta: any, pos: any) => {
if (!isMaximized) {
const newSize = {
width: ref.offsetWidth,
height: ref.offsetHeight
};
setSize(newSize);
setPosition(pos);
setNormalSize(newSize);
setNormalPosition(pos);
}
};

useEffect(() => {
const handleWindowResize = () => {
if (isMaximized) {
setSize({ 
width: window.innerWidth, 
height: window.innerHeight - taskbarHeight 
});
}
};

window.addEventListener('resize', handleWindowResize);
return () => window.removeEventListener('resize', handleWindowResize);
}, [isMaximized]);

return (
<Rnd
size={size}
position={position}
bounds="window"
onDragStop={handleDragStop}
onResizeStop={handleResizeStop}
enableResizing={!isMaximized}
disableDragging={isMaximized}
dragHandleClassName="window-drag-handle"
className={`bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-200 relative ${
isActive ? 'ring-2 ring-blue-500/50 z-50' : 'z-40'
}`}
onClick={onFocus}
minWidth={400}
minHeight={300}
style={{
zIndex: isActive ? 1000 : 900
}}
>
<div className="window-drag-handle h-10 bg-gray-100 dark:bg-gray-700 flex items-center justify-between px-4 select-none cursor-move border-b border-gray-200 dark:border-gray-600">
<div className="flex items-center space-x-2 flex-1 min-w-0">
{icon && <span className="text-sm flex-shrink-0">{icon}</span>}
<span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[400px]">
{title}
</span>
</div>

<div className="flex items-center space-x-1 flex-shrink-0">
<button
onClick={(e) => {
e.stopPropagation();
handleMinimize();
}}
className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
title="Minimize"
>
<Minimize className="w-4 h-4 text-gray-600 dark:text-gray-300" />
</button>

<button
onClick={(e) => {
e.stopPropagation();
handleMaximize();
}}
className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
title={isMaximized ? 'Restore' : 'Maximize'}
>
{isMaximized ? (
<Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
) : (
<Maximize className="w-4 h-4 text-gray-600 dark:text-gray-300" />
)}
</button>

{onClose && (
<button
onClick={(e) => {
e.stopPropagation();
onClose();
}}
className="p-1 rounded hover:bg-red-500 hover:text-white transition-colors"
title="Close"
>
<X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
</button>
)}
</div>
</div>

<div className="h-full overflow-hidden" style={{ height: 'calc(100% - 40px)' }}>
<div className="h-full overflow-auto">
{children}
</div>
</div>
</Rnd>
);
};

export default WindowWrapper;