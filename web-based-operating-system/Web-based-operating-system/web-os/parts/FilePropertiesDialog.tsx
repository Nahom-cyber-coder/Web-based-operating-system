import React from 'react';
import { X, File, Folder, HardDrive } from 'lucide-react';
import { useFileSystem } from '../settings/FileSystemContext';

interface FilePropertiesDialogProps {
isOpen: boolean;
onClose: () => void;
fileId: string;
}

const FilePropertiesDialog: React.FC<FilePropertiesDialogProps> = ({ isOpen, onClose, fileId }) => {
const { getItem, getPathString } = useFileSystem();

if (!isOpen) return null;

const file = getItem(fileId);
if (!file) return null;

const formatFileSize = (bytes: number) => {
if (bytes === 0) return '0 bytes';
const k = 1024;
const sizes = ['bytes', 'KB', 'MB', 'GB'];
const i = Math.floor(Math.log(bytes) / Math.log(k));
return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileType = () => {
if (file.type === 'folder') return 'File folder';
const ext = file.name.split('.').pop()?.toLowerCase();
switch (ext) {
case 'txt': return 'Text Document';
case 'jpg':
case 'jpeg':
case 'png':
case 'gif': return 'Image file';
case 'mp3':
case 'wav': return 'Audio file';
case 'mp4':
case 'mov': return 'Video file';
case 'pdf': return 'PDF Document';
case 'exe': return 'Application';
case 'dll': return 'Dynamic Link Library';
case 'sys': return 'System file';
case 'ini': return 'Configuration file';
case 'dat': return 'Data file';
case 'log': return 'Log file';
case 'xml': return 'XML Document';
default: return 'File';
}
};

return (
<div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
<div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4">
<div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
<div className="flex items-center space-x-3">
{file.type === 'folder' ? (
<Folder className="w-6 h-6 text-blue-500" />
) : (
<File className="w-6 h-6 text-gray-500" />
)}
<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
{file.name} Properties
</h2>
</div>
<button
onClick={onClose}
className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
>
<X className="w-5 h-5 text-gray-500" />
</button>
</div>

<div className="p-6 space-y-4">
<div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
<div className="text-4xl">{file.icon}</div>
<div>
<h3 className="font-medium text-gray-900 dark:text-white">{file.name}</h3>
<p className="text-sm text-gray-600 dark:text-gray-400">{getFileType()}</p>
</div>
</div>

<div className="space-y-3">
<div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
<span className="text-sm font-medium text-gray-700 dark:text-gray-300">Type:</span>
<span className="text-sm text-gray-900 dark:text-white">{getFileType()}</span>
</div>

<div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
<span className="text-sm font-medium text-gray-700 dark:text-gray-300">Size:</span>
<span className="text-sm text-gray-900 dark:text-white">
{file.type === 'folder' ? '—' : formatFileSize(file.size || 0)}
</span>
</div>

<div className="flex items-start justify-between py-2 border-b border-gray-200 dark:border-gray-700">
<span className="text-sm font-medium text-gray-700 dark:text-gray-300">Location:</span>
<span className="text-sm text-gray-900 dark:text-white text-right max-w-48 break-all">
{getPathString(file.parentId)}
</span>
</div>

<div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
<span className="text-sm font-medium text-gray-700 dark:text-gray-300">Created:</span>
<span className="text-sm text-gray-900 dark:text-white">
{file.createdAt.toLocaleDateString()} {file.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
</span>
</div>

<div className="flex items-center justify-between py-2">
<span className="text-sm font-medium text-gray-700 dark:text-gray-300">Modified:</span>
<span className="text-sm text-gray-900 dark:text-white">
{file.modifiedAt.toLocaleDateString()} {file.modifiedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
</span>
</div>
</div>

{file.type === 'file' && file.content && (
<div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
<div className="flex items-center space-x-2 mb-2">
<HardDrive className="w-4 h-4 text-blue-600" />
<span className="text-sm font-medium text-blue-800 dark:text-blue-200">File Details</span>
</div>
<div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
{file.content.startsWith('data:') && (
<p>MIME Type: {file.content.split(';')[0].replace('data:', '')}</p>
)}
<p>Characters: {file.content.length.toLocaleString()}</p>
{file.type === 'file' && file.content && !file.content.startsWith('data:') && (
<p>Lines: {file.content.split('\n').length}</p>
)}
</div>
</div>
)}
</div>

<div className="flex justify-end p-6 pt-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl">
<button
onClick={onClose}
className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
>
OK
</button>
</div>
</div>
</div>
);
};

export default FilePropertiesDialog;