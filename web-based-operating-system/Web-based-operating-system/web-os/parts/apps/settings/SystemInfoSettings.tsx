import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, RefreshCw, Download, AlertTriangle, CheckCircle } from 'lucide-react';

const SystemInfoSettings: React.FC = () => {
const [ramUsage, setRamUsage] = useState(65);
const [cpuUsage, setCpuUsage] = useState(23);
const [storageUsage, setStorageUsage] = useState(45);
const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);
const [updateProgress, setUpdateProgress] = useState(0);
const [updateAvailable, setUpdateAvailable] = useState(false);

const systemInfo = {
osName: 'WebOS',
version: '1.0.0',
buildNumber: '2024.01.001',
lastUpdate: new Date('2024-01-15'),
totalRam: '8.0 GB',
availableRam: '2.8 GB',
totalStorage: '256 GB',
availableStorage: '141 GB',
processor: 'Web Runtime Engine',
architecture: 'x64',
uptime: '2h 34m'
};

useEffect(() => {
const interval = setInterval(() => {
setRamUsage(prev => Math.max(30, Math.min(90, prev + (Math.random() - 0.5) * 10)));
setCpuUsage(prev => Math.max(5, Math.min(80, prev + (Math.random() - 0.5) * 15)));
setStorageUsage(prev => Math.max(40, Math.min(60, prev + (Math.random() - 0.5) * 2)));
}, 3000);

return () => clearInterval(interval);
}, []);

const handleCheckUpdates = async () => {
setIsCheckingUpdates(true);
setUpdateProgress(0);

for (let i = 0; i <= 100; i += 10) {
await new Promise(resolve => setTimeout(resolve, 200));
setUpdateProgress(i);
}

setUpdateAvailable(Math.random() > 0.7);
setIsCheckingUpdates(false);
};

const handleResetOS = () => {
if (confirm('This will clear all user data and reset the OS to factory settings. This action cannot be undone. Continue?')) {
if (confirm('Are you absolutely sure? All your files, settings, and installed apps will be lost.')) {
localStorage.clear();

const resetOverlay = document.createElement('div');
resetOverlay.className = 'fixed inset-0 bg-black z-[9999] flex items-center justify-center transition-opacity duration-1000';
resetOverlay.innerHTML = `
<div class="text-center text-white">
<div class="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
<p class="text-xl">Resetting WebOS...</p>
<p class="text-sm opacity-75 mt-2">Please wait while we restore factory settings</p>
</div>
`;
document.body.appendChild(resetOverlay);

setTimeout(() => {
window.location.reload();
}, 3000);
}
}
};


const getUsageColor = (usage: number) => {
if (usage < 50) return 'bg-green-500';
if (usage < 80) return 'bg-yellow-500';
return 'bg-red-500';
};

return (
<div className="space-y-6">
<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Information</h3>

<div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
<div className="flex items-center space-x-4 mb-4">
<div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
<span className="text-2xl">🖥️</span>
</div>
<div>
<h4 className="text-2xl font-bold text-gray-900 dark:text-white">{systemInfo.osName}</h4>
<p className="text-gray-600 dark:text-gray-400">Version {systemInfo.version}</p>
</div>
</div>

<div className="grid grid-cols-2 gap-4 text-sm">
<div>
<span className="font-medium text-gray-700 dark:text-gray-300">Build Number:</span>
<span className="ml-2 text-gray-600 dark:text-gray-400">{systemInfo.buildNumber}</span>
</div>
<div>
<span className="font-medium text-gray-700 dark:text-gray-300">Last Update:</span>
<span className="ml-2 text-gray-600 dark:text-gray-400">
{systemInfo.lastUpdate.toLocaleDateString()}
</span>
</div>
<div>
<span className="font-medium text-gray-700 dark:text-gray-300">Architecture:</span>
<span className="ml-2 text-gray-600 dark:text-gray-400">{systemInfo.architecture}</span>
</div>
<div>
<span className="font-medium text-gray-700 dark:text-gray-300">Uptime:</span>
<span className="ml-2 text-gray-600 dark:text-gray-400">{systemInfo.uptime}</span>
</div>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
<div className="flex items-center space-x-2 mb-3">
<HardDrive className="w-5 h-5 text-blue-500" />
<h5 className="font-medium text-gray-900 dark:text-white">Memory (RAM)</h5>
</div>
<div className="space-y-2">
<div className="flex justify-between text-sm">
<span className="text-gray-600 dark:text-gray-400">Used</span>
<span className="font-medium text-gray-900 dark:text-white">{ramUsage.toFixed(0)}%</span>
</div>
<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
<div
className={`h-2 rounded-full transition-all duration-500 ${getUsageColor(ramUsage)}`}
style={{ width: `${ramUsage}%` }}
/>
</div>
<div className="text-xs text-gray-500 dark:text-gray-500">
{systemInfo.availableRam} available of {systemInfo.totalRam}
</div>
</div>
</div>

<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
<div className="flex items-center space-x-2 mb-3">
<Cpu className="w-5 h-5 text-green-500" />
<h5 className="font-medium text-gray-900 dark:text-white">Processor</h5>
</div>
<div className="space-y-2">
<div className="flex justify-between text-sm">
<span className="text-gray-600 dark:text-gray-400">Usage</span>
<span className="font-medium text-gray-900 dark:text-white">{cpuUsage.toFixed(0)}%</span>
</div>
<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
<div
className={`h-2 rounded-full transition-all duration-500 ${getUsageColor(cpuUsage)}`}
style={{ width: `${cpuUsage}%` }}
/>
</div>
<div className="text-xs text-gray-500 dark:text-gray-500">
{systemInfo.processor}
</div>
</div>
</div>

<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
<div className="flex items-center space-x-2 mb-3">
<HardDrive className="w-5 h-5 text-purple-500" />
<h5 className="font-medium text-gray-900 dark:text-white">Storage</h5>
</div>
<div className="space-y-2">
<div className="flex justify-between text-sm">
<span className="text-gray-600 dark:text-gray-400">Used</span>
<span className="font-medium text-gray-900 dark:text-white">{storageUsage.toFixed(0)}%</span>
</div>
<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
<div
className={`h-2 rounded-full transition-all duration-500 ${getUsageColor(storageUsage)}`}
style={{ width: `${storageUsage}%` }}
/>
</div>
<div className="text-xs text-gray-500 dark:text-gray-500">
{systemInfo.availableStorage} free of {systemInfo.totalStorage}
</div>
</div>
</div>
</div>

<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
<h5 className="font-medium text-gray-900 dark:text-white mb-4">System Updates</h5>

{isCheckingUpdates ? (
<div className="space-y-3">
<div className="flex items-center space-x-2">
<RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
<span className="text-sm text-gray-600 dark:text-gray-400">Checking for updates...</span>
</div>
<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
<div
className="h-2 bg-blue-500 rounded-full transition-all duration-300"
style={{ width: `${updateProgress}%` }}
/>
</div>
<div className="text-xs text-gray-500 dark:text-gray-500">{updateProgress}% complete</div>
</div>
) : updateAvailable ? (
<div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
<div className="flex items-center space-x-2">
<Download className="w-5 h-5 text-green-600" />
<div>
<p className="font-medium text-green-800 dark:text-green-200">Update Available</p>
<p className="text-sm text-green-600 dark:text-green-400">WebOS 1.1.0 is ready to install</p>
</div>
</div>
<button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm">
Install Now
</button>
</div>
) : (
<div className="flex items-center justify-between">
<div className="flex items-center space-x-2">
<CheckCircle className="w-5 h-5 text-green-500" />
<span className="text-sm text-gray-600 dark:text-gray-400">Your system is up to date</span>
</div>
<button
onClick={handleCheckUpdates}
className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
>
<RefreshCw className="w-4 h-4" />
<span>Check for Updates</span>
</button>
</div>
)}
</div>

<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
<div className="flex items-center space-x-2 mb-4">
<AlertTriangle className="w-5 h-5 text-red-500" />
<h5 className="font-medium text-red-800 dark:text-red-200">Danger Zone</h5>
</div>
<p className="text-sm text-red-700 dark:text-red-300 mb-4">
This action will permanently delete all user data, settings, and installed applications.
</p>
<button
onClick={handleResetOS}
className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
>
Reset OS to Factory Settings
</button>
</div>
</div>
);
};

export default SystemInfoSettings;