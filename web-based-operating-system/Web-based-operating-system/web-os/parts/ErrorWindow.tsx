import React from 'react';
import { useWindows } from '../settings/WindowContext';

interface ErrorWindowProps {
appName: string;
windowId?: string;
}

const ErrorWindow: React.FC<ErrorWindowProps> = ({ appName, windowId }) => {
const { closeWindow } = useWindows();

return (
<div className="h-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center p-8">
<div className="text-center">
<div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
<span className="text-white text-2xl">⚠️</span>
</div>
<h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
App Not Found
</h2>
<p className="text-red-600 dark:text-red-400 mb-4">
The application "{appName}" is not installed or has been corrupted.
</p>
{windowId && (
<button
onClick={() => closeWindow(windowId)}
className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
>
Close Window
</button>
)}
</div>
</div>
);
};

export default ErrorWindow;