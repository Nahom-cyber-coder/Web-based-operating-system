import React, { useState } from 'react';
import { useAuth } from '../helpers/useAuth';
import { useTheme } from '../settings/ThemeContext';
import { useTime } from '../settings/TimeContext';
import { Eye, EyeOff } from 'lucide-react';

const LockScreen: React.FC = () => {
const { user, unlock } = useAuth();
const { wallpaper } = useTheme();
const { currentTime } = useTime();
const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [error, setError] = useState('');
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
setError('');
setIsLoading(true);

const success = await unlock(password);
if (!success) {
setError('Incorrect password');
setPassword('');
}
setIsLoading(false);
};

return (
<div 
className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative"
style={{ backgroundImage: `url(${wallpaper})` }}
>
<div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

<div className="relative z-10 text-center">
<div className="text-white mb-8">
<div className="text-6xl font-light mb-2">
{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
</div>
<div className="text-xl opacity-80">
{currentTime.toLocaleDateString([], { 
weekday: 'long', 
year: 'numeric', 
month: 'long', 
day: 'numeric' 
})}
</div>
</div>

<div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 max-w-md">
<div className="text-center mb-6">
<img 
src={user?.avatar} 
alt={user?.username}
className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-white/30"
/>
<h2 className="text-2xl font-semibold text-white mb-1">{user?.username}</h2>
<p className="text-white/80">Enter your password to unlock</p>
</div>

<form onSubmit={handleSubmit} className="space-y-4">
<div className="relative">
<input
type={showPassword ? 'text' : 'password'}
value={password}
onChange={(e) => setPassword(e.target.value)}
className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 pr-12"
placeholder="Password"
required
autoFocus
/>
<button
type="button"
onClick={() => setShowPassword(!showPassword)}
className="absolute right-3 top-3 text-white/60 hover:text-white transition-colors"
>
{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
</button>
</div>

{error && (
<div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
<p className="text-red-400 text-sm">{error}</p>
</div>
)}

<button
type="submit"
disabled={isLoading}
className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400/50"
>
{isLoading ? 'Unlocking...' : 'Unlock'}
</button>
</form>
</div>
</div>
</div>
);
};

export default LockScreen;