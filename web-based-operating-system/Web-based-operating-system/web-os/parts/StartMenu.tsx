import React from 'react';
import { useWindows } from '../settings/WindowContext';
import { useOS } from '../settings/OSContext';
import { useState } from 'react';
import { Power, Settings, User, Search, Grid, List, ChevronUp } from 'lucide-react';
import { useAuth } from '../helpers/useAuth';
import AppContextMenu from './AppContextMenu';
import { useDialog } from '../settings/DialogContext';
import { useAppRegistry } from '../settings/AppRegistryContext';
import { useGlobalSearch } from '../helpers/useGlobalSearch';
import PowerMenu from './PowerMenu';

const StartMenu: React.FC = () => {
const { isStartMenuOpen, setIsStartMenuOpen, searchQuery, setSearchQuery } = useOS();
const { openWindow } = useWindows();
const { user, logout, lock } = useAuth();
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
const [showAppContextMenu, setShowAppContextMenu] = useState(false);
const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
const [contextMenuApp, setContextMenuApp] = useState<any>(null);
const { pinnedApps, setPinnedApps } = useOS();
const { getInstalledApps, isAppInstalled, isLoaded } = useAppRegistry();
const { showAlert } = useDialog();
const [showPowerMenu, setShowPowerMenu] = useState(false);
const [powerButtonPosition, setPowerButtonPosition] = useState({ x: 0, y: 0 });

const { results: searchResults, hasResults } = useGlobalSearch(searchQuery);

const apps = getInstalledApps();

if (!isLoaded) {
return null;
}

const filteredApps = searchQuery.trim() 
? apps.filter(app =>
app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
app.category.toLowerCase().includes(searchQuery.toLowerCase())
)
: apps;

const categories = [...new Set(apps.map(app => app.category))];

const handleAppClick = (app: any) => {
if (!isAppInstalled(app.id)) {
showAlert('App Not Found', `${app.name} is no longer installed.`, 'error');
return;
}

openWindow({
title: app.name,
appId: app.id,
position: { x: 100, y: 100 },
size: { width: 800, height: 600 },
icon: app.icon
});
setIsStartMenuOpen(false);
};

const handleAppRightClick = (e: React.MouseEvent, app: any) => {
e.preventDefault();
e.stopPropagation();
setContextMenuPosition({ x: e.clientX, y: e.clientY });
setContextMenuApp(app);
setShowAppContextMenu(true);
};

const handlePowerButtonClick = (e: React.MouseEvent) => {
e.stopPropagation();
const rect = e.currentTarget.getBoundingClientRect();
setPowerButtonPosition({ 
x: rect.left, 
y: rect.top 
});
setShowPowerMenu(!showPowerMenu);
};

if (!isStartMenuOpen) return null;

return (
<>
<div 
className="fixed inset-0 z-[9998]"
onClick={() => setIsStartMenuOpen(false)}
/>

<div className="fixed bottom-12 left-2 w-96 h-[600px] bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl z-[9999] flex flex-col">
<div className="p-4 border-b border-white/10">
<div className="flex items-center space-x-3 mb-4">
<img
src={user?.avatar}
alt={user?.username}
className="w-10 h-10 rounded-full"
/>
<div>
<p className="text-white font-medium">{user?.username}</p>
<p className="text-white/60 text-sm">{user?.email}</p>
</div>
</div>

<div className="relative">
<Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 transform -translate-y-1/2" />
<input
type="text"
placeholder="Search apps..."
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50"
/>
</div>
</div>

<div className="px-4 py-2 border-b border-white/10">
<div className="flex rounded-lg overflow-hidden bg-white/10">
<button
onClick={() => setViewMode('grid')}
className={`flex-1 flex items-center justify-center py-2 px-3 text-sm transition-colors ${
viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-white/70 hover:text-white'
}`}
>
<Grid className="w-4 h-4 mr-2" />
Grid
</button>
<button
onClick={() => setViewMode('list')}
className={`flex-1 flex items-center justify-center py-2 px-3 text-sm transition-colors ${
viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-white/70 hover:text-white'
}`}
>
<List className="w-4 h-4 mr-2" />
List
</button>
</div>
</div>

<div className="flex-1 overflow-y-auto p-4">
{searchQuery ? (
<div>
<h3 className="text-white/80 text-sm font-medium mb-3">
Search Results ({hasResults ? searchResults.length : 0})
</h3>
{hasResults ? (
<div className="space-y-2">
{searchResults.map((result) => (
<button
key={result.id}
onClick={() => {
if (result.type === 'app') {
const app = apps.find(a => a.name === result.title);
if (app) handleAppClick(app);
} else if (result.type === 'file' || result.type === 'folder') {
result.action();
} else if (result.type === 'web') {
handleAppClick({ 
id: 'browser', 
name: 'Browser', 
componentId: 'browser',
icon: '🌐' 
});
}
setIsStartMenuOpen(false);
}}
className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-left"
>
<span className="text-lg flex-shrink-0">{result.icon}</span>
<div className="flex-1 min-w-0">
<div className="text-white text-sm font-medium truncate">{result.title}</div>
<div className="text-white/60 text-xs truncate">{result.description}</div>
{result.category && (
<div className="text-white/40 text-xs">{result.category}</div>
)}
</div>
<div className="text-white/40 text-xs flex-shrink-0 capitalize">
{result.type}
</div>
</button>
))}
</div>
) : (
<div className="text-center py-8 text-white/60">
<div className="text-4xl mb-2">🔍</div>
<p>No results found for "{searchQuery}"</p>
<p className="text-xs mt-1">Try searching for apps, files, or web content</p>
</div>
)}
</div>
) : (
<div className="space-y-4">
{categories.map((category) => {
const categoryApps = apps.filter(app => app.category === category);
return (
<div key={category}>
<h3 className="text-white/80 text-sm font-medium mb-2">{category}</h3>
{viewMode === 'grid' ? (
<div className="grid grid-cols-4 gap-3">
{categoryApps.map((app) => (
<button
key={app.id}
onClick={() => handleAppClick(app)}
onContextMenu={(e) => handleAppRightClick(e, app)}
className="flex flex-col items-center p-3 rounded-lg hover:bg-white/10 transition-colors group"
>
<span className="text-2xl mb-1">{app.icon}</span>
<span className="text-white text-xs text-center leading-tight">
{app.name}
</span>
</button>
))}
</div>
) : (
<div className="space-y-1">
{categoryApps.map((app) => (
<button
key={app.id}
onClick={() => handleAppClick(app)}
onContextMenu={(e) => handleAppRightClick(e, app)}
className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors text-left"
>
<span className="text-lg">{app.icon}</span>
<span className="text-white text-sm">{app.name}</span>
</button>
))}
</div>
)}
</div>
);
})}
</div>
)}
</div>

<div className="border-t border-white/10 p-4">
<div className="flex items-center justify-between">
<button
onClick={() => handleAppClick({ 
id: 'settings', 
name: 'Settings', 
componentId: 'settings',
icon: '⚙️' 
})}
className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
>
<Settings className="w-4 h-4 text-white/80" />
<span className="text-white text-sm">Settings</span>
</button>

<div className="flex items-center space-x-1">
<button
onClick={() => lock()}
className="p-2 rounded-lg hover:bg-white/10 transition-colors"
title="Lock"
>
<User className="w-4 h-4 text-white/80" />
</button>
<button
onClick={handlePowerButtonClick}
className="p-2 rounded-lg hover:bg-white/10 transition-colors"
title="Power"
>
<div className="flex items-center space-x-1">
<Power className="w-4 h-4 text-white/80" />
<ChevronUp className="w-3 h-3 text-white/60" />
</div>
</button>
</div>
</div>
</div>
</div>

{showAppContextMenu && contextMenuApp && (
<AppContextMenu
app={contextMenuApp}
position={contextMenuPosition}
onClose={() => setShowAppContextMenu(false)}
onOpen={() => {
handleAppClick(contextMenuApp);
setShowAppContextMenu(false);
}}
/>
)}

<PowerMenu
isOpen={showPowerMenu}
onClose={() => setShowPowerMenu(false)}
position={powerButtonPosition}
/>
</>
);
};

export default StartMenu;