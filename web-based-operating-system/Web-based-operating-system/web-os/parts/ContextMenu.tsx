import React, { useState, useEffect } from 'react';
import { useWindows } from '../settings/WindowContext';
import { useFileSystem } from '../settings/FileSystemContext';
import { useDialog } from '../settings/DialogContext';
import { FileText, Folder, Copy, Cast as Paste, Trash2, Edit, Info, RefreshCw, Settings, Eye, SortAsc, Plus, Monitor, ArrowUpDown, Calendar, HardDrive, Type } from 'lucide-react';
import FilePropertiesDialog from './FilePropertiesDialog';

type ContextMenuItem = {
icon: React.ElementType;
label: string;
action: () => void;
hasSubmenu?: boolean;
};

const ContextMenu: React.FC = () => {
const [isVisible, setIsVisible] = useState(false);
const [position, setPosition] = useState({ x: 0, y: 0 });
const [contextType, setContextType] = useState<'desktop' | 'file' | 'folder'>('desktop');
const [targetItem, setTargetItem] = useState<any>(null);
const [showSubMenu, setShowSubMenu] = useState<string | null>(null);
const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('name');
const [viewMode, setViewMode] = useState<'large' | 'medium' | 'small' | 'list'>('large');
const { openWindow } = useWindows();
const { createFile, createFolder, deleteItem, items, setCurrentPath } = useFileSystem();
const { showInput } = useDialog();
const [showPropertiesDialog, setShowPropertiesDialog] = useState(false);

useEffect(() => {
const handleContextMenu = (e: MouseEvent) => {
e.preventDefault();
const target = e.target as HTMLElement;

setPosition({ x: e.clientX, y: e.clientY });
setIsVisible(true);

if (target.closest('[data-file-item]')) {
const fileItem = target.closest('[data-file-item]');
setContextType(fileItem?.getAttribute('data-item-type') === 'folder' ? 'folder' : 'file');
setTargetItem(fileItem?.getAttribute('data-item-id'));
} else {
setContextType('desktop');
setTargetItem(null);
}
};

const handleClick = () => {
setIsVisible(false);
setShowSubMenu(null);
};

document.addEventListener('contextmenu', handleContextMenu);
document.addEventListener('click', handleClick);

return () => {
document.removeEventListener('contextmenu', handleContextMenu);
document.removeEventListener('click', handleClick);
};
}, []);

const handleNewFile = async () => {
const fileName = await showInput('New File', 'Enter file name:', 'New File.txt');
if (fileName) {
createFile(fileName, '', 'desktop');
}
setIsVisible(false);
};

const handleNewFolder = async () => {
const folderName = await showInput('New Folder', 'Enter folder name:', 'New Folder');
if (folderName) {
createFolder(folderName, 'desktop');
}
setIsVisible(false);
};

const handleOpenFile = () => {
if (targetItem) {
openWindow({
title: 'Text Editor',
appId: 'text-editor',
props: { fileId: targetItem },
position: 'center',
size: { width: 800, height: 600 },
icon: '📝'
});
}
setIsVisible(false);
};

const handleOpenFolder = () => {
if (targetItem) {
openWindow({
title: 'File Explorer',
appId: 'file-explorer',
props: { initialPath: targetItem },
position: { x: 100, y: 100 },
size: { width: 900, height: 600 },
icon: '📁'
});
}
setIsVisible(false);
};

const handleDelete = async () => {
if (targetItem) {
deleteItem(targetItem);
}
setIsVisible(false);
};

const handleProperties = () => {
setShowPropertiesDialog(true);
setIsVisible(false);
};

const refreshDesktop = () => {
const icons = document.querySelectorAll('[data-desktop-icon]');
icons.forEach(icon => {
(icon as HTMLElement).style.opacity = '0';
});

setTimeout(() => {
icons.forEach(icon => {
(icon as HTMLElement).style.opacity = '1';
});
}, 300);

setIsVisible(false);
};

const handleSettings = () => {
openWindow({
title: 'Settings',
appId: 'settings',
position: { x: 100, y: 100 },
size: { width: 800, height: 600 },
icon: '⚙️'
});
setIsVisible(false);
};

const handleSort = (type: 'name' | 'date' | 'size' | 'type') => {
setSortBy(type);
const event = new CustomEvent('sortFiles', { detail: { sortBy: type } });
window.dispatchEvent(event);
setIsVisible(false);
};

const handleView = (type: 'large' | 'medium' | 'small' | 'list') => {
setViewMode(type);
const event = new CustomEvent('changeView', { detail: { viewMode: type } });
window.dispatchEvent(event);
setIsVisible(false);
};

const contextMenuItems: ContextMenuItem[] = contextType === 'desktop'
? [
{ 
icon: Eye, 
label: 'View', 
action: () => setShowSubMenu(showSubMenu === 'view' ? null : 'view'),
hasSubmenu: true
},
{ 
icon: SortAsc, 
label: 'Sort by', 
action: () => setShowSubMenu(showSubMenu === 'sort' ? null : 'sort'),
hasSubmenu: true
},
{ icon: RefreshCw, label: 'Refresh', action: refreshDesktop },
{ 
icon: Plus, 
label: 'New', 
action: () => setShowSubMenu(showSubMenu === 'new' ? null : 'new'),
hasSubmenu: true
},
{ icon: Paste, label: 'Paste', action: () => setIsVisible(false) },
{ icon: Monitor, label: 'Display Settings', action: handleSettings },
]
: contextType === 'file'
? [
{ icon: Edit, label: 'Open', action: handleOpenFile },
{ icon: Copy, label: 'Copy', action: () => setIsVisible(false) },
{ icon: Trash2, label: 'Delete', action: handleDelete },
{ icon: Info, label: 'Properties', action: handleProperties },
]
: [
{ icon: Edit, label: 'Open', action: handleOpenFolder },
{ icon: Copy, label: 'Copy', action: () => setIsVisible(false) },
{ icon: Trash2, label: 'Delete', action: handleDelete },
{ icon: Info, label: 'Properties', action: handleProperties },
];

const renderSubmenu = () => {
if (!showSubMenu) return null;

let submenuItems: { label: string; action: () => void; icon?: React.ElementType }[] = [];

switch (showSubMenu) {
case 'view':
submenuItems = [
{ label: 'Large icons', action: () => handleView('large') },
{ label: 'Medium icons', action: () => handleView('medium') },
{ label: 'Small icons', action: () => handleView('small') },
{ label: 'List', action: () => handleView('list') },
];
break;
case 'sort':
submenuItems = [
{ 
label: `Name ${sortBy === 'name' ? '✓' : ''}`, 
action: () => handleSort('name'),
icon: Type
},
{ 
label: `Date modified ${sortBy === 'date' ? '✓' : ''}`, 
action: () => handleSort('date'),
icon: Calendar
},
{ 
label: `Size ${sortBy === 'size' ? '✓' : ''}`, 
action: () => handleSort('size'),
icon: HardDrive
},
{ 
label: `Type ${sortBy === 'type' ? '✓' : ''}`, 
action: () => handleSort('type'),
icon: Type
},
];
break;
case 'view':
submenuItems = [
{ 
label: `Large icons ${viewMode === 'large' ? '✓' : ''}`, 
action: () => handleView('large'),
icon: Monitor
},
{ 
label: `Medium icons ${viewMode === 'medium' ? '✓' : ''}`, 
action: () => handleView('medium'),
icon: Monitor
},
{ 
label: `Small icons ${viewMode === 'small' ? '✓' : ''}`, 
action: () => handleView('small'),
icon: Monitor
},
{ 
label: `List ${viewMode === 'list' ? '✓' : ''}`, 
action: () => handleView('list'),
icon: ArrowUpDown
},
];
break;
case 'new':
submenuItems = [
{ label: 'File', action: handleNewFile, icon: FileText },
{ label: 'Folder', action: handleNewFolder, icon: Folder },
];
break;
}

return (
<div
className="absolute left-full top-0 ml-1 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl py-2 min-w-40 z-60"
>
{submenuItems.map((item, index) => (
<button
key={index}
onClick={item.action}
className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
{item.icon && <item.icon className="w-4 h-4 text-white/80" />}
<span className="text-white text-sm">{item.label}</span>
</button>
))}
</div>
);
};

if (!isVisible) return null;

return (
<>
<div
className="fixed bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl py-2 min-w-48 z-[9999]"
style={{
left: position.x,
top: position.y,
}}
>
{contextMenuItems.map((item, index) => (
<div key={index} className="relative">
<button
onClick={item.action}
className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
<div className="flex items-center space-x-3">
<item.icon className="w-4 h-4 text-white/80" />
<span className="text-white text-sm">{item.label}</span>
</div>
{item.hasSubmenu && (
<span className="text-white/60 text-xs">▶</span>
)}
</button>
{showSubMenu === item.label.toLowerCase().replace(' ', '') && renderSubmenu()}
</div>
))}
</div>

<FilePropertiesDialog
isOpen={showPropertiesDialog}
onClose={() => setShowPropertiesDialog(false)}
fileId={targetItem || ''}
/>
</>
);
};

export default ContextMenu;