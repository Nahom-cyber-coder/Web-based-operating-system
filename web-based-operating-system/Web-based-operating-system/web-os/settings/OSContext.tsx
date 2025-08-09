import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTime } from './TimeContext';

interface OSContextType {
isStartMenuOpen: boolean;
setIsStartMenuOpen: (open: boolean) => void;
isNotificationCenterOpen: boolean;
setIsNotificationCenterOpen: (open: boolean) => void;
activeDesktop: number;
setActiveDesktop: (desktop: number) => void;
volume: number;
setVolume: (volume: number) => void;
wifiConnected: boolean;
setWifiConnected: (connected: boolean) => void;
batteryLevel: number;
setBatteryLevel: (level: number) => void;
searchQuery: string;
setSearchQuery: (query: string) => void;
pinnedApps: PinnedApp[];
setPinnedApps: (apps: PinnedApp[]) => void;
isImmersiveMode: boolean;
setIsImmersiveMode: (mode: boolean) => void;
toggleImmersiveMode: () => void;
closeAllWindowsFor: (appId: string) => void;
}

interface PinnedApp {
id: string;
name: string;
icon: string;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export const useOS = () => {
const context = useContext(OSContext);
if (!context) {
throw new Error('useOS must be used within an OSProvider');
}
return context;
};

export const OSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
const [activeDesktop, setActiveDesktop] = useState(0);
const [volume, setVolume] = useState(75);
const [wifiConnected, setWifiConnected] = useState(true);
const [batteryLevel, setBatteryLevel] = useState(85);
const [searchQuery, setSearchQuery] = useState('');
const [pinnedApps, setPinnedApps] = useState<PinnedApp[]>([]);
const [isImmersiveMode, setIsImmersiveMode] = useState(false);

const { currentTime } = useTime();

useEffect(() => {
const savedPinnedApps = localStorage.getItem('pinnedApps');
if (savedPinnedApps) {
setPinnedApps(JSON.parse(savedPinnedApps));
}

const savedImmersiveMode = localStorage.getItem('isImmersiveMode');
if (savedImmersiveMode === 'true') {
setIsImmersiveMode(true);
}
}, []);

useEffect(() => {
localStorage.setItem('pinnedApps', JSON.stringify(pinnedApps));
}, [pinnedApps]);

useEffect(() => {
localStorage.setItem('isImmersiveMode', isImmersiveMode.toString());
}, [isImmersiveMode]);

const toggleImmersiveMode = () => {
if (!isImmersiveMode) {
document.documentElement.requestFullscreen?.();
} else {
document.exitFullscreen?.();
}
setIsImmersiveMode(!isImmersiveMode);
};

const closeAllWindowsFor = (appId: string) => {
};

const value = {
currentTime,
isStartMenuOpen,
setIsStartMenuOpen,
isNotificationCenterOpen,
setIsNotificationCenterOpen,
activeDesktop,
setActiveDesktop,
volume,
setVolume,
wifiConnected,
setWifiConnected,
batteryLevel,
setBatteryLevel,
searchQuery,
setSearchQuery,
pinnedApps,
setPinnedApps,
isImmersiveMode,
setIsImmersiveMode,
toggleImmersiveMode,
closeAllWindowsFor,
};

return (
<OSContext.Provider value={value}>
{children}
</OSContext.Provider>
);
};