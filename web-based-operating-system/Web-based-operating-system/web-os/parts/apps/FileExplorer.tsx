import React, { useState, useEffect } from 'react';
import { useFileSystem } from '../../settings/FileSystemContext';
import { useWindows } from '../../settings/WindowContext';
import { useDialog } from '../../settings/DialogContext';
import { useScrollPersistence } from '../../helpers/useScrollPersistence';
import { ArrowLeft, ArrowUp, Home, Search, List, Grid, FolderPlus, FilePlus, Trash2, Edit, Copy, Scissors, Cast as Paste, RefreshCw, Eye, Info } from 'lucide-react';
import FilePropertiesDialog from '../FilePropertiesDialog';

interface FileExplorerProps {
initialPath?: string;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ initialPath = null }) => {
const [currentPath, setCurrentPath] = useState(initialPath);
const [viewMode, setViewMode] = useState<'list' | 'grid' | 'large' | 'medium' | 'small'>('list');
const [searchQuery, setSearchQuery] = useState('');
const [selectedItems, setSelectedItems] = useState<string[]>([]);
const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('name');
const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
const [showContextMenu, setShowContextMenu] = useState(false);
const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
const [contextMenuType, setContextMenuType] = useState<'item' | 'empty'>('empty');
const [contextMenuItem, setContextMenuItem] = useState<any>(null);

const [showPropertiesDialog, setShowPropertiesDialog] = useState(false);
const [propertiesFileId, setPropertiesFileId] = useState<string>('');

const scrollRef = useScrollPersistence('file-explorer');

const { 
getItemsByParent, 
getItem, 
createFolder, 
createFile, 
deleteItem, 
renameItem,
getPathString,
clipboard,
copyItems,
cutItems,
pasteItems
} = useFileSystem();
const { openWindow } = useWindows();
const { showInput, showConfirm } = useDialog();

useEffect(() => {
const handleSortFiles = (event: CustomEvent) => {
setSortBy(event.detail.sortBy);
};

const handleChangeView = (event: CustomEvent) => {
setViewMode(event.detail.viewMode);
};

window.addEventListener('sortFiles', handleSortFiles as EventListener);
window.addEventListener('changeView', handleChangeView as EventListener);

return () => {
window.removeEventListener('sortFiles', handleSortFiles as EventListener);
window.removeEventListener('changeView', handleChangeView as EventListener);
};
}, []);

const currentItems = getItemsByParent(currentPath);
let filteredItems = currentItems.filter(item =>
item.name.toLowerCase().includes(searchQuery.toLowerCase())
);

filteredItems = filteredItems.sort((a, b) => {
let comparison = 0;

switch (sortBy) {
case 'name':
comparison = a.name.localeCompare(b.name);
break;
case 'date':
comparison = a.modifiedAt.getTime() - b.modifiedAt.getTime();
break;
case 'size':
comparison = (a.size || 0) - (b.size || 0);
break;
case 'type':
comparison = a.type.localeCompare(b.type);
break;
}

return sortOrder === 'asc' ? comparison : -comparison;
});

const handleItemDoubleClick = (item: any) => {
if (item.type === 'folder') {
setCurrentPath(item.id);
} else if (!handleSystemFileOpen(item)) {
return;
} else if (item.content?.startsWith('data:image/') || item.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/)) {
openWindow({
title: 'Image Viewer',
appId: 'image-viewer',
props: { initialImageId: item.id },
position: { x: 100, y: 100 },
size: { width: 900, height: 700 },
icon: '🖼️'
});
} else if (item.content?.startsWith('data:audio/') || item.name.toLowerCase().match(/\.(mp3|wav|ogg|m4a|aac|flac)$/)) {
openWindow({
title: 'Audio Player',
appId: 'audio-player',
props: { initialAudioId: item.id },
position: { x: 100, y: 100 },
size: { width: 800, height: 600 },
icon: '🎵'
});
} else {
openWindow({
title: `${item.name} - Text Editor`,
appId: 'text-editor',
props: { fileId: item.id },
position: { x: 100, y: 100 },
size: { width: 800, height: 600 },
icon: '📝'
});
}
};

const handleItemClick = (item: any) => {
setSelectedItems([item.id]);
};

const handleContextMenu = (e: React.MouseEvent, item?: any) => {
e.preventDefault();
e.stopPropagation();
setContextMenuPosition({ x: e.clientX, y: e.clientY });
setShowContextMenu(true);
if (item) {
setSelectedItems([item.id]);
setContextMenuType('item');
setContextMenuItem(item);
} else {
setContextMenuType('empty');
setContextMenuItem(null);
}
};

const navigateUp = () => {
if (currentPath) {
const currentItem = getItem(currentPath);
setCurrentPath(currentItem?.parentId || null);
}
};

const navigateToRoot = () => {
setCurrentPath(null);
};

const handleNewFolder = async () => {
const name = await showInput('New Folder', 'Enter folder name:', 'New Folder');
if (name) {
createFolder(name, currentPath);
}
setShowContextMenu(false);
};

const handleNewFile = async () => {
const name = await showInput('New File', 'Enter file name:', 'New File.txt');
if (name) {
createFile(name, '', currentPath);
}
setShowContextMenu(false);
};

const handleDelete = async () => {
if (selectedItems.length > 0) {
selectedItems.forEach(id => deleteItem(id));
setSelectedItems([]);
}
setShowContextMenu(false);
};

const handleRename = async () => {
if (selectedItems.length === 1) {
const item = getItem(selectedItems[0]);
if (!item) return;

const newName = await showInput('Rename Item', `Enter new name for "${item.name}":`, item.name);
if (newName) {
renameItem(selectedItems[0], newName);
}
}
setShowContextMenu(false);
};

const handleCopy = () => {
copyItems(selectedItems);
setShowContextMenu(false);
};

const handleCut = () => {
cutItems(selectedItems);
setShowContextMenu(false);
};

const handlePaste = () => {
pasteItems(currentPath);
setShowContextMenu(false);
};

const handleRefresh = () => {
setSearchQuery(prev => prev);
setShowContextMenu(false);
};

const handleOpenWith = () => {
if (contextMenuItem) {
openWindow({
title: `${contextMenuItem.name} - Text Editor`,
appId: 'text-editor',
props: { fileId: contextMenuItem.id },
position: { x: 100, y: 100 },
size: { width: 800, height: 600 },
icon: '📝'
});
}
setShowContextMenu(false);
};

const handleProperties = () => {
if (contextMenuItem) {
setPropertiesFileId(contextMenuItem.id);
setShowPropertiesDialog(true);
}
setShowContextMenu(false);
};

const handleSystemFileOpen = (item: any) => {
const systemExtensions = ['.exe', '.dll', '.sys', '.drv'];
const isSystemFile = systemExtensions.some(ext => item.name.toLowerCase().endsWith(ext));
const isInSystemFolder = ['windows', 'system32', 'program-files', 'program-files-x86'].some(folder => 
getPathString(item.parentId).toLowerCase().includes(folder)
);

if (isSystemFile && isInSystemFolder) {
const { showAlert } = useDialog();
showAlert(
'Cannot Open File',
`Cannot open "${item.name}". This is a system file and cannot be opened directly for security reasons.`,
'error'
);
return false;
}
return true;
};

const formatFileSize = (bytes: number) => {
if (bytes === 0) return '0 B';
const k = 1024;
const sizes = ['B', 'KB', 'MB', 'GB'];
const i = Math.floor(Math.log(bytes) / Math.log(k));
return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (date: Date) => {
return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

return (
<div className="h-full bg-white dark:bg-gray-900 flex flex-col">
<div className="border-b border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between">
<div className="flex items-center space-x-2">
<button
onClick={navigateUp}
disabled={!currentPath}
className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
>
<ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
</button>
<button
onClick={navigateToRoot}
className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
>
<Home className="w-4 h-4 text-gray-600 dark:text-gray-300" />
</button>
<button
onClick={navigateUp}
disabled={!currentPath}
className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
>
<ArrowUp className="w-4 h-4 text-gray-600 dark:text-gray-300" />
</button>
</div>

<div className="flex-1 mx-4">
<div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
{getPathString(currentPath)}
</div>
</div>

<div className="flex items-center space-x-2">
<div className="relative">
<Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
<input
type="text"
placeholder="Search files..."
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
</div>

<div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
<button
onClick={() => setViewMode('list')}
className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
title="List view"
>
<List className="w-4 h-4" />
</button>
<button
onClick={() => setViewMode('large')}
className={`p-2 ${viewMode === 'large' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
title="Large icons"
>
<Grid className="w-4 h-4" />
</button>
</div>

<button
onClick={handleNewFolder}
className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
title="New Folder"
>
<FolderPlus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
</button>
<button
onClick={handleNewFile}
className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
title="New File"
>
<FilePlus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
</button>
</div>
</div>

<div 
ref={scrollRef}
className="flex-1 p-4 overflow-auto"
onContextMenu={(e) => handleContextMenu(e)}
>
{viewMode === 'list' ? (
<div className="space-y-1">
<div className="flex items-center space-x-3 p-2 text-sm font-medium text-gray-600 dark:text-gray-400 border-b">
<div className="w-8"></div>
<button 
onClick={() => {
if (sortBy === 'name') {
setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
} else {
setSortBy('name');
setSortOrder('asc');
}
}}
className="flex-1 text-left hover:text-gray-900 dark:hover:text-white"
>
Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
</button>
<button 
onClick={() => {
if (sortBy === 'date') {
setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
} else {
setSortBy('date');
setSortOrder('desc');
}
}}
className="w-32 text-left hover:text-gray-900 dark:hover:text-white"
>
Date modified {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
</button>
<button 
onClick={() => {
if (sortBy === 'size') {
setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
} else {
setSortBy('size');
setSortOrder('desc');
}
}}
className="w-20 text-right hover:text-gray-900 dark:hover:text-white"
>
Size {sortBy === 'size' && (sortOrder === 'asc' ? '↑' : '↓')}
</button>
</div>
{filteredItems.map((item) => (
<div
key={item.id}
onClick={() => handleItemClick(item)}
onDoubleClick={() => handleItemDoubleClick(item)}
onContextMenu={(e) => handleContextMenu(e, item)}
className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
selectedItems.includes(item.id) ? 'bg-blue-100 dark:bg-blue-900' : ''
}`}
data-file-item
data-item-id={item.id}
data-item-type={item.type}
>
<span className="text-2xl">{item.icon}</span>
<div className="flex-1">
<div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
<div className="text-sm text-gray-500 dark:text-gray-400">
{formatDate(item.modifiedAt)}
</div>
</div>
<div className="text-sm text-gray-500 dark:text-gray-400">
{item.type === 'file' ? formatFileSize(item.size || 0) : 'Folder'}
</div>
</div>
))}
</div>
) : viewMode === 'large' ? (
<div className="grid grid-cols-6 gap-4">
{filteredItems.map((item) => (
<div
key={item.id}
onClick={() => handleItemClick(item)}
onDoubleClick={() => handleItemDoubleClick(item)}
onContextMenu={(e) => handleContextMenu(e, item)}
className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-center ${
selectedItems.includes(item.id) ? 'bg-blue-100 dark:bg-blue-900' : ''
}`}
data-file-item
data-item-id={item.id}
data-item-type={item.type}
>
<div className="text-4xl mb-2">{item.icon}</div>
<div className="font-medium text-gray-900 dark:text-white text-sm truncate">
{item.name}
</div>
</div>
))}
</div>
) : viewMode === 'medium' ? (
<div className="grid grid-cols-8 gap-3">
{filteredItems.map((item) => (
<div
key={item.id}
onClick={() => handleItemClick(item)}
onDoubleClick={() => handleItemDoubleClick(item)}
onContextMenu={(e) => handleContextMenu(e, item)}
className={`p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-center ${
selectedItems.includes(item.id) ? 'bg-blue-100 dark:bg-blue-900' : ''
}`}
data-file-item
data-item-id={item.id}
data-item-type={item.type}
>
<div className="text-2xl mb-1">{item.icon}</div>
<div className="font-medium text-gray-900 dark:text-white text-xs truncate">
{item.name}
</div>
</div>
))}
</div>
) : (
<div className="grid grid-cols-12 gap-2">
{filteredItems.map((item) => (
<div
key={item.id}
onClick={() => handleItemClick(item)}
onDoubleClick={() => handleItemDoubleClick(item)}
onContextMenu={(e) => handleContextMenu(e, item)}
className={`p-1 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-center ${
selectedItems.includes(item.id) ? 'bg-blue-100 dark:bg-blue-900' : ''
}`}
data-file-item
data-item-id={item.id}
data-item-type={item.type}
>
<div className="text-lg mb-1">{item.icon}</div>
<div className="font-medium text-gray-900 dark:text-white text-xs truncate">
{item.name}
</div>
</div>
))}
</div>
)}

{filteredItems.length === 0 && (
<div className="text-center py-8 text-gray-500 dark:text-gray-400">
{searchQuery ? 'No files found matching your search.' : 'This folder is empty.'}
</div>
)}
</div>

{showContextMenu && (
<div
className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-[9999]"
style={{ left: contextMenuPosition.x, top: contextMenuPosition.y }}
>
{contextMenuType === 'item' ? (
<>
<button
onClick={() => handleItemDoubleClick(contextMenuItem)}
className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
>
<span>Open</span>
</button>
{contextMenuItem?.type === 'file' && (
<button
onClick={handleOpenWith}
className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
>
<span>Open with...</span>
</button>
)}
<hr className="my-1 border-gray-200 dark:border-gray-700" />
<button
onClick={handleCopy}
className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
>
<Copy className="w-4 h-4" />
<span>Copy</span>
</button>
<button
onClick={handleCut}
className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
>
<Scissors className="w-4 h-4" />
<span>Cut</span>
</button>
<hr className="my-1 border-gray-200 dark:border-gray-700" />
<button
onClick={handleRename}
className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
>
<Edit className="w-4 h-4" />
<span>Rename</span>
</button>
<button
onClick={handleDelete}
className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
>
<Trash2 className="w-4 h-4" />
<span>Delete</span>
</button>
<hr className="my-1 border-gray-200 dark:border-gray-700" />
<button
onClick={handleProperties}
className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
>
<Info className="w-4 h-4" />
<span>Properties</span>
</button>
</>
) : (
<>
<button
onClick={handleNewFolder}
className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
>
<FolderPlus className="w-4 h-4" />
<span>New Folder</span>
</button>
<button
onClick={handleNewFile}
className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
>
<FilePlus className="w-4 h-4" />
<span>New File</span>
</button>
<hr className="my-1 border-gray-200 dark:border-gray-700" />
{clipboard.items.length > 0 && (
<button
onClick={handlePaste}
className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
>
<Paste className="w-4 h-4" />
<span>Paste</span>
</button>
)}
<button
onClick={handleRefresh}
className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
>
<RefreshCw className="w-4 h-4" />
<span>Refresh</span>
</button>
<hr className="my-1 border-gray-200 dark:border-gray-700" />
<button
onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
>
<Eye className="w-4 h-4" />
<span>View Options</span>
</button>
</>
)}
</div>
)}

{showContextMenu && (
<div
className="fixed inset-0 z-[9998]"
onClick={() => setShowContextMenu(false)}
/>
)}

<FilePropertiesDialog
isOpen={showPropertiesDialog}
onClose={() => setShowPropertiesDialog(false)}
fileId={propertiesFileId}
/>
</div>
);
};

export default FileExplorer;