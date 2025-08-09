import React, { useState } from 'react';
import { useFileSystem } from '../settings/FileSystemContext';
import { useDialog } from '../settings/DialogContext';
import { FileText, Folder, RefreshCw, Eye, SortAsc, Plus, Grid, List, AlignLeft, Type, Calendar, HardDrive } from 'lucide-react';

interface DesktopContextMenuProps {
isVisible: boolean;
position: { x: number; y: number };
onClose: () => void;
}

const DesktopContextMenu: React.FC<DesktopContextMenuProps> = ({ isVisible, position, onClose }) => {
const { createFile, createFolder } = useFileSystem();
const { showInput } = useDialog();
const [showSubMenu, setShowSubMenu] = useState<string | null>(null);
const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
const [viewSettings, setViewSettings] = useState({
iconSize: 'large',
autoArrange: false,
alignToGrid: true,
sortBy: 'name'
});

const handleNewFile = async () => {
const fileName = await showInput('New File', 'Enter file name:', 'New Document.txt');
if (fileName) {
createFile(fileName, '', 'desktop');
}
onClose();
};

const handleNewFolder = async () => {
const folderName = await showInput('New Folder', 'Enter folder name:', 'New Folder');
if (folderName) {
createFolder(folderName, 'desktop');
}
onClose();
};

const handleRefresh = () => {
const icons = document.querySelectorAll('[data-desktop-icon]');
icons.forEach(icon => {
(icon as HTMLElement).style.opacity = '0';
});

setTimeout(() => {
icons.forEach(icon => {
(icon as HTMLElement).style.opacity = '1';
});
}, 300);

onClose();
};

const handleViewChange = (setting: string, value: any) => {
setViewSettings(prev => ({ ...prev, [setting]: value }));

const event = new CustomEvent('desktopViewChange', { 
detail: { setting, value, viewSettings: { ...viewSettings, [setting]: value } } 
});
window.dispatchEvent(event);

onClose();
};

const handleSort = (sortBy: string) => {
setViewSettings(prev => ({ ...prev, sortBy }));

const event = new CustomEvent('desktopSort', { detail: { sortBy } });
window.dispatchEvent(event);

onClose();
};

const handleMouseEnter = (submenu: string) => {
if (hoverTimeout) {
clearTimeout(hoverTimeout);
}
const timeout = setTimeout(() => {
setShowSubMenu(submenu);
}, 200);
setHoverTimeout(timeout);
};

const handleMouseLeave = () => {
if (hoverTimeout) {
clearTimeout(hoverTimeout);
}
const timeout = setTimeout(() => {
setShowSubMenu(null);
}, 300);
setHoverTimeout(timeout);
};

if (!isVisible) return null;

const renderViewSubmenu = () => (
<div className="absolute left-full top-0 ml-1 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl py-2 min-w-40 z-[10000]">
<div className="px-3 py-1 text-xs text-white/60 uppercase tracking-wider">Icon Size</div>
<button
onClick={() => handleViewChange('iconSize', 'large')}
className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
<span className="text-white text-sm">Large icons</span>
{viewSettings.iconSize === 'large' && <span className="text-white/60 text-xs">✓</span>}
</button>
<button
onClick={() => handleViewChange('iconSize', 'medium')}
className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
<span className="text-white text-sm">Medium icons</span>
{viewSettings.iconSize === 'medium' && <span className="text-white/60 text-xs">✓</span>}
</button>
<button
onClick={() => handleViewChange('iconSize', 'small')}
className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
<span className="text-white text-sm">Small icons</span>
{viewSettings.iconSize === 'small' && <span className="text-white/60 text-xs">✓</span>}
</button>

<hr className="my-1 border-white/10" />

<button
onClick={() => handleViewChange('autoArrange', !viewSettings.autoArrange)}
className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
<span className="text-white text-sm">Auto arrange</span>
{viewSettings.autoArrange && <span className="text-white/60 text-xs">✓</span>}
</button>
<button
onClick={() => handleViewChange('alignToGrid', !viewSettings.alignToGrid)}
className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
<span className="text-white text-sm">Align to grid</span>
{viewSettings.alignToGrid && <span className="text-white/60 text-xs">✓</span>}
</button>
</div>
);

const renderSortSubmenu = () => (
<div className="absolute left-full top-0 ml-1 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl py-2 min-w-40 z-[10000]">
<button
onClick={() => handleSort('name')}
className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
<div className="flex items-center space-x-2">
<Type className="w-4 h-4 text-white/80" />
<span className="text-white text-sm">Name</span>
</div>
{viewSettings.sortBy === 'name' && <span className="text-white/60 text-xs">✓</span>}
</button>
<button
onClick={() => handleSort('date')}
className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
<div className="flex items-center space-x-2">
<Calendar className="w-4 h-4 text-white/80" />
<span className="text-white text-sm">Date modified</span>
</div>
{viewSettings.sortBy === 'date' && <span className="text-white/60 text-xs">✓</span>}
</button>
<button
onClick={() => handleSort('type')}
className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
<div className="flex items-center space-x-2">
<FileText className="w-4 h-4 text-white/80" />
<span className="text-white text-sm">Type</span>
</div>
{viewSettings.sortBy === 'type' && <span className="text-white/60 text-xs">✓</span>}
</button>
<button
onClick={() => handleSort('size')}
className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
<div className="flex items-center space-x-2">
<HardDrive className="w-4 h-4 text-white/80" />
<span className="text-white text-sm">Size</span>
</div>
{viewSettings.sortBy === 'size' && <span className="text-white/60 text-xs">✓</span>}
</button>
</div>
);

const renderNewSubmenu = () => (
<div className="absolute left-full top-0 ml-1 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl py-2 min-w-40 z-[10000]">
<button
onClick={handleNewFolder}
className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
<Folder className="w-4 h-4 text-white/80" />
<span className="text-white text-sm">Folder</span>
</button>
<button
onClick={handleNewFile}
className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
<FileText className="w-4 h-4 text-white/80" />
<span className="text-white text-sm">Text Document</span>
</button>
</div>
);

return (
<>
<div
className="fixed bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl py-2 min-w-48 z-[9999]"
style={{
left: position.x,
top: position.y,
}}
onMouseLeave={handleMouseLeave}
>
<div className="relative">
<button
onMouseEnter={() => handleMouseEnter('view')}
className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
<div className="flex items-center space-x-3">
<Eye className="w-4 h-4 text-white/80" />
<span className="text-white text-sm">View</span>
</div>
<span className="text-white/60 text-xs">▶</span>
</button>
{showSubMenu === 'view' && renderViewSubmenu()}
</div>

<div className="relative">
<button
onMouseEnter={() => handleMouseEnter('sort')}
className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
<div className="flex items-center space-x-3">
<SortAsc className="w-4 h-4 text-white/80" />
<span className="text-white text-sm">Sort by</span>
</div>
<span className="text-white/60 text-xs">▶</span>
</button>
{showSubMenu === 'sort' && renderSortSubmenu()}
</div>

<hr className="my-1 border-white/10" />

<button
onClick={handleRefresh}
className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
<RefreshCw className="w-4 h-4 text-white/80" />
<span className="text-white text-sm">Refresh</span>
</button>

<hr className="my-1 border-white/10" />

<div className="relative">
<button
onMouseEnter={() => handleMouseEnter('new')}
className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
<div className="flex items-center space-x-3">
<Plus className="w-4 h-4 text-white/80" />
<span className="text-white text-sm">New</span>
</div>
<span className="text-white/60 text-xs">▶</span>
</button>
{showSubMenu === 'new' && renderNewSubmenu()}
</div>
</div>
</>
);
};

export default DesktopContextMenu;