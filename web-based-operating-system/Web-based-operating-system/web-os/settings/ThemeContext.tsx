import React, { createContext, useContext, useState, useEffect } from 'react';
import { compressToUTF16, decompressFromUTF16 } from 'lz-string'; // 🧠 added

type Theme = 'light' | 'dark';

interface ThemeContextType {
theme: Theme;
toggleTheme: () => void;
setTheme: (theme: Theme) => void;
accentColor: string;
setAccentColor: (color: string) => void;
wallpaper: string;
setWallpaper: (wallpaper: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
const context = useContext(ThemeContext);
if (!context) {
throw new Error('useTheme must be used within a ThemeProvider');
}
return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [theme, setTheme] = useState<Theme>('dark');
const [accentColor, setAccentColor] = useState('#3b82f6');
const [wallpaper, setWallpaperState] = useState('/667167.jpg');

useEffect(() => {
const savedTheme = localStorage.getItem('theme') as Theme;
const savedAccentColor = localStorage.getItem('accentColor');
const savedWallpaper = localStorage.getItem('wallpaper');

if (savedTheme) setTheme(savedTheme);
if (savedAccentColor) setAccentColor(savedAccentColor);
if (savedWallpaper) {
try {
const decompressed = decompressFromUTF16(savedWallpaper);
if (decompressed) setWallpaperState(decompressed);
else setWallpaperState(savedWallpaper); // fallback if not compressed
} catch {
setWallpaperState(savedWallpaper); // fallback on error
}
}
}, []);

useEffect(() => {
localStorage.setItem('theme', theme);
document.documentElement.classList.toggle('dark', theme === 'dark');
}, [theme]);

useEffect(() => {
localStorage.setItem('accentColor', accentColor);
document.documentElement.style.setProperty('--accent-color', accentColor);
}, [accentColor]);

useEffect(() => {
try {
const compressed = compressToUTF16(wallpaper);
localStorage.setItem('wallpaper', compressed);
} catch (e) {
console.error('⚠️ Could not save wallpaper – storage quota exceeded.', e);
}
}, [wallpaper]);

const setWallpaper = (wall: string) => {
setWallpaperState(wall);
};

const toggleTheme = () => {
setTheme(prev => prev === 'light' ? 'dark' : 'light');
};

const value = {
theme,
toggleTheme,
setTheme,
accentColor,
setAccentColor,
wallpaper,
setWallpaper,
};

return (
<ThemeContext.Provider value={value}>
{children}
</ThemeContext.Provider>
);
};
