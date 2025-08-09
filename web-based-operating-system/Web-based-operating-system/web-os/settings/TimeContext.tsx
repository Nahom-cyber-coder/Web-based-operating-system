import React, { createContext, useContext, useState, useEffect } from 'react';

interface TimeContextType {
currentTime: Date;
setSystemTime: (time: Date) => void;
formatTime: (format24Hour?: boolean) => string;
formatDate: (format?: string) => string;
}

const TimeContext = createContext<TimeContextType | undefined>(undefined);

export const useTime = () => {
const context = useContext(TimeContext);
if (!context) {
throw new Error('useTime must be used within a TimeProvider');
}
return context;
};

export const TimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [currentTime, setCurrentTime] = useState(() => {
const savedTime = localStorage.getItem('systemTime');
return savedTime ? new Date(savedTime) : new Date();
});

useEffect(() => {
const timer = setInterval(() => {
setCurrentTime(prev => {
const newTime = new Date(prev.getTime() + 1000);
localStorage.setItem('systemTime', newTime.toISOString());
return newTime;
});
}, 1000);

return () => clearInterval(timer);
}, []);

const setSystemTime = (time: Date) => {
setCurrentTime(time);
localStorage.setItem('systemTime', time.toISOString());
};

const formatTime = (format24Hour: boolean = false) => {
if (format24Hour) {
return currentTime.toLocaleTimeString('en-GB', { 
hour: '2-digit', 
minute: '2-digit' 
});
} else {
return currentTime.toLocaleTimeString('en-US', { 
hour: '2-digit', 
minute: '2-digit',
hour12: true 
});
}
};

const formatDate = (format: string = 'MM/DD/YYYY') => {
const day = currentTime.getDate().toString().padStart(2, '0');
const month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
const year = currentTime.getFullYear();

switch (format) {
case 'MM/DD/YYYY':
return `${month}/${day}/${year}`;
case 'DD/MM/YYYY':
return `${day}/${month}/${year}`;
case 'YYYY/MM/DD':
return `${year}/${month}/${day}`;
case 'DD-MM-YYYY':
return `${day}-${month}-${year}`;
default:
return `${month}/${day}/${year}`;
}
};

const value = {
currentTime,
setSystemTime,
formatTime,
formatDate,
};

return (
<TimeContext.Provider value={value}>
{children}
</TimeContext.Provider>
);
};