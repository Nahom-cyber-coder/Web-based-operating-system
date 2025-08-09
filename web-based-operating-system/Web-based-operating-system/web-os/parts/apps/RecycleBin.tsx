import React from 'react';
import { useFileSystem } from '../../settings/FileSystemContext';
import { useDialog } from '../../settings/DialogContext';
import { Trash2, RotateCcw, X, FolderOpen } from 'lucide-react';

const RecycleBin: React.FC = () => {
const { getRecycleBinItems, restoreItem, permanentlyDeleteItem, emptyRecycleBin } = useFileSystem();
const { showConfirm } = useDialog();
const recycleBinItems = getRecycleBinItems();

const formatDate = (date: Date) => {
return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const handleRestore = (id: string) => {
restoreItem(id);
};

const handlePermanentDelete = async (id: string) => {
const item = recycleBinItems.find(item => item.id === id);
if (!item) return;

const confirmed = await showConfirm(
'Permanently Delete',
`Are you sure you want to permanently delete "${item.name}"? This action cannot be undone.`
);

if (confirmed) {
permanentlyDeleteItem(id);
}
};

const handleEmptyRecycleBin = async () => {
if (recycleBinItems.length === 0) return;

const confirmed = await showConfirm(
'Empty Recycle Bin',
`Are you sure you want to permanently delete all ${recycleBinItems.length} items? This action cannot be undone.`
);

if (confirmed) {
emptyRecycleBin();
}
};

return (
<div className="h-full bg-white dark:bg-gray-900 flex flex-col">
<div className="border-b border-gray-200 dark:border-gray-700 p-4">
<div className="flex items-center justify-between">
<div className="flex items-center space-x-3">
<Trash2 className="w-6 h-6 text-gray-600 dark:text-gray-300" />
<h1 className="text-xl font-semibold text-gray-900 dark:text-white">Recycle Bin</h1>
</div>
{recycleBinItems.length > 0 && (
<button
onClick={handleEmptyRecycleBin}
className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
>
<Trash2 className="w-4 h-4" />
<span>Empty Recycle Bin</span>
</button>
)}
</div>
<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
{recycleBinItems.length} item{recycleBinItems.length !== 1 ? 's' : ''}
</p>
</div>

<div className="flex-1 p-4">
{recycleBinItems.length === 0 ? (
<div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
<FolderOpen className="w-16 h-16 mb-4 opacity-50" />
<h2 className="text-xl font-medium mb-2">Recycle Bin is empty</h2>
<p className="text-center">
When you delete files or folders, they'll appear here before being permanently removed.
</p>
</div>
) : (
<div className="space-y-2">
{recycleBinItems.map((item) => (
<div
key={item.id}
className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
>
<div className="flex items-center space-x-3">
<span className="text-2xl">{item.icon}</span>
<div>
<div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
<div className="text-sm text-gray-500 dark:text-gray-400">
Deleted: {item.deletedAt ? formatDate(item.deletedAt) : 'Unknown'}
</div>
<div className="text-xs text-gray-400 dark:text-gray-500">
Original location: {item.parentId || 'Desktop'}
</div>
</div>
</div>

<div className="flex items-center space-x-2">
<button
onClick={() => handleRestore(item.id)}
className="flex items-center space-x-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
title="Restore"
>
<RotateCcw className="w-3 h-3" />
<span>Restore</span>
</button>
<button
onClick={() => handlePermanentDelete(item.id)}
className="flex items-center space-x-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors"
title="Delete permanently"
>
<X className="w-3 h-3" />
<span>Delete</span>
</button>
</div>
</div>
))}
</div>
)}
</div>
</div>
);
};

export default RecycleBin;