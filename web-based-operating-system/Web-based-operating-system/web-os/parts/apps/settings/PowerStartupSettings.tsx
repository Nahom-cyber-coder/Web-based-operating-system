import React, { useState, useEffect } from 'react';
import { RotateCcw, Moon, Play, Settings, Save } from 'lucide-react';

interface PowerSettings {
startupBehavior: 'restore' | 'default' | 'login';
autoSleepEnabled: boolean;
autoSleepDelay: number;
saveSessionOnExit: boolean;
}

const PowerStartupSettings: React.FC = () => {
const [settings, setSettings] = useState<PowerSettings>({
startupBehavior: 'restore',
autoSleepEnabled: true,
autoSleepDelay: 5,
saveSessionOnExit: true
});
const [isRestarting, setIsRestarting] = useState(false);
const [sleepCountdown, setSleepCountdown] = useState<number | null>(null);

const startupOptions = [
{
id: 'restore',
name: 'Restore Last Session',
description: 'Restore all open windows and applications from your last session',
icon: Save
},
{
id: 'default',
name: 'Load Default Apps',
description: 'Start with a clean desktop and default applications',
icon: Play
},
{
id: 'login',
name: 'Show Login Screen Only',
description: 'Start with just the login screen, no applications',
icon: Settings
}
];

useEffect(() => {
const savedSettings = localStorage.getItem('powerSettings');
if (savedSettings) {
setSettings(JSON.parse(savedSettings));
}
}, []);

useEffect(() => {
localStorage.setItem('powerSettings', JSON.stringify(settings));
}, [settings]);

useEffect(() => {
let sleepTimer: NodeJS.Timeout;
let countdownTimer: NodeJS.Timeout;

if (settings.autoSleepEnabled) {
const resetSleepTimer = () => {
clearTimeout(sleepTimer);
clearInterval(countdownTimer);
setSleepCountdown(null);

sleepTimer = setTimeout(() => {
let countdown = 30;
setSleepCountdown(countdown);

countdownTimer = setInterval(() => {
countdown--;
setSleepCountdown(countdown);

if (countdown <= 0) {
clearInterval(countdownTimer);
enterSleepMode();
}
}, 1000);
}, (settings.autoSleepDelay - 0.5) * 60 * 1000);
};

const handleActivity = () => {
resetSleepTimer();
};

document.addEventListener('mousedown', handleActivity);
document.addEventListener('keydown', handleActivity);
document.addEventListener('scroll', handleActivity);

resetSleepTimer();

return () => {
clearTimeout(sleepTimer);
clearInterval(countdownTimer);
document.removeEventListener('mousedown', handleActivity);
document.removeEventListener('keydown', handleActivity);
document.removeEventListener('scroll', handleActivity);
};
}
}, [settings.autoSleepEnabled, settings.autoSleepDelay]);

const enterSleepMode = () => {
const sleepOverlay = document.createElement('div');
sleepOverlay.className = 'fixed inset-0 bg-black z-[9999] flex items-center justify-center transition-opacity duration-1000';
sleepOverlay.innerHTML = `
<div class="text-center">
<div class="w-20 h-20 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border-2 border-gray-600 cursor-pointer" onclick="this.parentElement.parentElement.remove()">
<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a8.996 8.996 0 008.354-5.646z"></path>
</svg>
</div>
<p class="text-white mt-4">Click to wake up</p>
<p class="text-gray-400 text-sm mt-2">System went to sleep due to inactivity</p>
</div>
`;
document.body.appendChild(sleepOverlay);
setSleepCountdown(null);
};

const cancelSleep = () => {
setSleepCountdown(null);
};

const handleRestartOS = () => {
if (confirm('Are you sure you want to restart WebOS? All unsaved work will be lost.')) {
setIsRestarting(true);

if (settings.saveSessionOnExit) {
localStorage.setItem('lastSession', JSON.stringify({
timestamp: new Date().toISOString(),
}));
}

const restartOverlay = document.createElement('div');
restartOverlay.className = 'fixed inset-0 bg-blue-900 z-[9999] flex items-center justify-center transition-opacity duration-1000';
restartOverlay.innerHTML = `
<div class="text-center text-white">
<div class="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
<p class="text-xl">Restarting WebOS...</p>
<p class="text-sm opacity-75 mt-2">Please wait while the system restarts</p>
</div>
`;
document.body.appendChild(restartOverlay);

setTimeout(() => {
window.location.reload();
}, 3000);
}
};

const handleStartupBehaviorChange = (behavior: 'restore' | 'default' | 'login') => {
setSettings(prev => ({ ...prev, startupBehavior: behavior }));
};

const toggleAutoSleep = () => {
setSettings(prev => ({ ...prev, autoSleepEnabled: !prev.autoSleepEnabled }));
if (sleepCountdown) {
setSleepCountdown(null);
}
};

const handleSleepDelayChange = (delay: number) => {
setSettings(prev => ({ ...prev, autoSleepDelay: delay }));
};

const toggleSaveSession = () => {
setSettings(prev => ({ ...prev, saveSessionOnExit: !prev.saveSessionOnExit }));
};

return (
<div className="space-y-6">
<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Power & Startup Settings</h3>

{sleepCountdown !== null && (
<div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
<div className="flex items-center justify-between">
<div className="flex items-center space-x-2">
<Moon className="w-5 h-5 text-yellow-600" />
<div>
<p className="font-medium text-yellow-800 dark:text-yellow-200">
System will sleep in {sleepCountdown} seconds
</p>
<p className="text-sm text-yellow-600 dark:text-yellow-400">
Move your mouse or press any key to cancel
</p>
</div>
</div>
<button
onClick={cancelSleep}
className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm transition-colors"
>
Cancel
</button>
</div>
</div>
)}

<div className="space-y-4">
<h4 className="font-medium text-gray-900 dark:text-white">Startup Behavior</h4>
<div className="space-y-3">
{startupOptions.map((option) => (
<button
key={option.id}
onClick={() => handleStartupBehaviorChange(option.id as any)}
className={`w-full flex items-center space-x-3 p-4 rounded-lg border transition-colors text-left ${
settings.startupBehavior === option.id
? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
: 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
}`}
>
<option.icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
<div>
<p className="font-medium text-gray-900 dark:text-white">{option.name}</p>
<p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
</div>
{settings.startupBehavior === option.id && (
<span className="ml-auto text-xs text-blue-600 dark:text-blue-400">Selected</span>
)}
</button>
))}
</div>
</div>

<div className="space-y-4">
<div className="flex items-center justify-between">
<div>
<h4 className="font-medium text-gray-900 dark:text-white">Auto Sleep</h4>
<p className="text-sm text-gray-600 dark:text-gray-400">
Automatically sleep the system after a period of inactivity
</p>
</div>
<button
onClick={toggleAutoSleep}
className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
settings.autoSleepEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
}`}
>
<span
className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
settings.autoSleepEnabled ? 'translate-x-6' : 'translate-x-1'
}`}
/>
</button>
</div>

{settings.autoSleepEnabled && (
<div className="space-y-3">
<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
Sleep after: {settings.autoSleepDelay} minute{settings.autoSleepDelay !== 1 ? 's' : ''}
</label>
<input
type="range"
min="1"
max="60"
value={settings.autoSleepDelay}
onChange={(e) => handleSleepDelayChange(Number(e.target.value))}
className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
/>
<div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
<span>1 min</span>
<span>15 min</span>
<span>30 min</span>
<span>60 min</span>
</div>
</div>
)}
</div>

<div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
<div className="flex items-center space-x-3">
<Save className="w-5 h-5 text-green-500" />
<div>
<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
Save Session on Exit
</label>
<p className="text-xs text-gray-500 dark:text-gray-400">
Remember open windows and applications for next startup
</p>
</div>
</div>
<button
onClick={toggleSaveSession}
className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
settings.saveSessionOnExit ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
}`}
>
<span
className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
settings.saveSessionOnExit ? 'translate-x-6' : 'translate-x-1'
}`}
/>
</button>
</div>

<div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
<h4 className="font-medium text-gray-900 dark:text-white mb-4">System Actions</h4>
<div className="space-y-3">
<button
onClick={handleRestartOS}
disabled={isRestarting}
className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
>
<RotateCcw className={`w-4 h-4 ${isRestarting ? 'animate-spin' : ''}`} />
<span>{isRestarting ? 'Restarting...' : 'Restart OS'}</span>
</button>

<button
onClick={enterSleepMode}
className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
>
<Moon className="w-4 h-4" />
<span>Sleep Now</span>
</button>
</div>

<p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
Restart will reload the entire system. Sleep can be cancelled by any user activity.
</p>
</div>
</div>
);
};

export default PowerStartupSettings;