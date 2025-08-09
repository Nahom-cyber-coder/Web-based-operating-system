import React from 'react';
import { useWindows } from '../../settings/WindowContext';
import { useTime } from '../../settings/TimeContext';
import { X, Activity, Cpu, MemoryStick } from 'lucide-react';

const TaskManager: React.FC = () => {
const { windows, closeWindow } = useWindows();
const { currentTime } = useTime();

const formatMemoryUsage = (windowId: string) => {
const baseMemory = 50 + Math.random() * 100;
return `${baseMemory.toFixed(1)} MB`;
};

const formatCpuUsage = () => {
return `${(Math.random() * 15).toFixed(1)}%`;
};

const getProcessStatus = (window: any) => {
if (window.isMinimized) return 'Suspended';
if (window.isActive) return 'Running';
return 'Background';
};

return (
<div className="h-full bg-white dark:bg-gray-900 flex flex-col">
<div className="border-b border-gray-200 dark:border-gray-700 p-4">
<div className="flex items-center justify-between">
<h2 className="text-xl font-semibold text-gray-900 dark:text-white">Task Manager</h2>
<div className="text-sm text-gray-500 dark:text-gray-400">
{currentTime.toLocaleTimeString()}
</div>
</div>
<div className="mt-2 flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
<div className="flex items-center space-x-2">
<Activity className="w-4 h-4" />
<span>Processes: {windows.length}</span>
</div>
<div className="flex items-center space-x-2">
<Cpu className="w-4 h-4" />
<span>CPU: {formatCpuUsage()}</span>
</div>
<div className="flex items-center space-x-2">
<MemoryStick className="w-4 h-4" />
<span>Memory: 2.1 GB / 8.0 GB</span>
</div>
</div>
</div>

<div className="flex-1 overflow-auto">
<table className="w-full">
<thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
<tr>
<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
Name
</th>
<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
Status
</th>
<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
CPU
</th>
<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
Memory
</th>
<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
Actions
</th>
</tr>
</thead>
<tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
{windows.map((window) => (
<tr key={window.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
<td className="px-4 py-4 whitespace-nowrap">
<div className="flex items-center">
{window.icon && <span className="mr-2 text-lg">{window.icon}</span>}
<div>
<div className="text-sm font-medium text-gray-900 dark:text-white">
{window.title}
</div>
<div className="text-sm text-gray-500 dark:text-gray-400">
PID: {window.id.slice(-8)}
</div>
</div>
</div>
</td>
<td className="px-4 py-4 whitespace-nowrap">
<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
getProcessStatus(window) === 'Running' 
? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
: getProcessStatus(window) === 'Suspended'
? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}`}>
{getProcessStatus(window)}
</span>
</td>
<td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
{formatCpuUsage()}
</td>
<td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
{formatMemoryUsage(window.id)}
</td>
<td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
<button
onClick={() => closeWindow(window.id)}
className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center space-x-1"
>
<X className="w-4 h-4" />
<span>End Task</span>
</button>
</td>
</tr>
))}
</tbody>
</table>

{windows.length === 0 && (
<div className="text-center py-8 text-gray-500 dark:text-gray-400">
No running processes
</div>
)}
</div>

<div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
<div className="grid grid-cols-3 gap-4 text-sm">
<div>
<span className="font-medium text-gray-900 dark:text-white">System Uptime:</span>
<span className="ml-2 text-gray-600 dark:text-gray-400">2h 34m</span>
</div>
<div>
<span className="font-medium text-gray-900 dark:text-white">Total Processes:</span>
<span className="ml-2 text-gray-600 dark:text-gray-400">{windows.length + 12}</span>
</div>
<div>
<span className="font-medium text-gray-900 dark:text-white">Available Memory:</span>
<span className="ml-2 text-gray-600 dark:text-gray-400">5.9 GB</span>
</div>
</div>
</div>
</div>
);
};

export default TaskManager;