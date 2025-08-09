import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
id: string;
username: string;
avatar: string;
email: string;
password: string;
}

interface PublicUser {
id: string;
username: string;
avatar: string;
email: string;
}

interface AuthContextType {
user: User | null;
isAuthenticated: boolean;
isLocked: boolean;
login: (username: string, password: string) => Promise<boolean>;
logout: () => void;
lock: () => void;
unlock: (password: string) => Promise<boolean>;
updateProfile: (updates: Partial<User>) => void;
changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
const context = useContext(AuthContext);
if (!context) {
throw new Error('useAuth must be used within an AuthProvider');
}
return context;
};

const defaultUser: User = {
id: '1',
username: 'user',
avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
email: 'user@webos.com',
password: 'password',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [user, setUser] = useState<User | null>(null);
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [isLocked, setIsLocked] = useState(false);

useEffect(() => {
const savedUser = localStorage.getItem('currentUser');
const savedAuth = localStorage.getItem('isAuthenticated');

if (savedUser && savedAuth === 'true') {
try {
const publicUser: PublicUser = JSON.parse(savedUser);
setUser({ ...defaultUser, ...publicUser }); // Restore with default password
setIsAuthenticated(true);
} catch (e) {
console.warn('Failed to load saved user:', e);
}
}
}, []);

const login = async (username: string, password: string): Promise<boolean> => {
if (username === 'user' && password === 'password') {
setUser(defaultUser);
setIsAuthenticated(true);
setIsLocked(false);
const { id, username, avatar, email } = defaultUser;
localStorage.setItem('currentUser', JSON.stringify({ id, username, avatar, email }));
localStorage.setItem('isAuthenticated', 'true');
return true;
}
return false;
};

const logout = () => {
setUser(null);
setIsAuthenticated(false);
setIsLocked(false);
localStorage.removeItem('currentUser');
localStorage.removeItem('isAuthenticated');
};

const lock = () => {
setIsLocked(true);
};

const unlock = async (password: string): Promise<boolean> => {
if (user && password === user.password) {
setIsLocked(false);
return true;
}
return false;
};

const updateProfile = (updates: Partial<User>) => {
if (user) {
const updatedUser = { ...user, ...updates };
setUser(updatedUser);
const { id, username, avatar, email } = updatedUser;
try {
localStorage.setItem('currentUser', JSON.stringify({ id, username, avatar, email }));
} catch (e) {
console.error('Failed to update user in localStorage:', e);
}
}
};

const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
if (user && oldPassword === user.password) {
updateProfile({ password: newPassword });
return true;
}
return false;
};

const value = {
user,
isAuthenticated,
isLocked,
login,
logout,
lock,
unlock,
updateProfile,
changePassword,
};

return (
<AuthContext.Provider value={value}>
{children}
</AuthContext.Provider>
);
};

export { AuthContext };
