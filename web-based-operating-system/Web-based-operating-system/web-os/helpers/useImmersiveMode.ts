import { useEffect } from 'react';
import { useOS } from '../settings/OSContext';

export const useImmersiveMode = () => {
const { isImmersiveMode, toggleImmersiveMode } = useOS();

useEffect(() => {
const handleKeyDown = (e: KeyboardEvent) => {
if (e.ctrlKey && e.key === 'Escape') {
e.preventDefault();
toggleImmersiveMode();
return;
}

if (isImmersiveMode) {
const blockedKeys = [
'Meta',
'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
];

const blockedCombinations = [
{ ctrl: true, key: 'w' },
{ ctrl: true, key: 't' },
{ ctrl: true, key: 'n' },
{ ctrl: true, key: 'r' },
{ ctrl: true, shift: true, key: 'I' },
{ alt: true, key: 'Tab' },
{ alt: true, key: 'F4' },
];

if (blockedKeys.includes(e.key)) {
e.preventDefault();
e.stopPropagation();
return;
}

for (const combo of blockedCombinations) {
if (
(combo.ctrl === undefined || combo.ctrl === e.ctrlKey) &&
(combo.alt === undefined || combo.alt === e.altKey) &&
(combo.shift === undefined || combo.shift === e.shiftKey) &&
combo.key.toLowerCase() === e.key.toLowerCase()
) {
e.preventDefault();
e.stopPropagation();
return;
}
}
}
};

const handleContextMenu = (e: MouseEvent) => {
if (isImmersiveMode) {
const target = e.target as HTMLElement;
if (!target.closest('.os-container')) {
e.preventDefault();
}
}
};

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
if (isImmersiveMode) {
e.preventDefault();
e.returnValue = 'Are you sure you want to leave immersive mode?';
}
};

document.addEventListener('keydown', handleKeyDown, true);
document.addEventListener('contextmenu', handleContextMenu);
window.addEventListener('beforeunload', handleBeforeUnload);

return () => {
document.removeEventListener('keydown', handleKeyDown, true);
document.removeEventListener('contextmenu', handleContextMenu);
window.removeEventListener('beforeunload', handleBeforeUnload);
};
}, [isImmersiveMode, toggleImmersiveMode]);
};