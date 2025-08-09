import React, { useState } from 'react';
import { useTheme } from '../../settings/ThemeContext';
import { Monitor, Palette, User, Volume2, Bell, Globe, Info, Settings, Sun, Moon, LampDesk as Desktop, Camera } from 'lucide-react';
import ProfileSettings from './ProfileSettings';
import SoundSettings from './settings/SoundSettings';
import TimeSettings from './settings/TimeSettings';
import UserAccountSettings from './settings/UserAccountSettings';
import AppSettings from './settings/AppSettings';
import SystemInfoSettings from './settings/SystemInfoSettings';
import NotificationsSettings from './settings/NotificationsSettings';
import KeyboardInputSettings from './settings/KeyboardInputSettings';
import PowerStartupSettings from './settings/PowerStartupSettings';

const SystemSettings: React.FC = () => {
const [activeSection, setActiveSection] = useState('display');
const { theme, toggleTheme, accentColor, setAccentColor, wallpaper, setWallpaper } = useTheme();

const [resolution, setResolution] = useState('1920x1080');
const [scaling, setScaling] = useState(100);
const [brightness, setBrightness] = useState(80);

const resolutions = [
'1024x768',
'1280x720', 
'1366x768',
'1920x1080',
'2560x1440',
'3840x2160'
];

const wallpapers = [
'/667167.jpg',
'/897207.jpg',
'/327601.jpg',
'/509430.jpg',
'/134658.jpeg'
];

const [customWallpapers, setCustomWallpapers] = useState<string[]>(() => {
const saved = localStorage.getItem('customWallpapers');
return saved ? JSON.parse(saved) : [];
});

const allWallpapers = [...wallpapers, ...customWallpapers];

const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
const file = e.target.files?.[0];
if (file) {
const reader = new FileReader();
reader.onload = (event) => {
const dataUrl = event.target?.result as string;
const newCustomWallpapers = [...customWallpapers, dataUrl];
setCustomWallpapers(newCustomWallpapers);
localStorage.setItem('customWallpapers', JSON.stringify(newCustomWallpapers));
};
reader.readAsDataURL(file);
}
};

const applyWallpaper = (wp: string) => {
const desktop = document.querySelector('.os-container') as HTMLElement;
if (desktop) {
desktop.style.transition = 'background-image 0.5s ease-in-out';
}
setWallpaper(wp);
};

const accentColors = [
'#3b82f6',
'#ef4444',
'#10b981',
'#f59e0b',
'#8b5cf6',
'#ec4899',
'#06b6d4',
'#84cc16'
];

const applyDisplaySettings = () => {
const desktop = document.getElementById('screen-root');
if (desktop) {
const [width] = resolution.split('x').map(Number);
const baseResolution = 1920;
const resolutionScale = width / baseResolution;
const finalScale = (scaling / 100) * resolutionScale;

desktop.style.transform = `scale(${finalScale})`;
desktop.style.transformOrigin = 'top left';
desktop.style.width = '100vw';
desktop.style.height = '100vh';
desktop.style.overflow = 'hidden';
desktop.style.filter = `brightness(${brightness}%)`;
}
};

const settingsSections = [
{ id: 'display', name: 'Display', icon: Monitor },
{ id: 'personalization', name: 'Personalization', icon: Palette },
{ id: 'sound', name: 'Sound', icon: Volume2 },
{ id: 'time', name: 'Time & Date', icon: Globe },
{ id: 'accounts', name: 'Accounts', icon: User },
{ id: 'apps', name: 'Apps', icon: Settings },
{ id: 'notifications', name: 'Notifications', icon: Bell },
{ id: 'keyboard', name: 'Keyboard & Input', icon: Settings },
{ id: 'power', name: 'Power & Startup', icon: Settings },
{ id: 'about', name: 'About', icon: Info },
];

const renderDisplaySettings = () => (
<div className="space-y-6">
<div>
<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Display Settings</h3>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-2">
<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
Resolution
</label>
<select
value={resolution}
onChange={(e) => setResolution(e.target.value)}
className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
>
{resolutions.map((res) => (
<option key={res} value={res}>
{res} {res === '1920x1080' && '(Recommended)'}
</option>
))}
</select>
</div>

<div className="space-y-2">
<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
Scale: {scaling}%
</label>
<input
type="range"
min={50}
max={200}
step={25}
value={scaling}
onChange={(e) => setScaling(Number(e.target.value))}
className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
/>
<div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
<span>50%</span>
<span>100%</span>
<span>200%</span>
</div>
</div>

<div className="space-y-2">
<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
Brightness: {brightness}%
</label>
<input
type="range"
min={20}
max={100}
value={brightness}
onChange={(e) => setBrightness(Number(e.target.value))}
className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
/>
</div>
</div>

<button
onClick={applyDisplaySettings}
className="mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
>
Apply Display Settings
</button>
</div>
</div>
);

const renderPersonalizationSettings = () => (
<div className="space-y-6">
<div>
<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personalization</h3>

<div className="mb-6">
<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
Theme
</label>
<div className="flex space-x-4">
<button
onClick={() => theme !== 'light' && toggleTheme()}
className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-colors ${
theme === 'light'
? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
: 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
}`}
>
<Sun className="w-5 h-5" />
<span>Light</span>
</button>
<button
onClick={() => theme !== 'dark' && toggleTheme()}
className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-colors ${
theme === 'dark'
? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
: 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
}`}
>
<Moon className="w-5 h-5" />
<span>Dark</span>
</button>
</div>
</div>

<div className="mb-6">
<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
Accent Color
</label>
<div className="grid grid-cols-8 gap-2">
{accentColors.map((color) => (
<button
key={color}
onClick={() => setAccentColor(color)}
className={`w-8 h-8 rounded-full border-2 transition-all ${
accentColor === color
? 'border-gray-800 dark:border-white scale-110'
: 'border-gray-300 dark:border-gray-600 hover:scale-105'
}`}
style={{ backgroundColor: color }}
/>
))}
</div>
</div>

<div>
<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
Wallpaper
</label>
<div className="mb-4">
<label className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer transition-colors">
<Camera className="w-4 h-4" />
<span>Upload Custom Wallpaper</span>
<input
type="file"
accept="image/*"
onChange={handleWallpaperUpload}
className="hidden"
/>
</label>
</div>
<div className="grid grid-cols-3 gap-4">
{allWallpapers.map((wp, index) => (
<button
key={index}
onClick={() => applyWallpaper(wp)}
className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
wallpaper === wp
? 'border-blue-500 scale-105'
: 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
}`}
>
<img
src={wp}
alt={`Wallpaper ${index + 1}`}
className="w-full h-full object-cover"
/>
{wallpaper === wp && (
<div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
<div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
<span className="text-white text-xs">✓</span>
</div>
</div>
)}
</button>
))}
</div>
</div>
</div>
</div>
);

const renderSystemInfo = () => (
<div className="space-y-6">
<div>
<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Information</h3>

<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
<div className="flex items-center space-x-4">
<Desktop className="w-12 h-12 text-blue-500" />
<div>
<h4 className="text-xl font-semibold text-gray-900 dark:text-white">WebOS</h4>
<p className="text-gray-600 dark:text-gray-400">Version 1.0.0</p>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
<div>
<h5 className="font-medium text-gray-900 dark:text-white">System</h5>
<p className="text-sm text-gray-600 dark:text-gray-400">Web-based Operating System</p>
</div>
<div>
<h5 className="font-medium text-gray-900 dark:text-white">Browser</h5>
<p className="text-sm text-gray-600 dark:text-gray-400">{navigator.userAgent.split(' ')[0]}</p>
</div>
<div>
<h5 className="font-medium text-gray-900 dark:text-white">Platform</h5>
<p className="text-sm text-gray-600 dark:text-gray-400">{navigator.platform}</p>
</div>
<div>
<h5 className="font-medium text-gray-900 dark:text-white">Language</h5>
<p className="text-sm text-gray-600 dark:text-gray-400">{navigator.language}</p>
</div>
</div>
</div>
</div>
</div>
);

const renderContent = () => {
switch (activeSection) {
case 'display':
return renderDisplaySettings();
case 'personalization':
return renderPersonalizationSettings();
case 'accounts':
return <ProfileSettings />;
case 'sound':
return <SoundSettings />;
case 'time':
return <TimeSettings />;
case 'apps':
return <AppSettings />;
case 'notifications':
return <NotificationsSettings />;
case 'keyboard':
return <KeyboardInputSettings />;
case 'power':
return <PowerStartupSettings />;
case 'about':
return renderSystemInfo();
default:
return (
<div className="flex items-center justify-center h-64">
<div className="text-center">
<Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
{settingsSections.find(s => s.id === activeSection)?.name}
</h3>
<p className="text-gray-600 dark:text-gray-400">
This section is coming soon.
</p>
</div>
</div>
);
}
};

return (
<div className="h-full bg-white dark:bg-gray-900 flex">
<div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
<div className="p-4">
<h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Settings</h2>
<nav className="space-y-1">
{settingsSections.map((section) => (
<button
key={section.id}
onClick={() => setActiveSection(section.id)}
className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
activeSection === section.id
? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
}`}
>
<section.icon className="w-5 h-5" />
<span className="text-sm font-medium">{section.name}</span>
</button>
))}
</nav>
</div>
</div>

<div className="flex-1 overflow-y-auto">
<div className="p-6">
{renderContent()}
</div>
</div>
</div>
);
};

export default SystemSettings;