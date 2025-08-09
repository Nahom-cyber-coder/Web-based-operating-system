import React from 'react';
import { useOS } from '../settings/OSContext';
import { useDialog } from '../settings/DialogContext';
import { useWindows } from '../settings/WindowContext';
import { useAppRegistry } from '../settings/AppRegistryContext';
import { Pin, PinOff, Play, Trash2, AlertTriangle } from 'lucide-react';

interface AppContextMenuProps {
app: any;
position: { x: number; y: number };
onClose: () => void;
onOpen: () => void;
}

const AppContextMenu: React.FC<AppContextMenuProps> = ({ app, position, onClose, onOpen }) => {
const { pinnedApps, setPinnedApps } = useOS();
const { uninstallApp } = useAppRegistry();
const { showConfirm, showAlert } = useDialog();
const { windows, closeWindow } = useWindows();

const isPinned = pinnedApps.some(pinnedApp => pinnedApp.id === app.id);

const handleUninstall = () => {
if (app.isSystemApp) {
showAlert('Cannot Uninstall', `${app.name} is a system application and cannot be uninstalled.`, 'error');
onClose();
return;
}

const performUninstall = async () => {
const runningWindows = windows.filter(w => 
w.appId === app.id || 
w.title.toLowerCase().includes(app.name.toLowerCase())
);

if (runningWindows.length > 0) {
const forceClose = await showConfirm(
'App Currently Running',
`${app.name} is currently running. Do you want to close it and continue with uninstallation?`
);

if (!forceClose) return;

runningWindows.forEach(window => closeWindow(window.id));
}

const confirmed = await showConfirm(
'Uninstall Application',
`Are you sure you want to uninstall ${app.name}? This will permanently remove the application and all its data.`
);

if (confirmed) {
try {
setPinnedApps(pinnedApps.filter(pinnedApp => pinnedApp.id !== app.id));

const success = await uninstallApp(app.id);

if (success) {
await showAlert('Uninstall Complete', `${app.name} has been uninstalled successfully.`, 'success');
} else {
await showAlert('Uninstall Failed', `Failed to uninstall ${app.name}. Please try again.`, 'error');
}
} catch (error) {
await showAlert('Uninstall Error', `An error occurred while uninstalling ${app.name}.`, 'error');
}
}
};

performUninstall();
onClose();
};

const handlePin = () => {
if (isPinned) {
setPinnedApps(pinnedApps.filter(pinnedApp => pinnedApp.id !== app.id));
} else {
setPinnedApps([...pinnedApps, {
id: app.id,
name: app.name,
icon: app.icon
}]);
}
onClose();
};

return (
<>
<div 
className="fixed inset-0 z-40"
onClick={onClose}
/>
<div
className="fixed bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl py-2 min-w-48 z-[9999]"
style={{
left: position.x,
top: position.y,
}}
>
<button
onClick={onOpen}
className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
<Play className="w-4 h-4 text-white/80" />
<span className="text-white text-sm">Open</span>
</button>

{!app.isSystemApp ? (
<button
onClick={handleUninstall}
className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
<Trash2 className="w-4 h-4 text-white/80" />
<span className="text-white text-sm">Uninstall</span>
</button>
) : (
<div
className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
<AlertTriangle className="w-4 h-4 text-yellow-500" />
<span className="text-white/60 text-sm">System app (protected)</span>
</div>
)}

<button
onClick={handlePin}
className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-white/10 transition-colors"
>
{isPinned ? (
<>
<PinOff className="w-4 h-4 text-white/80" />
<span className="text-white text-sm">Unpin from taskbar</span>
</>
) : (
<>
<Pin className="w-4 h-4 text-white/80" />
<span className="text-white text-sm">Pin to taskbar</span>
</>
)}
</button>
</div>
</>
);
};

export default AppContextMenu;