import React, { useState, useEffect } from 'react';
import { Clock, Globe, Calendar, Save } from 'lucide-react';
import { useTime } from '../../../settings/TimeContext';

interface TimeSettings {
format24Hour: boolean;
timezone: string;
dateFormat: string;
}

const TimeSettings: React.FC = () => {
const { currentTime, setSystemTime, formatTime, formatDate } = useTime();
const [settings, setSettings] = useState<TimeSettings>({
format24Hour: false,
timezone: 'UTC+0',
dateFormat: 'MM/DD/YYYY',
});
const [manualTime, setManualTime] = useState('');
const [manualDate, setManualDate] = useState('');

const timezones = [
{ id: 'UTC-12', name: 'UTC-12:00 (Baker Island)' },
{ id: 'UTC-8', name: 'UTC-08:00 (Pacific Time)' },
{ id: 'UTC-5', name: 'UTC-05:00 (Eastern Time)' },
{ id: 'UTC+0', name: 'UTC+00:00 (Greenwich Mean Time)' },
{ id: 'UTC+1', name: 'UTC+01:00 (Central European Time)' },
{ id: 'UTC+3', name: 'UTC+03:00 (Moscow Time)' },
{ id: 'UTC+8', name: 'UTC+08:00 (China Standard Time)' },
{ id: 'UTC+9', name: 'UTC+09:00 (Japan Standard Time)' },
];

const dateFormats = [
{ id: 'MM/DD/YYYY', name: 'MM/DD/YYYY (US Format)' },
{ id: 'DD/MM/YYYY', name: 'DD/MM/YYYY (European Format)' },
{ id: 'YYYY/MM/DD', name: 'YYYY/MM/DD (ISO Format)' },
{ id: 'DD-MM-YYYY', name: 'DD-MM-YYYY (Dash Format)' },
];

useEffect(() => {
const savedSettings = localStorage.getItem('timeSettings');
if (savedSettings) {
setSettings(JSON.parse(savedSettings));
}
const now = currentTime;
setManualTime(now.toTimeString().slice(0, 5));
setManualDate(now.toISOString().slice(0, 10));
}, []);

useEffect(() => {
localStorage.setItem('timeSettings', JSON.stringify(settings));
}, [settings]);

const updateSystemTime = (time: Date) => {
setSystemTime(time);
localStorage.setItem('systemTime', time.toISOString());
};

const formatTimeLocal = (format24Hour: boolean = false) => {
if (format24Hour) {
return currentTime.toLocaleTimeString('en-GB', {
hour: '2-digit',
minute: '2-digit',
});
} else {
return currentTime.toLocaleTimeString('en-US', {
hour: '2-digit',
minute: '2-digit',
hour12: true,
});
}
};

const formatDateLocal = (format: string = 'MM/DD/YYYY') => {
const day = currentTime.getDate().toString().padStart(2, '0');
const month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
const year = currentTime.getFullYear();

switch (format) {
case 'MM/DD/YYYY':
return `${month}/${day}/${year}`;
case 'DD/MM/YYYY':
return `${day}/${month}/${year}`;
case 'YYYY/MM/DD':
return `${year}/${month}/${day}`;
case 'DD-MM-YYYY':
return `${day}-${month}-${year}`;
default:
return `${month}/${day}/${year}`;
}
};

const handleManualTimeChange = () => {
if (!manualTime || !manualDate) return;

try {
const [hours, minutes] = manualTime.split(':').map(Number);
const newDate = new Date(manualDate);
newDate.setHours(hours, minutes, 0, 0);

updateSystemTime(newDate);
alert('System time updated successfully!');
} catch (error) {
alert('Invalid time format. Please use HH:MM format.');
}
};

const syncWithSystemTime = () => {
const now = new Date();
updateSystemTime(now);
setManualTime(now.toTimeString().slice(0, 5));
setManualDate(now.toISOString().slice(0, 10));
alert('Time synchronized with system clock!');
};

return (
<div className="space-y-6">
<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
Time & Date Settings
</h3>

<div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 text-center">
<div className="flex items-center justify-center space-x-2 mb-2">
<Clock className="w-6 h-6 text-blue-500" />
<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
Current System Time
</span>
</div>
<div className="text-3xl font-mono font-bold text-gray-900 dark:text-white mb-1">
{formatTimeLocal(settings.format24Hour)}
</div>
<div className="text-lg text-gray-600 dark:text-gray-400">
{formatDateLocal(settings.dateFormat)}
</div>
<div className="text-sm text-gray-500 dark:text-gray-500 mt-2">
{settings.timezone} • {settings.format24Hour ? '24-hour' : '12-hour'} format
</div>
</div>

<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
<h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
<Calendar className="w-5 h-5 text-green-500" />
<span>Set Time Manually</span>
</h4>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
<div>
<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Date
</label>
<input
type="date"
value={manualDate}
onChange={(e) => setManualDate(e.target.value)}
className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
</div>

<div>
<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Time
</label>
<input
type="time"
value={manualTime}
onChange={(e) => setManualTime(e.target.value)}
className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
</div>
</div>

<div className="flex space-x-3">
<button
onClick={handleManualTimeChange}
className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
>
<Save className="w-4 h-4" />
<span>Apply Time</span>
</button>

<button
onClick={syncWithSystemTime}
className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
>
<Clock className="w-4 h-4" />
<span>Sync with System</span>
</button>
</div>
</div>

<div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
<div>
<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
24-Hour Format
</label>
<p className="text-xs text-gray-500 dark:text-gray-400">
Use 24-hour time format instead of 12-hour with AM/PM
</p>
</div>
<button
onClick={() =>
setSettings((prev) => ({ ...prev, format24Hour: !prev.format24Hour }))
}
className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
settings.format24Hour ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
}`}
>
<span
className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
settings.format24Hour ? 'translate-x-6' : 'translate-x-1'
}`}
/>
</button>
</div>

<div className="space-y-3">
<div className="flex items-center space-x-2">
<Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
Timezone
</label>
</div>
<select
value={settings.timezone}
onChange={(e) =>
setSettings((prev) => ({ ...prev, timezone: e.target.value }))
}
className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
>
{timezones.map((tz) => (
<option key={tz.id} value={tz.id}>
{tz.name}
</option>
))}
</select>
</div>

<div className="space-y-3">
<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
Date Format
</label>
<div className="space-y-2">
{dateFormats.map((format) => (
<button
key={format.id}
onClick={() =>
setSettings((prev) => ({ ...prev, dateFormat: format.id }))
}
className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
settings.dateFormat === format.id
? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
: 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
}`}
>
<span className="text-sm text-gray-900 dark:text-white">{format.name}</span>
<span className="text-sm text-gray-500 dark:text-gray-400">
{formatDateLocal(format.id)}
</span>
</button>
))}
</div>
</div>
</div>
);
};

export default TimeSettings;