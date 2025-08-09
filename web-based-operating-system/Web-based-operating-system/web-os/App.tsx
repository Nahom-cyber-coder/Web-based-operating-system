import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './settings/AuthContext';
import { ThemeProvider } from './settings/ThemeContext';
import { TimeProvider } from './settings/TimeContext';
import { OSProvider } from './settings/OSContext';
import { WindowProvider } from './settings/WindowContext';
import { FileSystemProvider } from './settings/FileSystemContext';
import { DialogProvider } from './settings/DialogContext';
import { NotificationProvider } from './settings/NotificationContext';
import { AppRegistryProvider } from './settings/AppRegistryContext';
import LoginScreen from './parts/LoginScreen';
import Desktop from './parts/Desktop';
import SetupScreen from './parts/SetupScreen';

const AppContentInner: React.FC = () => {
const { isAuthenticated } = useAuth();
const [setupCompleted, setSetupCompleted] = useState(localStorage.getItem('setupCompleted') === 'true');

useEffect(() => {
const checkSetupStatus = () => {
const completed = localStorage.getItem('setupCompleted') === 'true';
setSetupCompleted(completed);
};

const interval = setInterval(checkSetupStatus, 1000);

return () => clearInterval(interval);
}, []);

if (!isAuthenticated) {
return <LoginScreen />;
}

if (!setupCompleted) {
return <SetupScreen />;
}

return <Desktop />;
};

const AppContent: React.FC = () => {
return (
<AuthProvider>
<AppContentInner />
</AuthProvider>
);
};

const App: React.FC = () => {
return (
<ThemeProvider>
<TimeProvider>
<DialogProvider>
<AppRegistryProvider>
<OSProvider>
<WindowProvider>
<FileSystemProvider>
<NotificationProvider>
<div id="screen-root">
<AppContent />
</div>
</NotificationProvider>
</FileSystemProvider>
</WindowProvider>
</OSProvider>
</AppRegistryProvider>
</DialogProvider>
</TimeProvider>
</ThemeProvider>
);
};

export default App;
