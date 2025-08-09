import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode, LazyExoticComponent, ComponentType, useRef } from 'react';
import { useFileSystem } from './FileSystemContext';
import apps, { isAppAvailable } from '../data/apps';

interface App {
id: string;
name: string;
componentId: string;
icon: string;
category: string;
isSystemApp?: boolean;
}

interface AppRegistryContextType {
getApp: (id: string) => App | undefined;
isAppInstalled: (id: string) => boolean;
getAppComponent: (id: string) => LazyExoticComponent<ComponentType<any>> | null;
getAllApps: () => App[];
getInstalledApps: () => App[];
uninstallApp: (id: string) => Promise<boolean>;
installApp: (app: App) => void;
isLoaded: boolean;
resetToDefaults: () => void;
}

const AppRegistryContext = createContext<AppRegistryContextType | undefined>(undefined);

export const useAppRegistry = () => {
const context = useContext(AppRegistryContext);
if (!context) throw new Error('useAppRegistry must be used within an AppRegistryProvider');
return context;
};

const SYSTEM_APPS: App[] = [
{ id: 'file-explorer', name: 'File Explorer', componentId: 'file-explorer', icon: '📁', category: 'System', isSystemApp: true },
{ id: 'settings', name: 'Settings', componentId: 'settings', icon: '⚙️', category: 'System', isSystemApp: true },
{ id: 'task-manager', name: 'Task Manager', componentId: 'task-manager', icon: '📊', category: 'System', isSystemApp: true },
{ id: 'terminal', name: 'Terminal', componentId: 'terminal', icon: '💻', category: 'System', isSystemApp: true },
{ id: 'control-panel', name: 'Control Panel', componentId: 'control-panel', icon: '🎛️', category: 'System', isSystemApp: true },
{ id: 'recycle-bin', name: 'Recycle Bin', componentId: 'recycle-bin', icon: '🗑️', category: 'System', isSystemApp: true },
{ id: 'image-viewer', name: 'Image Viewer', componentId: 'image-viewer', icon: '🖼️', category: 'Media', isSystemApp: true },
{ id: 'audio-player', name: 'Audio Player', componentId: 'audio-player', icon: '🎵', category: 'Media', isSystemApp: true }
];

const DEFAULT_USER_APPS: App[] = [
{ id: 'calculator', name: 'Calculator', componentId: 'calculator', icon: '🧮', category: 'Utilities' },
{ id: 'text-editor', name: 'Text Editor', componentId: 'text-editor', icon: '📝', category: 'Productivity' },
{ id: 'browser', name: 'Browser', componentId: 'browser', icon: '🌐', category: 'Internet' },
{ id: 'paint', name: 'Paint', componentId: 'paint', icon: '🎨', category: 'Graphics' },
{ id: 'spreadsheet', name: 'Spreadsheet', componentId: 'spreadsheet', icon: '📊', category: 'Productivity' },
{ id: 'snake', name: 'Snake', componentId: 'snake', icon: '🐍', category: 'Games' },
{ id: 'tetris', name: 'Tetris', componentId: 'tetris', icon: '🧩', category: 'Games' },
{ id: 'checkers', name: 'Checkers', componentId: 'checkers', icon: '🏁', category: 'Games' },
{ id: 'camera', name: 'Camera', componentId: 'camera', icon: '📷', category: 'Media' },
{ id: 'voice-recorder', name: 'Voice Recorder', componentId: 'voice-recorder', icon: '🎤', category: 'Media' }
];

const ALL_DEFAULT_APPS = [...SYSTEM_APPS, ...DEFAULT_USER_APPS];
const STORAGE_KEY = 'webos-installed-apps';

export const AppRegistryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
const [installedApps, setInstalledApps] = useState<App[]>([]);
const [isLoaded, setIsLoaded] = useState(false);

const lazyComponentCache = useRef<Record<string, LazyExoticComponent<ComponentType<any>>>>({});


useEffect(() => {
try {
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
const parsed: App[] = JSON.parse(saved);

const systemAppsFromSaved = parsed.filter(app => app.isSystemApp);
const userAppsFromSaved = parsed.filter(app => !app.isSystemApp);

const mergedSystemApps = SYSTEM_APPS.map(sys => systemAppsFromSaved.find(a => a.id === sys.id) || sys);
const finalApps = [...mergedSystemApps, ...userAppsFromSaved];

setInstalledApps(finalApps);
} else {
setInstalledApps(ALL_DEFAULT_APPS);
}
} catch (e) {
localStorage.removeItem(STORAGE_KEY);
setInstalledApps(ALL_DEFAULT_APPS);
}
setIsLoaded(true);
}, []);

useEffect(() => {
if (isLoaded) {
localStorage.setItem(STORAGE_KEY, JSON.stringify(installedApps));
}
}, [installedApps, isLoaded]);

const getApp = useCallback((id: string) => installedApps.find(app => app.id === id), [installedApps]);

const isAppInstalled = useCallback((id: string) => installedApps.some(app => app.id === id), [installedApps]);

const getAppComponent = useCallback((id: string) => {
if (lazyComponentCache.current[id]) {
return lazyComponentCache.current[id];
}
const app = getApp(id);
if (!app || !isAppAvailable(app.componentId)) return null;

const appLoader = apps[app.componentId as keyof typeof apps];
const lazyComp = React.lazy(appLoader);
lazyComponentCache.current[id] = lazyComp;
return lazyComp;
}, [getApp]);

const installApp = useCallback((app: App) => {
setInstalledApps(prev => (prev.some(a => a.id === app.id) ? prev : [...prev, app]));
}, []);

const uninstallApp = useCallback(async (id: string) => {
const app = getApp(id);
if (!app || app.isSystemApp) return false;

const deletedApp = {
id: app.id,
name: app.name,
componentId: app.componentId,
icon: app.icon,
category: app.category,
deletedAt: new Date(),
reason: 'Uninstalled by user'
};

const savedDeletedApps = JSON.parse(localStorage.getItem('deletedApps') || '[]');
savedDeletedApps.push(deletedApp);
localStorage.setItem('deletedApps', JSON.stringify(savedDeletedApps));

setInstalledApps(prev => prev.filter(a => a.id !== id));
return true;
}, [getApp]);

const resetToDefaults = useCallback(() => {
setInstalledApps(ALL_DEFAULT_APPS);
localStorage.removeItem(STORAGE_KEY);
}, []);

const value = useMemo(() => ({
getApp,
isAppInstalled,
getAppComponent,
getAllApps: () => installedApps,
getInstalledApps: () => installedApps,
uninstallApp,
installApp,
isLoaded,
resetToDefaults
}), [installedApps, isLoaded, getApp, isAppInstalled, getAppComponent, uninstallApp, installApp, resetToDefaults]);

if (!isLoaded) {
return (
<div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-[9999]">
<div className="text-center text-white">
<div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
<p className="text-lg font-medium">Loading WebOS...</p>
<p className="text-sm opacity-75 mt-2">Initializing applications</p>
</div>
</div>
);
}

return (
<AppRegistryContext.Provider value={value}>
{children}
</AppRegistryContext.Provider>
);
};