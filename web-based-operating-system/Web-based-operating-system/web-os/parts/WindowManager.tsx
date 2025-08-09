import React, { Suspense } from 'react';
import { useWindows } from '../settings/WindowContext';
import { useAppRegistry } from '../settings/AppRegistryContext';
import WindowWrapper from './WindowWrapper';
import ErrorWindow from './ErrorWindow';

const WindowManager: React.FC = () => {
const { windows, closeWindow, minimizeWindow, maximizeWindow, focusWindow } = useWindows();
const { getAppComponent } = useAppRegistry();

return (
<>
{windows.map((window) => {
if (window.isMinimized) return null;

const AppComponent = getAppComponent(window.appId);

return (
<WindowWrapper
key={window.id}
title={window.title}
icon={window.icon}
isActive={window.isActive}
initialSize={window.size}
initialPosition={window.position}
onClose={() => closeWindow(window.id)}
onMinimize={() => minimizeWindow(window.id)}
onMaximize={() => maximizeWindow(window.id)}
onFocus={() => focusWindow(window.id)}
>
<Suspense fallback={
<div className="h-full flex items-center justify-center">
<div className="text-center">
<div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
<p className="text-gray-600 dark:text-gray-400">Loading {window.title}...</p>
</div>
</div>
}>
{AppComponent ? (
<AppComponent {...window.props} />
) : (
<ErrorWindow appName={window.title} windowId={window.id} />
)}
</Suspense>
</WindowWrapper>
);
})}
</>
);
};

export default WindowManager;