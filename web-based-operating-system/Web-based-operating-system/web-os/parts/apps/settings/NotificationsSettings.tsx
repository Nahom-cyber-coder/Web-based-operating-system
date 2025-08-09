import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../../settings/NotificationContext';
import { Bell, BellOff, Moon, Volume2, VolumeX, Trash2, Clock } from 'lucide-react';

interface NotificationSettings {
enabled: boolean;
soundEnabled: boolean;
doNotDisturb: boolean;
doNotDisturbUntil: Date | null;
}

const NotificationsSettings: React.FC = () => {
const { notifications, clearAll, markAllAsRead } = useNotifications();
const [settings, setSettings] = useState<NotificationSettings>({
enabled: true,
soundEnabled: true,
doNotDisturb: false,
doNotDisturbUntil: null
});
const [dndDuration, setDndDuration] = useState(30);

useEffect(() => {
const savedSettings = localStorage.getItem('notificationSettings');
if (savedSettings) {
const parsed = JSON.parse(savedSettings);
setSettings({
...parsed,
doNotDisturbUntil: parsed.doNotDisturbUntil ? new Date(parsed.doNotDisturbUntil) : null
});
}
}, []);

useEffect(() => {
localStorage.setItem('notificationSettings', JSON.stringify(settings));
}, [settings]);

useEffect(() => {
if (settings.doNotDisturb && settings.doNotDisturbUntil) {
const now = new Date();
if (now > settings.doNotDisturbUntil) {
setSettings(prev => ({
...prev,
doNotDisturb: false,
doNotDisturbUntil: null
}));
}
}
}, [settings.doNotDisturb, settings.doNotDisturbUntil]);

const toggleNotifications = () => {
setSettings(prev => ({ ...prev, enabled: !prev.enabled }));
};

const toggleSounds = () => {
setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
};

const toggleDoNotDisturb = () => {
if (!settings.doNotDisturb) {
const until = new Date();
until.setMinutes(until.getMinutes() + dndDuration);
setSettings(prev => ({
...prev,
doNotDisturb: true,
doNotDisturbUntil: until
}));
} else {
setSettings(prev => ({
...prev,
doNotDisturb: false,
doNotDisturbUntil: null
}));
}
};

const formatTime = (date: Date) => {
return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getTimeRemaining = () => {
if (!settings.doNotDisturbUntil) return '';
const now = new Date();
const diff = settings.doNotDisturbUntil.getTime() - now.getTime();
const minutes = Math.ceil(diff / (1000 * 60));
return minutes > 0 ? `${minutes} minutes remaining` : '';
};

return (
<div className="space-y-6">
<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Settings</h3>

<div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
<div className="flex items-center space-x-3">
{settings.enabled ? (
<Bell className="w-5 h-5 text-blue-500" />
) : (
<BellOff className="w-5 h-5 text-gray-400" />
)}
<div>
<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
Enable Notifications
</label>
<p className="text-xs text-gray-500 dark:text-gray-400">
Allow apps to show notifications
</p>
</div>
</div>
<button
onClick={toggleNotifications}
className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
settings.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
}`}
>
<span
className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
settings.enabled ? 'translate-x-6' : 'translate-x-1'
}`}
/>
</button>
</div>

<div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
<div className="flex items-center space-x-3">
{settings.soundEnabled ? (
<Volume2 className="w-5 h-5 text-green-500" />
) : (
<VolumeX className="w-5 h-5 text-gray-400" />
)}
<div>
<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
Notification Sounds
</label>
<p className="text-xs text-gray-500 dark:text-gray-400">
Play sound when notifications appear
</p>
</div>
</div>
<button
onClick={toggleSounds}
disabled={!settings.enabled}
className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
settings.soundEnabled && settings.enabled ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
}`}
>
<span
className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
settings.soundEnabled && settings.enabled ? 'translate-x-6' : 'translate-x-1'
}`}
/>
</button>
</div>

<div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
<div className="flex items-center justify-between mb-3">
<div className="flex items-center space-x-3">
<Moon className="w-5 h-5 text-purple-500" />
<div>
<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
Do Not Disturb
</label>
<p className="text-xs text-gray-500 dark:text-gray-400">
Temporarily disable all notifications
</p>
</div>
</div>
<button
onClick={toggleDoNotDisturb}
disabled={!settings.enabled}
className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
settings.doNotDisturb && settings.enabled ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
}`}
>
<span
className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
settings.doNotDisturb && settings.enabled ? 'translate-x-6' : 'translate-x-1'
}`}
/>
</button>
</div>

{settings.doNotDisturb && settings.doNotDisturbUntil && (
<div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
<div className="flex items-center space-x-2 text-sm">
<Clock className="w-4 h-4 text-purple-600" />
<span className="text-purple-800 dark:text-purple-200">
Active until {formatTime(settings.doNotDisturbUntil)} ({getTimeRemaining()})
</span>
</div>
</div>
)}

{!settings.doNotDisturb && (
<div className="mt-3">
<label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
Duration (minutes)
</label>
<select
value={dndDuration}
onChange={(e) => setDndDuration(Number(e.target.value))}
className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
>
<option value={5}>5 minutes</option>
<option value={15}>15 minutes</option>
<option value={30}>30 minutes</option>
<option value={60}>1 hour</option>
<option value={120}>2 hours</option>
<option value={480}>8 hours</option>
</select>
</div>
)}
</div>

<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
<div className="p-4 border-b border-gray-200 dark:border-gray-700">
<div className="flex items-center justify-between">
<h5 className="font-medium text-gray-900 dark:text-white">Recent Notifications</h5>
<div className="flex space-x-2">
<button
onClick={markAllAsRead}
className="text-blue-600 hover:text-blue-700 text-sm"
>
Mark All Read
</button>
<button
onClick={clearAll}
className="text-red-600 hover:text-red-700 text-sm"
>
Clear All
</button>
</div>
</div>
<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
{notifications.length} notification{notifications.length !== 1 ? 's' : ''}
</p>
</div>

<div className="max-h-64 overflow-y-auto">
{notifications.length === 0 ? (
<div className="p-8 text-center">
<Bell className="w-12 h-12 text-gray-400 mx-auto mb-2" />
<p className="text-gray-500 dark:text-gray-400">No notifications</p>
</div>
) : (
<div className="divide-y divide-gray-200 dark:divide-gray-700">
{notifications.slice(0, 10).map((notification) => (
<div
key={notification.id}
className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
!notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''
}`}
>
<div className="flex items-start space-x-3">
{notification.appIcon && (
<span className="text-lg flex-shrink-0">{notification.appIcon}</span>
)}
<div className="flex-1 min-w-0">
<div className="flex items-center space-x-2">
<p className="font-medium text-gray-900 dark:text-white text-sm">
{notification.title}
</p>
{!notification.isRead && (
<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
)}
</div>
<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
{notification.message}
</p>
<p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
{notification.timestamp.toLocaleString()}
</p>
</div>
</div>
</div>
))}
</div>
)}
</div>
</div>
</div>
);
};

export default NotificationsSettings;