import React from 'react';
import { useState } from 'react';
import { useOS } from '../settings/OSContext';
import { Monitor, Keyboard, Mouse } from 'lucide-react';

const ImmersiveModeModal: React.FC = () => {
const { isImmersiveMode, toggleImmersiveMode } = useOS();
const [showModal, setShowModal] = useState(true);

if (isImmersiveMode || !showModal) return null;

return (
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
<div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
<div className="text-center mb-6">
<div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
<Monitor className="w-8 h-8 text-white" />
</div>
<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
Immersive Mode
</h2>
<p className="text-gray-600 dark:text-gray-400">
Enter full immersive mode for the complete desktop experience
</p>
</div>

<div className="space-y-4 mb-6">
<div className="flex items-center space-x-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
<Keyboard className="w-5 h-5 text-blue-500" />
<div>
<p className="font-medium text-gray-900 dark:text-white">Keyboard Lock</p>
<p className="text-sm text-gray-600 dark:text-gray-400">
System shortcuts will be captured
</p>
</div>
</div>

<div className="flex items-center space-x-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
<Mouse className="w-5 h-5 text-blue-500" />
<div>
<p className="font-medium text-gray-900 dark:text-white">Mouse Focus</p>
<p className="text-sm text-gray-600 dark:text-gray-400">
Cursor stays within the OS
</p>
</div>
</div>
</div>

<div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
<p className="text-sm text-yellow-800 dark:text-yellow-200">
<strong>Press Ctrl + Esc</strong> anytime to toggle immersive mode
</p>
</div>

<div className="flex space-x-3">
<button
onClick={() => {
toggleImmersiveMode();
setShowModal(false);
}}
className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
>
Enter Immersive Mode
</button>
<button
onClick={() => setShowModal(false)}
className="px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
>
Skip
</button>
</div>
</div>
</div>
);
};

export default ImmersiveModeModal;