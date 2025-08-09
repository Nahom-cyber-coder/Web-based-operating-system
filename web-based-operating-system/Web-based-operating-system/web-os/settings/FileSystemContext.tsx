import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDialog } from './DialogContext';

interface FileSystemItem {
id: string;
name: string;
type: 'file' | 'folder';
parentId: string | null;
content?: string;
size?: number;
createdAt: Date;
modifiedAt: Date;
icon?: string;
isDeleted?: boolean;
deletedAt?: Date;
mimeType?: string;
}

interface FileSystemContextType {
items: FileSystemItem[];
currentPath: string;
setCurrentPath: (path: string) => void;
createFolder: (name: string, parentId: string | null) => void;
createFile: (name: string, content: string, parentId: string | null) => void;
deleteItem: (id: string) => void;
permanentlyDeleteItem: (id: string) => void;
restoreItem: (id: string) => void;
emptyRecycleBin: () => void;
getRecycleBinItems: () => FileSystemItem[];
renameItem: (id: string, newName: string) => void;
moveItem: (id: string, newParentId: string | null) => void;
getItem: (id: string) => FileSystemItem | undefined;
getItemsByParent: (parentId: string | null) => FileSystemItem[];
updateFileContent: (id: string, content: string) => void;
getPathString: (itemId: string | null) => string;
clipboard: { items: FileSystemItem[]; operation: 'copy' | 'cut' | null };
copyItems: (itemIds: string[]) => void;
cutItems: (itemIds: string[]) => void;
pasteItems: (targetParentId: string | null) => void;
createAppFolder: (appName: string, appId: string, isX86?: boolean) => void;
removeAppFolder: (appId: string) => void;
restoreApp: (app: any) => void;
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined);

export const useFileSystem = () => {
const context = useContext(FileSystemContext);
if (!context) {
throw new Error('useFileSystem must be used within a FileSystemProvider');
}
return context;
};

const defaultItems: FileSystemItem[] = [
{
id: 'c-drive',
name: 'Local Disk (C:)',
type: 'folder',
parentId: null,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '💾'
},
{
id: 'd-drive',
name: 'Local Disk (D:)',
type: 'folder',
parentId: null,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '💿'
},
{
id: 'windows',
name: 'Windows',
type: 'folder',
parentId: 'c-drive',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '🪟'
},
{
id: 'system32',
name: 'System32',
type: 'folder',
parentId: 'c-drive',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '⚙️'
},
{
id: 'program-files',
name: 'Program Files',
type: 'folder',
parentId: 'c-drive',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📁'
},
{
id: 'program-files-x86',
name: 'Program Files (x86)',
type: 'folder',
parentId: 'c-drive',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📁'
},
{
id: 'users',
name: 'Users',
type: 'folder',
parentId: 'c-drive',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '👥'
},
{
id: 'temp',
name: 'Temp',
type: 'folder',
parentId: 'c-drive',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📁'
},

{
id: 'explorer-exe',
name: 'explorer.exe',
type: 'file',
parentId: 'windows',
content: 'Windows Explorer executable',
size: 4194304,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'win-ini',
name: 'win.ini',
type: 'file',
parentId: 'windows',
content: '[windows]\nload=\nrun=\nNullPort=None',
size: 1024,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'system-ini',
name: 'system.ini',
type: 'file',
parentId: 'windows',
content: '[boot]\nshell=explorer.exe\n[drivers]\nwave=mmdrv.dll',
size: 2048,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'notepad-exe',
name: 'notepad.exe',
type: 'file',
parentId: 'windows',
content: 'Windows Notepad executable',
size: 2097152,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'regedit-exe',
name: 'regedit.exe',
type: 'file',
parentId: 'windows',
content: 'Registry Editor executable',
size: 1572864,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},

{
id: 'kernel32-dll',
name: 'kernel32.dll',
type: 'file',
parentId: 'system32',
content: 'Windows NT BASE API Client DLL',
size: 1048576,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'user32-dll',
name: 'user32.dll',
type: 'file',
parentId: 'system32',
content: 'Multi-User Windows USER API Client DLL',
size: 1572864,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'ntdll-dll',
name: 'ntdll.dll',
type: 'file',
parentId: 'system32',
content: 'NT Layer DLL',
size: 2097152,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'advapi32-dll',
name: 'advapi32.dll',
type: 'file',
parentId: 'system32',
content: 'Advanced Windows 32 Base API',
size: 1310720,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'shell32-dll',
name: 'shell32.dll',
type: 'file',
parentId: 'system32',
content: 'Windows Shell Common Dll',
size: 3145728,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'gdi32-dll',
name: 'gdi32.dll',
type: 'file',
parentId: 'system32',
content: 'GDI Client DLL',
size: 786432,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'wininet-dll',
name: 'wininet.dll',
type: 'file',
parentId: 'system32',
content: 'Internet Extensions for Win32',
size: 2621440,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'msvcrt-dll',
name: 'msvcrt.dll',
type: 'file',
parentId: 'system32',
content: 'Microsoft C Runtime Library',
size: 1048576,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'ole32-dll',
name: 'ole32.dll',
type: 'file',
parentId: 'system32',
content: 'Microsoft OLE for Windows',
size: 2097152,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'comctl32-dll',
name: 'comctl32.dll',
type: 'file',
parentId: 'system32',
content: 'Common Controls Library',
size: 1572864,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'ws2_32-dll',
name: 'ws2_32.dll',
type: 'file',
parentId: 'system32',
content: 'Windows Socket 2.0 32-Bit DLL',
size: 524288,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'rpcrt4-dll',
name: 'rpcrt4.dll',
type: 'file',
parentId: 'system32',
content: 'Remote Procedure Call Runtime',
size: 1310720,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'secur32-dll',
name: 'secur32.dll',
type: 'file',
parentId: 'system32',
content: 'Security Support Provider Interface',
size: 786432,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'crypt32-dll',
name: 'crypt32.dll',
type: 'file',
parentId: 'system32',
content: 'Crypto API32',
size: 1048576,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'version-dll',
name: 'version.dll',
type: 'file',
parentId: 'system32',
content: 'Version Checking and File Installation Libraries',
size: 262144,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'setupapi-dll',
name: 'setupapi.dll',
type: 'file',
parentId: 'system32',
content: 'Windows Setup API',
size: 1572864,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'winspool-drv',
name: 'winspool.drv',
type: 'file',
parentId: 'system32',
content: 'Windows Spooler Driver',
size: 524288,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'config-folder',
name: 'config',
type: 'folder',
parentId: 'system32',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📁'
},
{
id: 'system-ini-config',
name: 'system.ini',
type: 'file',
parentId: 'config-folder',
content: '[boot]\nshell=explorer.exe\n[drivers]\nwave=mmdrv.dll\ntimer=timer.drv',
size: 512,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'boot-ini',
name: 'boot.ini',
type: 'file',
parentId: 'config-folder',
content: '[boot loader]\ntimeout=30\ndefault=multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS',
size: 256,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'drivers-folder',
name: 'drivers',
type: 'folder',
parentId: 'system32',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📁'
},
{
id: 'audio-sys',
name: 'audio.sys',
type: 'file',
parentId: 'drivers-folder',
content: 'Audio device driver',
size: 524288,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'video-sys',
name: 'video.sys',
type: 'file',
parentId: 'drivers-folder',
content: 'Video display driver',
size: 1048576,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'network-sys',
name: 'network.sys',
type: 'file',
parentId: 'drivers-folder',
content: 'Network adapter driver',
size: 786432,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'usb-sys',
name: 'usb.sys',
type: 'file',
parentId: 'drivers-folder',
content: 'USB controller driver',
size: 524288,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'disk-sys',
name: 'disk.sys',
type: 'file',
parentId: 'drivers-folder',
content: 'Disk device driver',
size: 1048576,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},

{
id: 'system-folder',
name: 'System',
type: 'folder',
parentId: 'windows',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📁'
},
{
id: 'fonts-folder',
name: 'Fonts',
type: 'folder',
parentId: 'windows',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📁'
},
{
id: 'arial-ttf',
name: 'arial.ttf',
type: 'file',
parentId: 'fonts-folder',
content: 'Arial TrueType Font',
size: 1048576,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'times-ttf',
name: 'times.ttf',
type: 'file',
parentId: 'fonts-folder',
content: 'Times New Roman TrueType Font',
size: 1572864,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'calibri-ttf',
name: 'calibri.ttf',
type: 'file',
parentId: 'fonts-folder',
content: 'Calibri TrueType Font',
size: 786432,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'logs-folder',
name: 'Logs',
type: 'folder',
parentId: 'windows',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📁'
},
{
id: 'system-log',
name: 'system.log',
type: 'file',
parentId: 'logs-folder',
content: '[2024-01-15 10:30:15] System startup completed\n[2024-01-15 10:30:16] Services initialized\n[2024-01-15 10:30:17] Desktop loaded',
size: 2048,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'error-log',
name: 'error.log',
type: 'file',
parentId: 'logs-folder',
content: '[2024-01-15 10:30:20] Warning: Low disk space\n[2024-01-15 10:31:05] Info: Application started',
size: 1024,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'temp-folder',
name: 'Temp',
type: 'folder',
parentId: 'windows',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📁'
},
{
id: 'temp-file1',
name: 'tmp001.tmp',
type: 'file',
parentId: 'temp-folder',
content: 'Temporary file data',
size: 4096,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'temp-file2',
name: 'cache.dat',
type: 'file',
parentId: 'temp-folder',
content: 'Application cache data',
size: 8192,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},

{
id: 'snake-app',
name: 'Snake',
type: 'folder',
parentId: 'program-files',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📁'
},
{
id: 'snake-exe',
name: 'snake.exe',
type: 'file',
parentId: 'snake-app',
content: 'Snake Game Application',
size: 8388608,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'snake-dll',
name: 'snake.dll',
type: 'file',
parentId: 'snake-app',
content: 'Snake Game Library',
size: 2097152,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'snake-config',
name: 'config.dat',
type: 'file',
parentId: 'snake-app',
content: 'highscore=0\ndifficulty=normal\nsound=true',
size: 512,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'tetris-app',
name: 'Tetris',
type: 'folder',
parentId: 'program-files',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📁'
},
{
id: 'tetris-exe',
name: 'tetris.exe',
type: 'file',
parentId: 'tetris-app',
content: 'Tetris Game Application',
size: 12582912,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'tetris-dll',
name: 'tetris.dll',
type: 'file',
parentId: 'tetris-app',
content: 'Tetris Game Engine',
size: 4194304,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'tetris-config',
name: 'settings.ini',
type: 'file',
parentId: 'tetris-app',
content: '[Game]\nLevel=1\nLines=0\nScore=0\n[Audio]\nMusic=1\nSFX=1',
size: 256,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'camera-app',
name: 'Camera',
type: 'folder',
parentId: 'program-files',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📁'
},
{
id: 'camera-exe',
name: 'camera.exe',
type: 'file',
parentId: 'camera-app',
content: 'Camera Application',
size: 16777216,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'camera-dll',
name: 'camera.dll',
type: 'file',
parentId: 'camera-app',
content: 'Camera Device Interface',
size: 3145728,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'camera-codec',
name: 'codec.dll',
type: 'file',
parentId: 'camera-app',
content: 'Image Codec Library',
size: 1572864,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'browser-app',
name: 'Browser',
type: 'folder',
parentId: 'program-files',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📁'
},
{
id: 'browser-exe',
name: 'browser.exe',
type: 'file',
parentId: 'browser-app',
content: 'Web Browser Application',
size: 52428800,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'browser-engine',
name: 'engine.dll',
type: 'file',
parentId: 'browser-app',
content: 'Browser Rendering Engine',
size: 25165824,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},

{
id: 'checkers-app',
name: 'Checkers',
type: 'folder',
parentId: 'program-files-x86',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📁'
},
{
id: 'checkers-exe',
name: 'checkers.exe',
type: 'file',
parentId: 'checkers-app',
content: 'Checkers Game Application',
size: 4194304,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'checkers-dll',
name: 'checkers.dll',
type: 'file',
parentId: 'checkers-app',
content: 'Checkers Game Logic',
size: 1048576,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'checkers-ai',
name: 'ai.dat',
type: 'file',
parentId: 'checkers-app',
content: 'AI difficulty=medium\nthinking_time=800ms',
size: 128,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'calculator-app',
name: 'Calculator',
type: 'folder',
parentId: 'program-files-x86',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📁'
},
{
id: 'calculator-exe',
name: 'calculator.exe',
type: 'file',
parentId: 'calculator-app',
content: 'Calculator Application',
size: 2097152,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'calculator-dll',
name: 'math.dll',
type: 'file',
parentId: 'calculator-app',
content: 'Mathematical Operations Library',
size: 524288,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'paint-app',
name: 'Paint',
type: 'folder',
parentId: 'program-files-x86',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📁'
},
{
id: 'paint-exe',
name: 'paint.exe',
type: 'file',
parentId: 'paint-app',
content: 'Paint Application',
size: 6291456,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'paint-gfx',
name: 'graphics.dll',
type: 'file',
parentId: 'paint-app',
content: 'Graphics Rendering Library',
size: 2097152,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'texteditor-app',
name: 'TextEditor',
type: 'folder',
parentId: 'program-files-x86',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📁'
},
{
id: 'texteditor-exe',
name: 'texteditor.exe',
type: 'file',
parentId: 'texteditor-app',
content: 'Text Editor Application',
size: 3145728,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'texteditor-dll',
name: 'editor.dll',
type: 'file',
parentId: 'texteditor-app',
content: 'Text Processing Library',
size: 1048576,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'voicerecorder-app',
name: 'VoiceRecorder',
type: 'folder',
parentId: 'program-files-x86',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📁'
},
{
id: 'voicerecorder-exe',
name: 'voicerecorder.exe',
type: 'file',
parentId: 'voicerecorder-app',
content: 'Voice Recorder Application',
size: 4194304,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'voicerecorder-codec',
name: 'audiocodec.dll',
type: 'file',
parentId: 'voicerecorder-app',
content: 'Audio Codec Library',
size: 1572864,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},

{
id: 'current-user',
name: 'user',
type: 'folder',
parentId: 'users',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '👤'
},
{
id: 'desktop',
name: 'Desktop',
type: 'folder',
parentId: 'current-user',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '🖥️'
},
{
id: 'documents',
name: 'Documents',
type: 'folder',
parentId: 'current-user',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📁'
},
{
id: 'pictures',
name: 'Pictures',
type: 'folder',
parentId: 'current-user',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '🖼️'
},
{
id: 'music',
name: 'Music',
type: 'folder',
parentId: 'current-user',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '🎵'
},
{
id: 'videos',
name: 'Videos',
type: 'folder',
parentId: 'current-user',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '🎬'
},
{
id: 'downloads',
name: 'Downloads',
type: 'folder',
parentId: 'current-user',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '⬇️'
},
{
id: 'readme',
name: 'README.txt',
type: 'file',
parentId: 'desktop',
content: 'Welcome to WebOS!\n\nThis is a fully functional web-based operating system.\n\nFeatures:\n- Window management\n- File system\n- Built-in applications\n- Themes and customization\n- And much more!\n\nEnjoy exploring!',
size: 256,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: 'projects',
name: 'Projects',
type: 'folder',
parentId: 'documents',
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📁'
},
{
id: 'browser-desktop',
name: 'Browser',
type: 'file',
parentId: 'desktop',
content: 'shortcut:browser',
size: 0,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '🌐'
},
{
id: 'control-panel-desktop',
name: 'Control Panel',
type: 'file',
parentId: 'desktop',
content: 'shortcut:control-panel',
size: 0,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '🎛️'
},
{
id: 'paint-desktop',
name: 'Paint',
type: 'file',
parentId: 'desktop',
content: 'shortcut:paint',
size: 0,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '🎨'
},
{
id: 'text-editor-desktop',
name: 'Text Editor',
type: 'file',
parentId: 'desktop',
content: 'shortcut:text-editor',
size: 0,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📝'
}
];

export const FileSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [items, setItems] = useState<FileSystemItem[]>(defaultItems);
const [currentPath, setCurrentPath] = useState('/');
const [clipboard, setClipboard] = useState<{ items: FileSystemItem[]; operation: 'copy' | 'cut' | null }>({
items: [],
operation: null
});
const { showConfirm } = useDialog();

useEffect(() => {
const savedItems = localStorage.getItem('fileSystem');
if (savedItems) {
const parsedItems = JSON.parse(savedItems);
setItems(parsedItems.map((item: any) => ({
...item,
createdAt: new Date(item.createdAt),
modifiedAt: new Date(item.modifiedAt)
})));
}
}, []);

useEffect(() => {
const handler = setTimeout(() => {
const itemsToSave = items.filter(item => !item.isDeleted);
try {
localStorage.setItem('fileSystem', JSON.stringify(itemsToSave));
} catch (e: any) {
if (e.name === 'QuotaExceededError' || e.code === 22) {
} else {
throw e;
}
}
}, 1000);
return () => clearTimeout(handler);
}, [items]);

const createFolder = (name: string, parentId: string | null) => {
const newFolder: FileSystemItem = {
id: `folder-${Date.now()}`,
name,
type: 'folder',
parentId,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📁'
};
setItems(prev => [...prev, newFolder]);
};

const createFile = (name: string, content: string, parentId: string | null) => {
let fileSize = content.length;
let fileIcon = getFileIcon(name);
let mimeType = 'text/plain';

if (content.startsWith('data:')) {
const base64Data = content.split(',')[1];
fileSize = Math.floor(base64Data.length * 0.75);
mimeType = content.split(';')[0].replace('data:', '');
}

const newFile: FileSystemItem = {
id: `file-${Date.now()}`,
name,
type: 'file',
parentId,
content,
size: fileSize,
createdAt: new Date(),
modifiedAt: new Date(),
icon: fileIcon,
mimeType
};
setItems(prev => [...prev, newFile]);

const savedFiles = JSON.parse(localStorage.getItem('webos-files') || '[]');
savedFiles.push(newFile);
try {
localStorage.setItem('webos-files', JSON.stringify(savedFiles));
} catch (e: any) {
if (e.name === 'QuotaExceededError' || e.code === 22) {
} else {
throw e;
}
}
};

const createAppFolder = (appName: string, appId: string, isX86: boolean = false) => {
const parentId = isX86 ? 'program-files-x86' : 'program-files';
const folderId = `${appId}-app-folder`;

const appFolder: FileSystemItem = {
id: folderId,
name: appName,
type: 'folder',
parentId,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📁'
};

const appFiles: FileSystemItem[] = [
{
id: `${appId}-exe`,
name: `${appId.toLowerCase()}.exe`,
type: 'file',
parentId: folderId,
content: `${appName} Application Executable`,
size: Math.floor(Math.random() * 20000000) + 2000000,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: `${appId}-dll`,
name: `${appId.toLowerCase()}.dll`,
type: 'file',
parentId: folderId,
content: `${appName} Dynamic Link Library`,
size: Math.floor(Math.random() * 5000000) + 500000,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
},
{
id: `${appId}-config`,
name: 'config.dat',
type: 'file',
parentId: folderId,
content: `version=1.0.0\ninstalled=${new Date().toISOString()}\napp_id=${appId}`,
size: 256,
createdAt: new Date(),
modifiedAt: new Date(),
icon: '📄'
}
];

setItems(prev => [...prev, appFolder, ...appFiles]);
};

const removeAppFolder = (appId: string) => {
setItems(prev => prev.filter(item => 
item.id !== `${appId}-app-folder` && 
item.parentId !== `${appId}-app-folder`
));
};

const restoreApp = (app: any) => {
const isX86App = ['calculator', 'checkers', 'paint', 'text-editor', 'voice-recorder'].includes(app.id);
createAppFolder(app.name, app.id, isX86App);
};

const deleteItem = async (id: string) => {
const systemFolders = ['c-drive', 'd-drive', 'program-files', 'program-files-x86', 'users', 'windows', 'system32', 'drivers-folder', 'config-folder', 'fonts-folder', 'logs-folder', 'temp-folder'];
if (systemFolders.includes(id)) {
await showConfirm('Access Denied', "You can't delete this system folder.");
return;
}

const itemToCheck = getItem(id);
if (itemToCheck) {
const systemExtensions = ['.exe', '.dll', '.sys', '.drv'];
const isSystemFile = systemExtensions.some(ext => itemToCheck.name.toLowerCase().endsWith(ext));
const isInSystemFolder = ['windows', 'system32', 'program-files', 'program-files-x86'].some(folder => 
getPathString(itemToCheck.parentId).toLowerCase().includes(folder)
);

if (isSystemFile && isInSystemFolder) {
await showConfirm('Access Denied', `Cannot delete "${itemToCheck.name}". This is a protected system file.`);
return;
}
}

const item = getItem(id);
if (!item) return;

const confirmed = await showConfirm(
'Delete Item',
`Are you sure you want to delete "${item.name}"? This will move it to the Recycle Bin.`
);

if (!confirmed) return;

setItems(prev => prev.map(item => 
item.id === id || item.parentId === id 
? { ...item, isDeleted: true, deletedAt: new Date() }
: item
));
};

const permanentlyDeleteItem = async (id: string) => {
const item = getItem(id);
if (!item) return;

const confirmed = await showConfirm(
'Permanently Delete',
`Are you sure you want to permanently delete "${item.name}"? This action cannot be undone.`
);

if (!confirmed) return;

setItems(prev => prev.filter(item => item.id !== id && item.parentId !== id));
};

const restoreItem = (id: string) => {
setItems(prev => prev.map(item => 
item.id === id ? { ...item, isDeleted: false, deletedAt: undefined } : item
));
};

const emptyRecycleBin = async () => {
const recycleBinItems = getRecycleBinItems();
if (recycleBinItems.length === 0) return;

const confirmed = await showConfirm(
'Empty Recycle Bin',
`Are you sure you want to permanently delete all ${recycleBinItems.length} items in the Recycle Bin? This action cannot be undone.`
);

if (!confirmed) return;

setItems(prev => prev.filter(item => !item.isDeleted));
};

const getRecycleBinItems = () => {
return items.filter(item => item.isDeleted);
};

const renameItem = (id: string, newName: string) => {
setItems(prev => prev.map(item => 
item.id === id ? { ...item, name: newName, modifiedAt: new Date() } : item
));
};

const moveItem = (id: string, newParentId: string | null) => {
setItems(prev => prev.map(item => 
item.id === id ? { ...item, parentId: newParentId, modifiedAt: new Date() } : item
));
};

const getItem = (id: string) => {
return items.find(item => item.id === id);
};

const getItemsByParent = (parentId: string | null) => {
return items.filter(item => item.parentId === parentId && !item.isDeleted);
};

const copyItems = (itemIds: string[]) => {
const itemsToCopy = items.filter(item => itemIds.includes(item.id));
setClipboard({ items: itemsToCopy, operation: 'copy' });
};

const cutItems = (itemIds: string[]) => {
const itemsToCut = items.filter(item => itemIds.includes(item.id));
setClipboard({ items: itemsToCut, operation: 'cut' });
};

const pasteItems = (targetParentId: string | null) => {
if (clipboard.items.length === 0) return;

if (clipboard.operation === 'copy') {
clipboard.items.forEach(item => {
const newItem = {
...item,
id: `${item.type}-${Date.now()}-${Math.random()}`,
parentId: targetParentId,
name: `Copy of ${item.name}`,
createdAt: new Date(),
modifiedAt: new Date()
};
setItems(prev => [...prev, newItem]);
});
} else if (clipboard.operation === 'cut') {
setItems(prev => prev.map(item => 
clipboard.items.some(clipItem => clipItem.id === item.id)
? { ...item, parentId: targetParentId, modifiedAt: new Date() }
: item
));
}

setClipboard({ items: [], operation: null });
};

const updateFileContent = (id: string, content: string) => {
setItems(prev => prev.map(item => 
item.id === id ? { 
...item, 
content, 
size: content.length, 
modifiedAt: new Date() 
} : item
));
};

const getPathString = (itemId: string | null): string => {
if (!itemId) return '/';

const item = getItem(itemId);
if (!item) return '/';

const parentPath = getPathString(item.parentId);
return parentPath === '/' ? `/${item.name}` : `${parentPath}/${item.name}`;
};

const value = {
items,
currentPath,
setCurrentPath,
createFolder,
createFile,
deleteItem,
permanentlyDeleteItem,
restoreItem,
emptyRecycleBin,
getRecycleBinItems,
renameItem,
moveItem,
getItem,
getItemsByParent,
updateFileContent,
getPathString,
clipboard,
copyItems,
cutItems,
pasteItems,
createAppFolder,
removeAppFolder,
restoreApp,
};

return (
<FileSystemContext.Provider value={value}>
{children}
</FileSystemContext.Provider>
);
};

const getFileIcon = (filename: string): string => {
const ext = filename.split('.').pop()?.toLowerCase();
switch (ext) {
case 'txt': return '📄';
case 'pdf': return '📕';
case 'doc':
case 'docx': return '📄';
case 'jpg':
case 'jpeg':
case 'png':
case 'gif': return '🖼️';
case 'mp3':
case 'wav': return '🎵';
case 'mp4':
case 'mov': return '🎬';
case 'zip':
case 'rar': return '📦';
case 'js':
case 'ts':
case 'html':
case 'css': return '💻';
default: return '📄';
}
};