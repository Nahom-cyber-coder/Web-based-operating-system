import React, { createContext, useContext, useState, useCallback } from 'react';

interface DialogOptions {
title: string;
message: string;
type?: 'info' | 'warning' | 'error' | 'success' | 'confirm';
placeholder?: string;
defaultValue?: string;
confirmText?: string;
cancelText?: string;
}

interface DialogContextType {
showDialog: (options: DialogOptions) => Promise<string | boolean>;
showConfirm: (title: string, message: string) => Promise<boolean>;
showInput: (title: string, message: string, placeholder?: string, defaultValue?: string) => Promise<string | null>;
showAlert: (title: string, message: string, type?: 'info' | 'warning' | 'error' | 'success') => Promise<void>;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialog = () => {
const context = useContext(DialogContext);
if (!context) {
throw new Error('useDialog must be used within a DialogProvider');
}
return context;
};

interface DialogState {
visible: boolean;
title: string;
message: string;
type: 'info' | 'warning' | 'error' | 'success' | 'confirm';
placeholder?: string;
defaultValue?: string;
input: boolean;
confirmText: string;
cancelText: string;
resolve?: (value: string | boolean | null) => void;
}

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [dialogState, setDialogState] = useState<DialogState>({
visible: false,
title: '',
message: '',
type: 'info',
input: false,
confirmText: 'OK',
cancelText: 'Cancel'
});

const showDialog = useCallback((options: DialogOptions): Promise<string | boolean> => {
return new Promise((resolve) => {
setDialogState({
visible: true,
title: options.title,
message: options.message,
type: options.type || 'info',
placeholder: options.placeholder,
defaultValue: options.defaultValue || '',
input: !!options.placeholder,
confirmText: options.confirmText || 'OK',
cancelText: options.cancelText || 'Cancel',
resolve
});
});
}, []);

const showConfirm = useCallback((title: string, message: string): Promise<boolean> => {
return showDialog({
title,
message,
type: 'confirm',
confirmText: 'Yes',
cancelText: 'No'
}) as Promise<boolean>;
}, [showDialog]);

const showInput = useCallback((
title: string, 
message: string, 
placeholder?: string, 
defaultValue?: string
): Promise<string | null> => {
return showDialog({
title,
message,
placeholder: placeholder || 'Enter value...',
defaultValue,
confirmText: 'OK',
cancelText: 'Cancel'
}) as Promise<string | null>;
}, [showDialog]);

const showAlert = useCallback((
title: string, 
message: string, 
type: 'info' | 'warning' | 'error' | 'success' = 'info'
): Promise<void> => {
return showDialog({
title,
message,
type,
confirmText: 'OK',
cancelText: ''
}) as Promise<void>;
}, [showDialog]);

const handleConfirm = (input?: string) => {
if (dialogState.resolve) {
if (dialogState.input) {
dialogState.resolve(input || null);
} else {
dialogState.resolve(true);
}
}
setDialogState(prev => ({ ...prev, visible: false }));
};

const handleCancel = () => {
if (dialogState.resolve) {
if (dialogState.input) {
dialogState.resolve(null);
} else {
dialogState.resolve(false);
}
}
setDialogState(prev => ({ ...prev, visible: false }));
};

const value = {
showDialog,
showConfirm,
showInput,
showAlert
};

return (
<DialogContext.Provider value={value}>
{children}

{dialogState.visible && (
<div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
<div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 animate-in fade-in slide-in-from-top duration-200">
<div className="flex items-center space-x-3 p-6 pb-4">
<div className="flex-shrink-0">
{dialogState.type === 'warning' && (
<div className="w-6 h-6 text-yellow-500">⚠️</div>
)}
{dialogState.type === 'error' && (
<div className="w-6 h-6 text-red-500">❌</div>
)}
{dialogState.type === 'success' && (
<div className="w-6 h-6 text-green-500">✅</div>
)}
{(dialogState.type === 'info' || dialogState.type === 'confirm') && (
<div className="w-6 h-6 text-blue-500">ℹ️</div>
)}
</div>
<h2 className="text-lg font-semibold text-gray-900 dark:text-white">{dialogState.title}</h2>
</div>

<div className="px-6 pb-4">
<p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{dialogState.message}</p>

{dialogState.input && (
<input
type="text"
className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
placeholder={dialogState.placeholder}
defaultValue={dialogState.defaultValue}
autoFocus
onKeyDown={(e) => {
if (e.key === 'Enter') {
handleConfirm((e.target as HTMLInputElement).value);
}
}}
/>
)}
</div>

<div className="flex justify-end space-x-3 p-6 pt-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl">
{dialogState.cancelText && (
<button
onClick={handleCancel}
className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors"
>
{dialogState.cancelText}
</button>
)}
<button
onClick={() => {
if (dialogState.input) {
const input = document.querySelector('input') as HTMLInputElement;
handleConfirm(input?.value);
} else {
handleConfirm();
}
}}
className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
dialogState.type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700' :
dialogState.type === 'error' ? 'bg-red-600 hover:bg-red-700' :
dialogState.type === 'success' ? 'bg-green-600 hover:bg-green-700' :
'bg-blue-600 hover:bg-blue-700'
}`}
>
{dialogState.confirmText}
</button>
</div>
</div>
</div>
)}
</DialogContext.Provider>
);
};