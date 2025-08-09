import React, { useState } from 'react';
import { Power, RotateCcw, Moon, LogOut } from 'lucide-react';
import { useAuth } from '../helpers/useAuth';

interface PowerMenuProps {
isOpen: boolean;
onClose: () => void;
position: { x: number; y: number };
}

const PowerMenu: React.FC<PowerMenuProps> = ({ isOpen, onClose, position }) => {
const { logout } = useAuth();
const [isShuttingDown, setIsShuttingDown] = useState(false);
const [isRestarting, setIsRestarting] = useState(false);
const [isSleeping, setIsSleeping] = useState(false);

const handleShutdown = () => {
setIsShuttingDown(true);
onClose();

const shutdownOverlay = document.createElement('div');
shutdownOverlay.className = 'fixed inset-0 bg-black z-[9999] flex items-center justify-center transition-opacity duration-2000';
shutdownOverlay.innerHTML = `
<div class="text-center text-white">
<div class="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
<p class="text-xl">Shutting down...</p>
<p class="text-sm opacity-75 mt-2">Please wait</p>
</div>
`;
document.body.appendChild(shutdownOverlay);

setTimeout(() => {
shutdownOverlay.innerHTML = `
<div class="text-center text-white cursor-pointer" onclick="this.parentElement.remove(); document.querySelector('#screen-root').style.display = 'block';">
<div class="w-20 h-20 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border-2 border-gray-600">
<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
</svg>
</div>
<p class="text-lg mt-4">Click to wake up</p>
<p class="text-sm opacity-75 mt-2">System is in shutdown mode</p>
</div>
`;
document.querySelector('#screen-root')!.style.display = 'none';
setIsShuttingDown(false);
}, 3000);
};

const handleRestart = () => {
setIsRestarting(true);
onClose();

const restartOverlay = document.createElement('div');
restartOverlay.className = 'fixed inset-0 bg-blue-900 z-[9999] flex items-center justify-center transition-opacity duration-1000';
restartOverlay.innerHTML = `
<div class="text-center text-white">
<div class="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
<p class="text-xl">Restarting...</p>
<p class="text-sm opacity-75 mt-2">Please wait while the system restarts</p>
</div>
`;
document.body.appendChild(restartOverlay);

setTimeout(() => {
restartOverlay.innerHTML = `
<div class="text-center text-white">
<div class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
</svg>
</div>
<p class="text-xl">Starting WebOS...</p>
<p class="text-sm opacity-75 mt-2">Loading desktop environment</p>
</div>
`;

setTimeout(() => {
restartOverlay.remove();
setIsRestarting(false);
}, 2000);
}, 3000);
};

const handleSleep = () => {
setIsSleeping(true);
onClose();

const sleepOverlay = document.createElement('div');
sleepOverlay.className = 'fixed inset-0 bg-black bg-opacity-80 z-[9999] flex items-center justify-center transition-opacity duration-1000 cursor-pointer';
sleepOverlay.innerHTML = `
<div class="text-center text-white">
<div class="w-20 h-20 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border-2 border-gray-600">
<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a8.996 8.996 0 008.354-5.646z"></path>
</svg>
</div>
<p class="text-lg mt-4">Sleeping...</p>
<p class="text-sm opacity-75 mt-2">Click anywhere to wake up</p>
</div>
`;

sleepOverlay.onclick = () => {
sleepOverlay.remove();
setIsSleeping(false);
};

document.body.appendChild(sleepOverlay);
};

const handleLogout = () => {
onClose();
logout();
};

if (!isOpen) return null;

return (
<>
<div 
className="fixed inset-0 z-40"
onClick={onClose}
/>

<div
className="fixed bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl py-2 min-w-48 z-[9999] animate-in fade-in slide-in-from-bottom duration-200"
style={{
left: position.x,
top: position.y - 200,
}}
>
<button
onClick={handleSleep}
className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/10 transition-colors"
>
<Moon className="w-5 h-5 text-white/80" />
<span className="text-white text-sm">Sleep</span>
</button>

<button
onClick={handleLogout}
className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/10 transition-colors"
>
<LogOut className="w-5 h-5 text-white/80" />
<span className="text-white text-sm">Sign out</span>
</button>

<button
onClick={handleRestart}
className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/10 transition-colors"
>
<RotateCcw className="w-5 h-5 text-white/80" />
<span className="text-white text-sm">Restart</span>
</button>

<button
onClick={handleShutdown}
className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/10 transition-colors"
>
<Power className="w-5 h-5 text-white/80" />
<span className="text-white text-sm">Shut down</span>
</button>
</div>
</>
);
};

export default PowerMenu;