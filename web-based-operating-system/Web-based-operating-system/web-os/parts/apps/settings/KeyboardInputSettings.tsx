import React, { useState, useEffect } from 'react';
import { Keyboard, Globe, Clock, Eye, EyeOff } from 'lucide-react';

interface KeyboardSettings {
showVirtualKeyboard: boolean;
keyRepeatDelay: number;
inputLanguage: string;
keyboardLayout: string;
}

const KeyboardInputSettings: React.FC = () => {
const [settings, setSettings] = useState<KeyboardSettings>({
showVirtualKeyboard: false,
keyRepeatDelay: 500,
inputLanguage: 'en-US',
keyboardLayout: 'QWERTY'
});

const languages = [
{ code: 'en-US', name: 'English (United States)', flag: '🇺🇸' },
{ code: 'en-GB', name: 'English (United Kingdom)', flag: '🇬🇧' },
{ code: 'fr-FR', name: 'Français (France)', flag: '🇫🇷' },
{ code: 'de-DE', name: 'Deutsch (Deutschland)', flag: '🇩🇪' },
{ code: 'es-ES', name: 'Español (España)', flag: '🇪🇸' },
{ code: 'it-IT', name: 'Italiano (Italia)', flag: '🇮🇹' },
{ code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
{ code: 'ru-RU', name: 'Русский (Россия)', flag: '🇷🇺' },
{ code: 'ja-JP', name: '日本語 (日本)', flag: '🇯🇵' },
{ code: 'ko-KR', name: '한국어 (대한민국)', flag: '🇰🇷' },
{ code: 'zh-CN', name: '中文 (中国)', flag: '🇨🇳' },
{ code: 'ar-SA', name: 'العربية (السعودية)', flag: '🇸🇦' },
{ code: 'am-ET', name: 'አማርኛ (ኢትዮጵያ)', flag: '🇪🇹' }
];

const keyboardLayouts = [
{ id: 'QWERTY', name: 'QWERTY (Standard)' },
{ id: 'DVORAK', name: 'Dvorak' },
{ id: 'COLEMAK', name: 'Colemak' },
{ id: 'AZERTY', name: 'AZERTY (French)' },
{ id: 'QWERTZ', name: 'QWERTZ (German)' }
];

useEffect(() => {
const savedSettings = localStorage.getItem('keyboardSettings');
if (savedSettings) {
setSettings(JSON.parse(savedSettings));
}
}, []);

useEffect(() => {
localStorage.setItem('keyboardSettings', JSON.stringify(settings));
}, [settings]);

const toggleVirtualKeyboard = () => {
setSettings(prev => ({ ...prev, showVirtualKeyboard: !prev.showVirtualKeyboard }));
};

const handleRepeatDelayChange = (delay: number) => {
setSettings(prev => ({ ...prev, keyRepeatDelay: delay }));
};

const handleLanguageChange = (language: string) => {
setSettings(prev => ({ ...prev, inputLanguage: language }));
};

const handleLayoutChange = (layout: string) => {
setSettings(prev => ({ ...prev, keyboardLayout: layout }));
};

const getSelectedLanguage = () => {
return languages.find(lang => lang.code === settings.inputLanguage) || languages[0];
};

const getSelectedLayout = () => {
return keyboardLayouts.find(layout => layout.id === settings.keyboardLayout) || keyboardLayouts[0];
};

return (
<div className="space-y-6">
<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Keyboard & Input Settings</h3>

<div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
<div className="flex items-center space-x-3">
{settings.showVirtualKeyboard ? (
<Eye className="w-5 h-5 text-blue-500" />
) : (
<EyeOff className="w-5 h-5 text-gray-400" />
)}
<div>
<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
Virtual Keyboard
</label>
<p className="text-xs text-gray-500 dark:text-gray-400">
Show on-screen keyboard for touch input
</p>
</div>
</div>
<button
onClick={toggleVirtualKeyboard}
className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
settings.showVirtualKeyboard ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
}`}
>
<span
className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
settings.showVirtualKeyboard ? 'translate-x-6' : 'translate-x-1'
}`}
/>
</button>
</div>

<div className="space-y-3">
<div className="flex items-center space-x-2">
<Clock className="w-5 h-5 text-gray-600 dark:text-gray-300" />
<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
Key Repeat Delay
</label>
</div>
<div className="space-y-2">
<div className="flex items-center justify-between">
<span className="text-sm text-gray-600 dark:text-gray-400">Fast</span>
<span className="text-sm text-gray-600 dark:text-gray-400">{settings.keyRepeatDelay}ms</span>
<span className="text-sm text-gray-600 dark:text-gray-400">Slow</span>
</div>
<input
type="range"
min="100"
max="1000"
step="50"
value={settings.keyRepeatDelay}
onChange={(e) => handleRepeatDelayChange(Number(e.target.value))}
className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
/>
<div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
<span>100ms</span>
<span>300ms</span>
<span>500ms</span>
<span>700ms</span>
<span>1000ms</span>
</div>
</div>
<p className="text-xs text-gray-500 dark:text-gray-400">
Adjust how quickly keys repeat when held down
</p>
</div>

<div className="space-y-3">
<div className="flex items-center space-x-2">
<Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
Input Language
</label>
</div>
<div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
{languages.map((language) => (
<button
key={language.code}
onClick={() => handleLanguageChange(language.code)}
className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors text-left ${
settings.inputLanguage === language.code
? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
: 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
}`}
>
<span className="text-xl">{language.flag}</span>
<span className="text-sm text-gray-900 dark:text-white">{language.name}</span>
{settings.inputLanguage === language.code && (
<span className="ml-auto text-xs text-blue-600 dark:text-blue-400">Selected</span>
)}
</button>
))}
</div>
<div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
<div className="flex items-center space-x-2">
<span className="text-lg">{getSelectedLanguage().flag}</span>
<span className="text-sm font-medium text-blue-800 dark:text-blue-200">
Current: {getSelectedLanguage().name}
</span>
</div>
</div>
</div>

<div className="space-y-3">
<div className="flex items-center space-x-2">
<Keyboard className="w-5 h-5 text-gray-600 dark:text-gray-300" />
<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
Keyboard Layout
</label>
</div>
<div className="space-y-2">
{keyboardLayouts.map((layout) => (
<button
key={layout.id}
onClick={() => handleLayoutChange(layout.id)}
className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
settings.keyboardLayout === layout.id
? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
: 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
}`}
>
<span className="text-sm text-gray-900 dark:text-white">{layout.name}</span>
{settings.keyboardLayout === layout.id && (
<span className="text-xs text-blue-600 dark:text-blue-400">Active</span>
)}
</button>
))}
</div>
</div>

{settings.showVirtualKeyboard && (
<div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
<h5 className="font-medium text-gray-900 dark:text-white mb-3">Virtual Keyboard Preview</h5>
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
<div className="grid grid-cols-10 gap-1 mb-2">
{['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((key) => (
<button
key={key}
className="aspect-square bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-sm font-medium transition-colors"
>
{key}
</button>
))}
</div>
<div className="grid grid-cols-9 gap-1 mb-2 ml-4">
{['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((key) => (
<button
key={key}
className="aspect-square bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-sm font-medium transition-colors"
>
{key}
</button>
))}
</div>
<div className="grid grid-cols-7 gap-1 ml-8">
{['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((key) => (
<button
key={key}
className="aspect-square bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-sm font-medium transition-colors"
>
{key}
</button>
))}
</div>
<div className="mt-2">
<button className="w-1/2 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-sm font-medium transition-colors">
Space
</button>
</div>
</div>
<p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
Layout: {getSelectedLayout().name} • Language: {getSelectedLanguage().name}
</p>
</div>
)}
</div>
);
};

export default KeyboardInputSettings;