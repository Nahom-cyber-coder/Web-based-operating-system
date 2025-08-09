import { useEffect } from 'react';
import { useOS } from '../settings/OSContext';
import { useWindows } from '../settings/WindowContext';
import { useAuth } from './useAuth';

export const useKeyboardShortcuts = () => {
const { setIsStartMenuOpen } = useOS();
const { windows, minimizeWindow } = useWindows();
const { lock } = useAuth();

useEffect(() => {
const handleKeyDown = (e: KeyboardEvent) => {
if (e.metaKey || e.key === 'Meta') {
if (e.key === 'Meta') {
e.preventDefault();
setIsStartMenuOpen(true);
}

if (e.key === 'd' || e.key === 'D') {
e.preventDefault();
windows.forEach(window => {
if (!window.isMinimized) {
minimizeWindow(window.id);
}
});
}

if (e.key === 'l' || e.key === 'L') {
e.preventDefault();
lock();
}
}

if (e.altKey && e.key === 'Tab') {
e.preventDefault();
}
};

window.addEventListener('keydown', handleKeyDown);

return () => {
window.removeEventListener('keydown', handleKeyDown);
};
}, [setIsStartMenuOpen, windows, minimizeWindow, lock]);
};