import React, { createContext, useContext, useState, useCallback } from 'react';

interface Notification {
id: string;
title: string;
message: string;
type: 'info' | 'success' | 'warning' | 'error';
timestamp: Date;
isRead: boolean;
appIcon?: string;
}

interface NotificationContextType {
notifications: Notification[];
addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
removeNotification: (id: string) => void;
markAsRead: (id: string) => void;
markAllAsRead: () => void;
clearAll: () => void;
unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
const context = useContext(NotificationContext);
if (!context) {
throw new Error('useNotifications must be used within a NotificationProvider');
}
return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [notifications, setNotifications] = useState<Notification[]>([
{
id: '1',
title: 'Welcome to WebOS',
message: 'Your web-based operating system is ready to use!',
type: 'info',
timestamp: new Date(),
isRead: false,
appIcon: '🖥️'
},
{
id: '2',
title: 'System Update',
message: 'WebOS has been updated to the latest version',
type: 'success',
timestamp: new Date(Date.now() - 300000),
isRead: false,
appIcon: '⚙️'
}
]);

const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
const newNotification: Notification = {
...notification,
id: `notification-${Date.now()}`,
timestamp: new Date(),
isRead: false,
};
setNotifications(prev => [newNotification, ...prev]);
}, []);

const removeNotification = useCallback((id: string) => {
setNotifications(prev => prev.filter(n => n.id !== id));
}, []);

const markAsRead = useCallback((id: string) => {
setNotifications(prev => prev.map(n => 
n.id === id ? { ...n, isRead: true } : n
));
}, []);

const markAllAsRead = useCallback(() => {
setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
}, []);

const clearAll = useCallback(() => {
setNotifications([]);
}, []);

const unreadCount = notifications.filter(n => !n.isRead).length;

const value = {
notifications,
addNotification,
removeNotification,
markAsRead,
markAllAsRead,
clearAll,
unreadCount,
};

return (
<NotificationContext.Provider value={value}>
{children}
</NotificationContext.Provider>
);
};