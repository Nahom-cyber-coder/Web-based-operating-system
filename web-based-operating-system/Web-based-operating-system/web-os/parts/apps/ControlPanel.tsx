import React, { useState } from 'react';
import { useWindows } from '../../settings/WindowContext';
import { useDialog } from '../../settings/DialogContext';
import { useAppRegistry } from '../../settings/AppRegistryContext';
import { useFileSystem } from '../../settings/FileSystemContext';
import { useOS } from '../../settings/OSContext';
import { Search, Trash2, Package, AlertTriangle, Star, RotateCcw } from 'lucide-react';

const ControlPanel: React.FC = () => {
const [viewMode, setViewMode] = useState<'large' | 'small'>('large');
const [searchQuery, setSearchQuery] = useState('');
const [categoryFilter, setCategoryFilter] = useState<string>('all');
const [sortBy, setSortBy] = useState<'name' | 'size' | 'date' | 'category'>('name');
const [isUninstalling, setIsUninstalling] = useState<string | null>(null);

const { openWindow, windows, closeWindow } = useWindows();
const { showConfirm, showAlert } = useDialog();
const { getInstalledApps, uninstallApp, resetToDefaults } = useAppRegistry();
const { removeAppFolder } = useFileSystem();
const { pinnedApps, setPinnedApps } = useOS();

const installedApps = getInstalledApps();

const softwareApps = installedApps.map(app => ({
id: app.id,
name: app.name,
publisher: app.isSystemApp ? 'WebOS System' : 'WebOS Corporation',
size: Math.random() * 10 + 1,
installedDate: '2024-01-15',
version: '1.0.0',
icon: app.icon,
category: app.category,
isSystemApp: app.isSystemApp || false
}));

const categories = ['all', ...new Set(softwareApps.map(app => app.category))];

const filteredApps = softwareApps
.filter(app => {
const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
app.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
app.category.toLowerCase().includes(searchQuery.toLowerCase());
const matchesCategory = categoryFilter === 'all' || app.category === categoryFilter;
return matchesSearch && matchesCategory;
})
.sort((a, b) => {
switch (sortBy) {
case 'name':
return a.name.localeCompare(b.name);
case 'size':
return b.size - a.size;
case 'date':
return new Date(b.installedDate).getTime() - new Date(a.installedDate).getTime();
case 'category':
return a.category.localeCompare(b.category);
default:
return 0;
}
});

const handleUninstall = async (appId: string, appName: string) => {
const app = softwareApps.find(a => a.id === appId);
if (!app) return;

if (app.isSystemApp) {
await showAlert('Cannot Uninstall', `${appName} is a system application and cannot be uninstalled.`, 'error');
return;
}


const runningWindows = windows.filter(w => w.appId === appId || w.title.toLowerCase().includes(appName.toLowerCase()));

if (runningWindows.length > 0) {
const forceClose = await showConfirm(
'App Currently Running',
`${appName} is currently running. Do you want to close it and continue with uninstallation?`
);

if (!forceClose) return;

runningWindows.forEach(window => closeWindow(window.id));
}

const confirmed = await showConfirm(
'Uninstall Program',
`Are you sure you want to uninstall ${appName}? This will permanently remove the application and all its data from your system.`
);

if (confirmed) {
setIsUninstalling(appId);

try {
setPinnedApps(pinnedApps.filter(pinnedApp => pinnedApp.id !== appId));

removeAppFolder(appId);

await new Promise(resolve => setTimeout(resolve, 2000));

const success = await uninstallApp(appId);

if (success) {
await showAlert('Uninstall Complete', `${appName} has been uninstalled successfully.`, 'success');
} else {
await showAlert('Uninstall Failed', `Failed to uninstall ${appName}. Please try again.`, 'error');
}
} catch (error) {
await showAlert('Uninstall Error', `An error occurred while uninstalling ${appName}.`, 'error');
} finally {
setIsUninstalling(null);
}
}
};

const handleResetOS = async () => {
const confirmed = await showConfirm(
'Reset WebOS',
'This will restore all default applications and clear any customizations. Are you sure?'
);

if (confirmed) {
resetToDefaults();
await showAlert('Reset Complete', 'WebOS has been reset to factory defaults.', 'success');
}
};

return (
<div className="h-full bg-gray-50 dark:bg-gray-900 p-6">
<div className="mb-6">
<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Control Panel</h1>
<p className="text-gray-600 dark:text-gray-400">
Manage installed programs and system settings
</p>
</div>

<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
<div className="p-4 border-b border-gray-200 dark:border-gray-700">
<div className="flex items-center justify-between mb-4">
<h3 className="text-lg font-semibold text-gray-900 dark:text-white">Programs and Features</h3>
<div className="flex items-center space-x-2">
<button
onClick={handleResetOS}
className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
>
<RotateCcw className="w-4 h-4" />
<span>Reset System</span>
</button>
</div>
</div>
<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
To uninstall a program, select it from the list and then click Uninstall.
</p>

<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
<div className="relative">
<Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
<input
type="text"
placeholder="Search programs..."
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
</div>

<select
value={categoryFilter}
onChange={(e) => setCategoryFilter(e.target.value)}
className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
>
{categories.map((category) => (
<option key={category} value={category}>
{category === 'all' ? 'All Categories' : category}
</option>
))}
</select>

<select
value={sortBy}
onChange={(e) => setSortBy(e.target.value as any)}
className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
>
<option value="name">Sort by Name</option>
<option value="size">Sort by Size</option>
<option value="date">Sort by Date</option>
<option value="category">Sort by Category</option>
</select>

<div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
<button
onClick={() => setViewMode('large')}
className={`p-2 flex-1 ${viewMode === 'large' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
title="Large view"
>
Large
</button>
<button
onClick={() => setViewMode('small')}
className={`p-2 flex-1 ${viewMode === 'small' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
title="List view"
>
List
</button>
</div>
</div>
</div>

<div className="p-4">
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
<div className="flex items-center space-x-2">
<Package className="w-4 h-4 text-blue-600" />
<span className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Apps</span>
</div>
<p className="text-lg font-bold text-blue-900 dark:text-blue-100">{filteredApps.length}</p>
</div>

<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
<div className="flex items-center space-x-2">
<span className="text-green-600">✓</span>
<span className="text-sm font-medium text-green-800 dark:text-green-200">User Apps</span>
</div>
<p className="text-lg font-bold text-green-900 dark:text-green-100">
{filteredApps.filter(app => !app.isSystemApp).length}
</p>
</div>

<div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
<div className="flex items-center space-x-2">
<Package className="w-4 h-4 text-orange-600" />
<span className="text-sm font-medium text-orange-800 dark:text-orange-200">System Apps</span>
</div>
<p className="text-lg font-bold text-orange-900 dark:text-orange-100">
{filteredApps.filter(app => app.isSystemApp).length}
</p>
</div>

<div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
<div className="flex items-center space-x-2">
<Star className="w-4 h-4 text-purple-600" />
<span className="text-sm font-medium text-purple-800 dark:text-purple-200">Pinned Apps</span>
</div>
<p className="text-lg font-bold text-purple-900 dark:text-purple-100">{pinnedApps.length}</p>
</div>
</div>

{viewMode === 'large' ? (
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
{filteredApps.map((app) => (
<div
key={app.id}
className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
>
<div className="text-center">
<span className="text-3xl mb-2 block">{app.icon}</span>
<h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1 truncate">{app.name}</h4>
<p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{app.category}</p>
<p className="text-xs text-gray-500 dark:text-gray-500 mb-3">{app.size.toFixed(1)} MB</p>

{app.isSystemApp ? (
<div className="flex items-center justify-center space-x-1 px-2 py-1 text-xs bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded">
<Package className="w-3 h-3" />
<span>System</span>
</div>
) : (
<button
onClick={() => handleUninstall(app.id, app.name)}
disabled={isUninstalling === app.id}
className="w-full flex items-center justify-center space-x-1 px-2 py-1 text-xs bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded transition-colors"
>
{isUninstalling === app.id ? (
<>
<div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
<span>Removing...</span>
</>
) : (
<>
<Trash2 className="w-3 h-3" />
<span>Uninstall</span>
</>
)}
</button>
)}
</div>
</div>
))}
</div>
) : (
<div className="overflow-x-auto">
<table className="w-full">
<thead>
<tr className="border-b border-gray-200 dark:border-gray-700">
<th className="text-left py-3 px-3 text-sm font-medium text-gray-600 dark:text-gray-400">Name</th>
<th className="text-left py-3 px-3 text-sm font-medium text-gray-600 dark:text-gray-400">Publisher</th>
<th className="text-left py-3 px-3 text-sm font-medium text-gray-600 dark:text-gray-400">Category</th>
<th className="text-left py-3 px-3 text-sm font-medium text-gray-600 dark:text-gray-400">Installed On</th>
<th className="text-left py-3 px-3 text-sm font-medium text-gray-600 dark:text-gray-400">Size</th>
<th className="text-left py-3 px-3 text-sm font-medium text-gray-600 dark:text-gray-400">Version</th>
<th className="text-left py-3 px-3 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
</tr>
</thead>
<tbody>
{filteredApps.map((app) => (
<tr key={app.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
<td className="py-3 px-3">
<div className="flex items-center space-x-3">
<span className="text-lg">{app.icon}</span>
<span className="font-medium text-gray-900 dark:text-white">{app.name}</span>
</div>
</td>
<td className="py-3 px-3 text-sm text-gray-600 dark:text-gray-400">{app.publisher}</td>
<td className="py-3 px-3 text-sm text-gray-600 dark:text-gray-400">
<span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
{app.category}
</span>
</td>
<td className="py-3 px-3 text-sm text-gray-600 dark:text-gray-400">{app.installedDate}</td>
<td className="py-3 px-3 text-sm text-gray-600 dark:text-gray-400">{app.size.toFixed(1)} MB</td>
<td className="py-3 px-3 text-sm text-gray-600 dark:text-gray-400">{app.version}</td>
<td className="py-3 px-3">
{app.isSystemApp ? (
<div className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded">
<Package className="w-3 h-3" />
<span>System App</span>
</div>
) : (
<button
onClick={() => handleUninstall(app.id, app.name)}
disabled={isUninstalling === app.id}
className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded transition-colors"
>
{isUninstalling === app.id ? (
<>
<div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
<span>Uninstalling...</span>
</>
) : (
<>
<Trash2 className="w-3 h-3" />
<span>Uninstall</span>
</>
)}
</button>
)}
</td>
</tr>
))}
</tbody>
</table>

{filteredApps.length === 0 && (
<div className="text-center py-8 text-gray-500 dark:text-gray-400">
<Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
<p>No programs found matching your search criteria.</p>
</div>
)}
</div>
)}

<div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
<div>
<span className="font-medium text-gray-900 dark:text-white">Total Programs:</span>
<span className="ml-2 text-gray-600 dark:text-gray-400">{filteredApps.length}</span>
</div>
<div>
<span className="font-medium text-gray-900 dark:text-white">Can be uninstalled:</span>
<span className="ml-2 text-gray-600 dark:text-gray-400">
{filteredApps.filter(a => !a.isSystemApp).length}
</span>
</div>
<div>
<span className="font-medium text-gray-900 dark:text-white">Total size:</span>
<span className="ml-2 text-gray-600 dark:text-gray-400">
{filteredApps.reduce((sum, app) => sum + app.size, 0).toFixed(1)} MB
</span>
</div>
</div>
</div>

<div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
<div className="flex items-start space-x-2">
<AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
<div className="text-sm">
<p className="font-medium text-yellow-800 dark:text-yellow-200">Important Notice</p>
<p className="text-yellow-700 dark:text-yellow-300">
System applications are protected and cannot be uninstalled. Uninstalling user applications will permanently remove them and their data.
</p>
</div>
</div>
</div>
</div>
</div>
</div>
);
};

export default ControlPanel;