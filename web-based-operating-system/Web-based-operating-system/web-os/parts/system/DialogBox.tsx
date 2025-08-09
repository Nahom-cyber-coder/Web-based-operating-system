import React, { useState, useEffect } from 'react';
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';

interface DialogProps {
visible: boolean;
title: string;
message: string;
type?: 'info' | 'warning' | 'error' | 'success' | 'confirm';
placeholder?: string;
defaultValue?: string;
onConfirm: (input?: string) => void;
onCancel: () => void;
input?: boolean;
confirmText?: string;
cancelText?: string;
}

const DialogBox: React.FC<DialogProps> = ({
visible,
title,
message,
type = 'info',
placeholder,
defaultValue = '',
onConfirm,
onCancel,
input = false,
confirmText = 'OK',
cancelText = 'Cancel'
}) => {
const [value, setValue] = useState(defaultValue);

useEffect(() => {
setValue(defaultValue);
}, [defaultValue, visible]);

useEffect(() => {
const handleKeyDown = (e: KeyboardEvent) => {
if (!visible) return;

if (e.key === 'Enter') {
e.preventDefault();
onConfirm(input ? value : undefined);
} else if (e.key === 'Escape') {
e.preventDefault();
onCancel();
}
};

document.addEventListener('keydown', handleKeyDown);
return () => document.removeEventListener('keydown', handleKeyDown);
}, [visible, value, input, onConfirm, onCancel]);

if (!visible) return null;

const getIcon = () => {
switch (type) {
case 'warning':
return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
case 'error':
return <X className="w-6 h-6 text-red-500" />;
case 'success':
return <CheckCircle className="w-6 h-6 text-green-500" />;
default:
return <Info className="w-6 h-6 text-blue-500" />;
}
};

const getButtonColor = () => {
switch (type) {
case 'warning':
return 'bg-yellow-600 hover:bg-yellow-700';
case 'error':
return 'bg-red-600 hover:bg-red-700';
case 'success':
return 'bg-green-600 hover:bg-green-700';
default:
return 'bg-blue-600 hover:bg-blue-700';
}
};

return (
<div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
<div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 animate-in fade-in slide-in-from-top duration-200">
<div className="flex items-center space-x-3 p-6 pb-4">
{getIcon()}
<h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
</div>

<div className="px-6 pb-4">
<p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{message}</p>

{input && (
<input
type="text"
className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
placeholder={placeholder}
value={value}
onChange={(e) => setValue(e.target.value)}
autoFocus
/>
)}
</div>

<div className="flex justify-end space-x-3 p-6 pt-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl">
<button
onClick={onCancel}
className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors"
>
{cancelText}
</button>
<button
onClick={() => onConfirm(input ? value : undefined)}
className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${getButtonColor()}`}
disabled={input && !value.trim()}
>
{confirmText}
</button>
</div>
</div>
</div>
);
};

export default DialogBox;