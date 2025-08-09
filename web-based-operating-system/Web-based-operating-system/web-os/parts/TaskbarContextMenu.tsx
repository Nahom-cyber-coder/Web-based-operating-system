import React from 'react';
import { useWindows } from '../settings/WindowContext';
import { Activity, Monitor, Layers, LayoutGrid, Lock } from 'lucide-react';

interface TaskbarContextMenuProps {
position: { x: number; y: number };
onClose: () => void;
}

const TaskbarContextMenu: React.FC<TaskbarContextMenuProps> = ({ position, onClose }) => {
const { windows, minimizeWindow } = useWindows();
const { openWindow } = useWindows();

const handleTaskManager = () => {
openWindow({
title: 'Task Manager',
appId: 'task-manager',
position: 'center',
size: { width: 800, height: 600 },
icon: '📊'
});
onClose();
};

const handleShowDesktop = () => {
windows.forEach(window => {
if (!window.isMinimized) {
minimizeWindow(window.id);
}
});
onClose();
};

const handleCascadeWindows = () => {
windows.forEach((window, index) => {
if (!window.isMinimized) {
const offset = index * 30;
}
});
onClose();
};

return (
<>
<div 
className="fixed inset-0 z-40"
onClick={onClose}
/>
<div
className="fixed bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl py-2 min-w-48 z-[9999]"
style={{
left: position.x,
top: position.y - 200,
}}
>
<button
onClick={handleTaskManager}
className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
<Activity className="w-4 h-4 text-white/80" />
<span className="text-white text-sm">Task Manager</span>
</button>

<button
onClick={handleShowDesktop}
className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
<Monitor className="w-4 h-4 text-white/80" />
<span className="text-white text-sm">Show Desktop</span>
</button>

<hr className="my-1 border-white/10" />

<button
onClick={handleCascadeWindows}
className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
<Layers className="w-4 h-4 text-white/80" />
<span className="text-white text-sm">Cascade Windows</span>
</button>

<button
onClick={() => {
onClose();
}}
className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
<LayoutGrid className="w-4 h-4 text-white/80" />
<span className="text-white text-sm">Show Windows Side by Side</span>
</button>

<hr className="my-1 border-white/10" />

<button
onClick={() => {
onClose();
}}
className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
<Lock className="w-4 h-4 text-white/80" />
<span className="text-white text-sm">Lock the Taskbar</span>
</button>
</div>
</>
);
};

export default TaskbarContextMenu;