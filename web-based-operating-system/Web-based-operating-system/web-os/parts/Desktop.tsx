import React, { useEffect, useState } from 'react';
import { useTheme } from '../settings/ThemeContext';
import { useAuth } from '../helpers/useAuth';
import { useWindows } from '../settings/WindowContext';
import { useKeyboardShortcuts } from '../helpers/useKeyboardShortcuts';
import { useImmersiveMode } from '../helpers/useImmersiveMode';
import Taskbar from './Taskbar';
import WindowManager from './WindowManager';
import StartMenu from './StartMenu';
import NotificationCenter from './NotificationCenter';
import ContextMenu from './ContextMenu';
import LockScreen from './LockScreen';
import ImmersiveModeModal from './ImmersiveModeModal';
import DesktopContextMenu from './DesktopContextMenu';

interface DesktopIcon {
id: string;
name: string;
icon: string;
appId: string;
position: { x: number; y: number };
}

const Desktop: React.FC = () => {
const { wallpaper } = useTheme();
const { isLocked } = useAuth();
const { openWindow } = useWindows();
const [showDesktopContextMenu, setShowDesktopContextMenu] = useState(false);
const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
const [desktopIcons, setDesktopIcons] = useState<DesktopIcon[]>([]);
const [iconsInitialized, setIconsInitialized] = useState(false);
const [draggedIcon, setDraggedIcon] = useState<string | null>(null);
const [showIconContextMenu, setShowIconContextMenu] = useState(false);
const [iconContextMenuPosition, setIconContextMenuPosition] = useState({ x: 0, y: 0 });
const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

useKeyboardShortcuts();
useImmersiveMode();

useEffect(() => {
if (!iconsInitialized) {
const defaultIcons: DesktopIcon[] = [
{ id: 'readme', name: 'README.txt', icon: '📄', appId: 'readme', position: { x: 20, y: 20 } },
{ id: 'this-pc', name: 'This PC', icon: '💻', appId: 'this-pc', position: { x: 20, y: 120 } },
{ id: 'recycle-bin', name: 'Recycle Bin', icon: '🗑️', appId: 'recycle-bin', position: { x: 20, y: 220 } },
{ id: 'text-editor', name: 'Text Editor', icon: '📝', appId: 'text-editor', position: { x: 20, y: 320 } },
{ id: 'control-panel', name: 'Control Panel', icon: '🎛️', appId: 'control-panel', position: { x: 20, y: 420 } },
{ id: 'browser', name: 'Browser', icon: '🌐', appId: 'browser', position: { x: 20, y: 520 } },
{ id: 'settings', name: 'Settings', icon: '⚙️', appId: 'settings', position: { x: 20, y: 620 } },
{ id: 'checkers', name: 'Checkers', icon: '🏁', appId: 'checkers', position: { x: 20, y: 720 } },
{ id: 'voice-recorder', name: 'Voice Recorder', icon: '🎤', appId: 'voice-recorder', position: { x: 20, y: 820 } },
];

const savedIcons = localStorage.getItem('desktopIcons');
if (savedIcons) {
setDesktopIcons(JSON.parse(savedIcons));
} else {
setDesktopIcons(defaultIcons);
localStorage.setItem('desktopIcons', JSON.stringify(defaultIcons));
}
setIconsInitialized(true);
}
}, [iconsInitialized]);

useEffect(() => {
if (iconsInitialized && desktopIcons.length > 0) {
localStorage.setItem('desktopIcons', JSON.stringify(desktopIcons));
}
}, [desktopIcons, iconsInitialized]);

useEffect(() => {
const handleKeyDown = (e: KeyboardEvent) => {
if (e.ctrlKey && (e.key === 'r' || e.key === 'R')) {
e.preventDefault();
}
if (e.key === 'F5') {
e.preventDefault();
}
};

window.addEventListener('keydown', handleKeyDown);
return () => window.removeEventListener('keydown', handleKeyDown);
}, []);

const handleIconDoubleClick = (icon: DesktopIcon) => {
if (icon.appId === 'readme') {
openWindow({
title: 'README.txt - Text Editor',
appId: 'text-editor',
props: { fileId: 'readme' },
position: 'center',
size: { width: 800, height: 600 },
icon: '📄'
});
} else if (icon.appId === 'this-pc') {
openWindow({
title: 'This PC',
appId: 'file-explorer',
props: { initialPath: null },
position: 'center',
size: { width: 900, height: 600 },
icon: '💻'
});
} else if (icon.appId === 'recycle-bin') {
openWindow({
title: 'Recycle Bin',
appId: 'recycle-bin',
position: 'center',
size: { width: 800, height: 600 },
icon: '🗑️'
});
} else {
openWindow({
title: icon.name,
appId: icon.appId,
position: 'center',
size: { width: 800, height: 600 },
icon: icon.icon
});
}
};

const handleIconRightClick = (e: React.MouseEvent, icon: DesktopIcon) => {
e.preventDefault();
e.stopPropagation();
setSelectedIcon(icon.id);
setIconContextMenuPosition({ x: e.clientX, y: e.clientY });
setShowIconContextMenu(true);
};

const handleIconDragStart = (e: React.DragEvent, iconId: string) => {
setDraggedIcon(iconId);
e.dataTransfer.effectAllowed = 'move';
};

const handleIconDragEnd = (e: React.DragEvent) => {
if (draggedIcon) {
const rect = e.currentTarget.getBoundingClientRect();
const x = e.clientX - rect.left;
const y = e.clientY - rect.top;

setDesktopIcons(prev => prev.map(icon =>
icon.id === draggedIcon
? { ...icon, position: { x: Math.max(0, x - 25), y: Math.max(0, y - 25) } }
: icon
));
}
setDraggedIcon(null);
};

const arrangeIconsInGrid = () => {
const iconsPerColumn = 6;
const iconSpacing = { x: 100, y: 100 };
const startPosition = { x: 20, y: 20 };

setDesktopIcons(prev => prev.map((icon, index) => {
const column = Math.floor(index / iconsPerColumn);
const row = index % iconsPerColumn;

return {
...icon,
position: {
x: startPosition.x + (column * iconSpacing.x),
y: startPosition.y + (row * iconSpacing.y)
}
};
}));
};

const handleDesktopRightClick = (e: React.MouseEvent) => {
const target = e.target as HTMLElement;
if (target.closest('.desktop-icon') || target.closest('.window-wrapper') || target.closest('.taskbar')) {
return;
}

e.preventDefault();
setContextMenuPosition({ x: e.clientX, y: e.clientY });
setShowDesktopContextMenu(true);
};

const handleDesktopClick = () => {
setShowDesktopContextMenu(false);
setShowIconContextMenu(false);
setSelectedIcon(null);
};

if (isLocked) {
return <LockScreen />;
}

return (
<div
className="os-container h-screen w-screen relative overflow-hidden bg-cover bg-center"
style={{ backgroundImage: `url(${wallpaper})` }}
onContextMenu={handleDesktopRightClick}
onClick={handleDesktopClick}
>
<div className="absolute inset-0 bg-black/20"></div>

{iconsInitialized && desktopIcons.map((icon) => (
<div
key={icon.id}
className="desktop-icon absolute flex flex-col items-center p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group"
style={{ left: icon.position.x, top: icon.position.y, width: '80px', height: '80px' }}
draggable
onDoubleClick={() => handleIconDoubleClick(icon)}
onContextMenu={(e) => handleIconRightClick(e, icon)}
onDragStart={(e) => handleIconDragStart(e, icon.id)}
onDragEnd={handleIconDragEnd}
>
<div className="w-12 h-12 flex items-center justify-center bg-blue-500/20 rounded-lg mb-1 group-hover:bg-blue-500/30 transition-colors">
<span className="text-2xl">{icon.icon}</span>
</div>
<span className="text-white text-xs text-center leading-tight">{icon.name}</span>
</div>
))}

<WindowManager />
<StartMenu />
<NotificationCenter />
<ContextMenu />
<Taskbar />
<ImmersiveModeModal />
<DesktopContextMenu
isVisible={showDesktopContextMenu}
position={contextMenuPosition}
onClose={() => setShowDesktopContextMenu(false)}
/>

{showIconContextMenu && selectedIcon && (
<>
<div className="fixed inset-0 z-40" onClick={() => setShowIconContextMenu(false)} />
<div
className="fixed bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl py-2 min-w-48 z-[9999]"
style={{ left: iconContextMenuPosition.x, top: iconContextMenuPosition.y }}
>
<button
onClick={() => {
const icon = desktopIcons.find(i => i.id === selectedIcon);
if (icon) handleIconDoubleClick(icon);
setShowIconContextMenu(false);
}}
className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
<span className="text-white text-sm">Open</span>
</button>
<button
onClick={() => {
arrangeIconsInGrid();
setShowIconContextMenu(false);
}}
className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
<span className="text-white text-sm">Arrange Icons</span>
</button>
</div>
</>
)}
</div>
);
};

export default Desktop;
