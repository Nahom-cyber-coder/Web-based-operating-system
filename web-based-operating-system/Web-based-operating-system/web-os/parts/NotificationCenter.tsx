import React from 'react';
import { useOS } from '../settings/OSContext';
import { useNotifications } from '../settings/NotificationContext';
import { useTheme } from '../settings/ThemeContext';
import { X, Check, Sun, Moon, Wifi, WifiOff, Volume2, VolumeX } from 'lucide-react';

const NotificationCenter: React.FC = () => {
const { isNotificationCenterOpen, setIsNotificationCenterOpen, volume, setVolume, wifiConnected, setWifiConnected } = useOS();
const { notifications, removeNotification, markAsRead, markAllAsRead, clearAll } = useNotifications();
const { theme, toggleTheme } = useTheme();

if (!isNotificationCenterOpen) return null;

const formatTime = (date: Date) => {
return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (date: Date) => {
const now = new Date();
const isToday = date.toDateString() === now.toDateString();
const isYesterday = date.toDateString() === new Date(now.getTime() - 86400000).toDateString();

if (isToday) return 'Today';
if (isYesterday) return 'Yesterday';
return date.toLocaleDateString();
};

return (
<>
<div 
className="fixed inset-0 z-[9997]"
onClick={() => setIsNotificationCenterOpen(false)}
/>

<div className="fixed right-0 top-0 bottom-12 w-80 bg-gray-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-[9999]">
<div className="p-4 h-full flex flex-col">
<div className="flex items-center justify-between mb-4">
<h2 className="text-white text-lg font-semibold">Notifications</h2>
<button
onClick={() => setIsNotificationCenterOpen(false)}
className="p-1 rounded-lg hover:bg-white/10 transition-colors"
>
<X className="w-5 h-5 text-white/80" />
</button>
</div>

<div className="grid grid-cols-2 gap-2 mb-4">
<button
onClick={toggleTheme}
className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors flex items-center space-x-2"
>
{theme === 'dark' ? (
<Sun className="w-5 h-5 text-yellow-400" />
) : (
<Moon className="w-5 h-5 text-blue-400" />
)}
<span className="text-white text-sm">
{theme === 'dark' ? 'Light' : 'Dark'}
</span>
</button>

<button
onClick={() => setWifiConnected(!wifiConnected)}
className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors flex items-center space-x-2"
>
{wifiConnected ? (
<Wifi className="w-5 h-5 text-green-400" />
) : (
<WifiOff className="w-5 h-5 text-red-400" />
)}
<span className="text-white text-sm">
{wifiConnected ? 'WiFi' : 'Offline'}
</span>
</button>
</div>

<div className="mb-4 p-3 rounded-lg bg-gray-800/50">
<div className="flex items-center space-x-2 mb-2">
{volume === 0 ? (
<VolumeX className="w-5 h-5 text-white/80" />
) : (
<Volume2 className="w-5 h-5 text-white/80" />
)}
<span className="text-white text-sm">Volume</span>
</div>
<input
type="range"
min="0"
max="100"
value={volume}
onChange={(e) => setVolume(Number(e.target.value))}
className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
/>
</div>

<div className="flex-1 overflow-y-auto">
{notifications.length === 0 ? (
<div className="text-center py-8">
<p className="text-white/60">No notifications</p>
</div>
) : (
<>
<div className="flex items-center justify-between mb-2">
<span className="text-white/60 text-sm">
{notifications.length} notification{notifications.length !== 1 ? 's' : ''}
</span>
<div className="flex space-x-2">
<button
onClick={markAllAsRead}
className="text-blue-400 hover:text-blue-300 text-sm"
>
Mark all read
</button>
<button
onClick={clearAll}
className="text-red-400 hover:text-red-300 text-sm"
>
Clear all
</button>
</div>
</div>

<div className="space-y-2">
{notifications.map((notification) => (
<div
key={notification.id}
className={`p-3 rounded-lg bg-gray-800/50 border-l-4 ${
notification.type === 'error' ? 'border-red-500' :
notification.type === 'warning' ? 'border-yellow-500' :
notification.type === 'success' ? 'border-green-500' :
'border-blue-500'
} ${notification.isRead ? 'opacity-60' : ''}`}
>
<div className="flex items-start justify-between">
<div className="flex-1">
<div className="flex items-center space-x-2 mb-1">
{notification.appIcon && (
<span className="text-sm">{notification.appIcon}</span>
)}
<span className="text-white text-sm font-medium">
{notification.title}
</span>
</div>
<p className="text-white/80 text-sm mb-1">
{notification.message}
</p>
<div className="flex items-center justify-between">
<span className="text-white/40 text-xs">
{formatDate(notification.timestamp)} at {formatTime(notification.timestamp)}
</span>
<div className="flex space-x-1">
{!notification.isRead && (
<button
onClick={() => markAsRead(notification.id)}
className="text-blue-400 hover:text-blue-300"
>
<Check className="w-3 h-3" />
</button>
)}
<button
onClick={() => removeNotification(notification.id)}
className="text-red-400 hover:text-red-300"
>
<X className="w-3 h-3" />
</button>
</div>
</div>
</div>
</div>
</div>
))}
</div>
</>
)}
</div>
</div>
</div>
</>
);
};

export default NotificationCenter;