import React from 'react';
import { useState } from 'react';
import { useOS } from '../settings/OSContext';
import { useTime } from '../settings/TimeContext';
import { useWindows } from '../settings/WindowContext';
import { useAuth } from '../helpers/useAuth';
import { useNotifications } from '../settings/NotificationContext';
import TaskbarContextMenu from './TaskbarContextMenu';
import SearchBox from './SearchBox';
import { Volume2, Wifi, Battery, Bell } from 'lucide-react';

const Taskbar: React.FC = () => {
const { 
isStartMenuOpen, 
setIsStartMenuOpen, 
wifiConnected, 
isNotificationCenterOpen,
setIsNotificationCenterOpen,
pinnedApps
} = useOS();
const { currentTime } = useTime();
const { windows, focusWindow, restoreWindow, openWindow } = useWindows();
const { user } = useAuth();
const { unreadCount } = useNotifications();
const [showTaskbarContextMenu, setShowTaskbarContextMenu] = useState(false);
const [taskbarContextMenuPosition, setTaskbarContextMenuPosition] = useState({ x: 0, y: 0 });

const runningWindows = windows.filter(w => !w.isMinimized);

const handlePinnedAppClick = (app: any) => {
const runningWindow = windows.find(w => w.appId === app.id || w.title.includes(app.name));
if (runningWindow) {
if (runningWindow.isMinimized) {
restoreWindow(runningWindow.id);
} else {
focusWindow(runningWindow.id);
}
} else {
openWindow({
title: app.name,
appId: app.id,
position: 'center',
size: { width: 800, height: 600 },
icon: app.icon
});
}
};

const handleTaskbarRightClick = (e: React.MouseEvent) => {
e.preventDefault();
setTaskbarContextMenuPosition({ x: e.clientX, y: e.clientY });
setShowTaskbarContextMenu(true);
};

return (
<div 
className="taskbar fixed bottom-0 left-0 right-0 h-12 bg-gray-900/80 backdrop-blur-md border-t border-white/10 flex items-center px-2 z-50"
onContextMenu={handleTaskbarRightClick}
style={{ width: '100%', height: '3rem' }}
>
<button
onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
className={`p-2 rounded-md hover:bg-white/10 transition-colors ${
isStartMenuOpen ? 'bg-white/20' : ''
}`}
>
<img 
src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/217f8052124ba91a15ddd5b1c7c6e552a0c539cc_win-web.png" 
alt="Start" 
className="w-5 h-5" 
/>
</button>

<div className="ml-2">
<SearchBox />
</div>

<div className="flex items-center space-x-1 ml-2">
{pinnedApps.map((app) => {
const isRunning = windows.some(w => w.title.includes(app.name));
return (
<button
key={app.id}
onClick={() => handlePinnedAppClick(app)}
className={`p-2 rounded-md hover:bg-white/10 transition-colors relative ${
isRunning ? 'bg-white/20' : ''
}`}
title={app.name}
>
<span className="text-lg">{app.icon}</span>
{isRunning && (
<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
)}
</button>
);
})}
</div>
<div className="flex-1 flex items-center justify-center space-x-1">
{runningWindows.map((window) => (
<button
key={window.id}
onClick={() => {
if (window.isMinimized) {
restoreWindow(window.id);
} else {
focusWindow(window.id);
}
}}
className={`p-2 rounded-md hover:bg-white/10 transition-colors min-w-0 max-w-48 ${
window.isActive ? 'bg-white/20' : ''
}`}
>
<span className="text-white text-xs truncate">
{window.icon && <span className="mr-1">{window.icon}</span>}
{window.title}
</span>
</button>
))}
</div>

<div className="flex items-center space-x-2">
<button className="p-2 rounded-md hover:bg-white/10 transition-colors">
<Volume2 className="w-4 h-4 text-white" />
</button>

<button className="p-2 rounded-md hover:bg-white/10 transition-colors">
<Wifi className={`w-4 h-4 ${wifiConnected ? 'text-white' : 'text-gray-400'}`} />
</button>

<button className="p-2 rounded-md hover:bg-white/10 transition-colors">
<Battery className="w-4 h-4 text-white" />
</button>

<button
onClick={() => setIsNotificationCenterOpen(!isNotificationCenterOpen)}
className={`p-2 rounded-md hover:bg-white/10 transition-colors relative ${
isNotificationCenterOpen ? 'bg-white/20' : ''
}`}
>
<Bell className="w-4 h-4 text-white" />
{unreadCount > 0 && (
<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
{unreadCount}
</span>
)}
</button>

<button className="p-2 rounded-md hover:bg-white/10 transition-colors">
<div className="text-white text-xs text-center">
<div>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
<div>{currentTime.toLocaleDateString([], { month: 'numeric', day: 'numeric' })}</div>
</div>
</button>

<button className="p-1 rounded-md hover:bg-white/10 transition-colors">
<img
src={user?.avatar}
alt={user?.username}
className="w-6 h-6 rounded-full"
/>
</button>
</div>

{showTaskbarContextMenu && (
<TaskbarContextMenu
position={taskbarContextMenuPosition}
onClose={() => setShowTaskbarContextMenu(false)}
/>
)}
</div>
);
};

export default Taskbar;