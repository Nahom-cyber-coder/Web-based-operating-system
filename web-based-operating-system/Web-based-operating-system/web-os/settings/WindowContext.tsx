import React, { createContext, useContext, useState, useCallback } from 'react';

export interface WindowData {
id: string;
title: string;
appId: string;
position: { x: number; y: number };
size: { width: number; height: number };
isMinimized: boolean;
isMaximized: boolean;
isActive: boolean;
icon?: string;
props?: any;
}

interface WindowContextType {
windows: WindowData[];
openWindow: (config: {
title: string;
appId?: string;
position?: { x: number; y: number };
size?: { width: number; height: number };
icon?: string;
props?: any;
}) => void;
closeWindow: (id: string) => void;
closeAllWindowsFor: (appId: string) => void;
minimizeWindow: (id: string) => void;
maximizeWindow: (id: string) => void;
restoreWindow: (id: string) => void;
focusWindow: (id: string) => void;
updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
updateWindowSize: (id: string, size: { width: number; height: number }) => void;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export const useWindows = () => {
const context = useContext(WindowContext);
if (!context) {
throw new Error('useWindows must be used within a WindowProvider');
}
return context;
};

export const WindowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [windows, setWindows] = useState<WindowData[]>([]);

const openWindow = useCallback((config: {
title: string;
appId?: string;
position?: { x: number; y: number } | 'center';
size?: { width: number; height: number };
icon?: string;
props?: any;
}) => {
const id = `${config.appId || config.title.toLowerCase().replace(/\s+/g, '-')}-${crypto.randomUUID()}`;

let finalPosition = config.position;
if (config.position === 'center' || !config.position) {
const windowWidth = config.size?.width || 800;
const windowHeight = config.size?.height || 600;
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const taskbarHeight = 48;

finalPosition = {
x: Math.max(0, (screenWidth - windowWidth) / 2),
y: Math.max(0, (screenHeight - windowHeight - taskbarHeight) / 2)
};
}

const newWindow: WindowData = {
id,
title: config.title,
appId: config.appId || config.title.toLowerCase().replace(/\s+/g, '-'),
position: finalPosition,
size: config.size || { width: 800, height: 600 },
isMinimized: false,
isMaximized: false,
isActive: true,
icon: config.icon,
props: config.props
};

setWindows(prev => [
...prev.map(w => ({ ...w, isActive: false })),
newWindow
]);
}, []);

const closeWindow = useCallback((id: string) => {
setWindows(prev => prev.filter(w => w.id !== id));
}, []);

const closeAllWindowsFor = useCallback((appId: string) => {
setWindows(prev => prev.filter(w => w.appId !== appId));
}, []);

const minimizeWindow = useCallback((id: string) => {
setWindows(prev => prev.map(w => 
w.id === id ? { ...w, isMinimized: true, isActive: false } : w
));
}, []);

const maximizeWindow = useCallback((id: string) => {
setWindows(prev => prev.map(w => 
w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
));
}, []);

const restoreWindow = useCallback((id: string) => {
setWindows(prev => prev.map(w => 
w.id === id ? { ...w, isMinimized: false, isActive: true } : { ...w, isActive: false }
));
}, []);

const focusWindow = useCallback((id: string) => {
setWindows(prev => prev.map(w => 
w.id === id ? { ...w, isActive: true } : { ...w, isActive: false }
));
}, []);

const updateWindowPosition = useCallback((id: string, position: { x: number; y: number }) => {
setWindows(prev => prev.map(w => 
w.id === id ? { ...w, position } : w
));
}, []);

const updateWindowSize = useCallback((id: string, size: { width: number; height: number }) => {
setWindows(prev => prev.map(w => 
w.id === id ? { ...w, size } : w
));
}, []);

const value = {
windows,
openWindow,
closeWindow,
closeAllWindowsFor,
minimizeWindow,
maximizeWindow,
restoreWindow,
focusWindow,
updateWindowPosition,
updateWindowSize,
};

return (
<WindowContext.Provider value={value}>
{children}
</WindowContext.Provider>
);
};