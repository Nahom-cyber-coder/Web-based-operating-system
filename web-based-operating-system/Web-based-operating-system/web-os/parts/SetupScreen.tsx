import React, { useState } from 'react';
import { useAuth } from '../helpers/useAuth';
import { useTheme } from '../settings/ThemeContext';
import { Camera, User, Lock, ArrowRight, Check } from 'lucide-react';

const SetupScreen: React.FC = () => {
const { updateProfile, user } = useAuth();
const { wallpaper } = useTheme();
const [step, setStep] = useState(1);
const [setupData, setSetupData] = useState({
username: user?.username || '',
password: '',
confirmPassword: '',
avatar: user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop'
});
const [errors, setErrors] = useState<string[]>([]);
const [isCompleting, setIsCompleting] = useState(false);

const validateStep = (stepNumber: number) => {
const newErrors: string[] = [];

switch (stepNumber) {
case 1:
if (!setupData.username.trim()) {
newErrors.push('Username is required');
}
if (setupData.username.length < 3) {
newErrors.push('Username must be at least 3 characters');
}
break;
case 2:
if (!setupData.password) {
newErrors.push('Password is required');
}
if (setupData.password.length < 3) {
newErrors.push('Password must be at least 3 characters');
}
if (setupData.password !== setupData.confirmPassword) {
newErrors.push('Passwords do not match');
}
break;
}

setErrors(newErrors);
return newErrors.length === 0;
};

const handleNext = () => {
if (validateStep(step)) {
if (step < 3) {
setStep(step + 1);
} else {
completeSetup();
}
}
};

const handleBack = () => {
if (step > 1) {
setStep(step - 1);
setErrors([]);
}
};

const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const file = e.target.files?.[0];
if (file) {
const reader = new FileReader();
reader.onload = (event) => {
setSetupData(prev => ({ ...prev, avatar: event.target?.result as string }));
};
reader.readAsDataURL(file);
}
};

const completeSetup = async () => {
setIsCompleting(true);

updateProfile({
username: setupData.username,
password: setupData.password,
avatar: setupData.avatar
});

localStorage.setItem('setupCompleted', 'true');

// Mark setup as completed without reloading
setTimeout(() => {
setIsCompleting(false);
// The App component will automatically switch to Desktop when setupCompleted is true
}, 2000);
};

const renderStep1 = () => (
<div className="space-y-6">
<div className="text-center">
<User className="w-16 h-16 text-blue-500 mx-auto mb-4" />
<h2 className="text-2xl font-bold text-white mb-2">Choose Your Username</h2>
<p className="text-white/80">This will be your display name in WebOS</p>
</div>

<div className="space-y-4">
<div>
<label className="block text-sm font-medium text-white/90 mb-2">
Username
</label>
<input
type="text"
value={setupData.username}
onChange={(e) => setSetupData(prev => ({ ...prev, username: e.target.value }))}
className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50"
placeholder="Enter your username"
autoFocus
/>
</div>
</div>
</div>
);

const renderStep2 = () => (
<div className="space-y-6">
<div className="text-center">
<Lock className="w-16 h-16 text-blue-500 mx-auto mb-4" />
<h2 className="text-2xl font-bold text-white mb-2">Set Your Password</h2>
<p className="text-white/80">Choose a secure password to protect your account</p>
</div>

<div className="space-y-4">
<div>
<label className="block text-sm font-medium text-white/90 mb-2">
Password
</label>
<input
type="password"
value={setupData.password}
onChange={(e) => setSetupData(prev => ({ ...prev, password: e.target.value }))}
className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50"
placeholder="Enter your password"
/>
</div>

<div>
<label className="block text-sm font-medium text-white/90 mb-2">
Confirm Password
</label>
<input
type="password"
value={setupData.confirmPassword}
onChange={(e) => setSetupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50"
placeholder="Confirm your password"
/>
</div>
</div>
</div>
);

const renderStep3 = () => (
<div className="space-y-6">
<div className="text-center">
<Camera className="w-16 h-16 text-blue-500 mx-auto mb-4" />
<h2 className="text-2xl font-bold text-white mb-2">Choose Profile Picture</h2>
<p className="text-white/80">Upload a photo or keep the default avatar</p>
</div>

<div className="flex flex-col items-center space-y-4">
<div className="relative">
<img
src={setupData.avatar}
alt="Profile"
className="w-32 h-32 rounded-full object-cover border-4 border-white/20"
/>
<label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full cursor-pointer transition-colors">
<Camera className="w-5 h-5" />
<input
type="file"
accept="image/*"
onChange={handleAvatarChange}
className="hidden"
/>
</label>
</div>

<p className="text-white/60 text-sm text-center">
Click the camera icon to upload a custom profile picture
</p>
</div>
</div>
);

return (
<div 
className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
style={{ backgroundImage: `url(${wallpaper})` }}
>
<div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

<div className="relative z-10 w-full max-w-md">
<div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
<div className="text-center mb-8">
<h1 className="text-3xl font-bold text-white mb-2">Welcome to WebOS</h1>
<p className="text-white/80">Let's set up your account</p>
</div>

<div className="flex items-center justify-center mb-8">
<div className="flex space-x-2">
{[1, 2, 3].map((stepNumber) => (
<div
key={stepNumber}
className={`w-3 h-3 rounded-full transition-colors ${
stepNumber <= step ? 'bg-blue-500' : 'bg-white/30'
}`}
/>
))}
</div>
</div>

{step === 1 && renderStep1()}
{step === 2 && renderStep2()}
{step === 3 && renderStep3()}

{errors.length > 0 && (
<div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
{errors.map((error, index) => (
<p key={index} className="text-red-400 text-sm">{error}</p>
))}
</div>
)}

{isCompleting ? (
<div className="mt-6 text-center">
<div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
<p className="text-white">Setting up your account...</p>
</div>
) : (
<div className="flex justify-between mt-8">
<button
onClick={handleBack}
disabled={step === 1}
className="px-6 py-3 text-white/80 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
>
Back
</button>

<button
onClick={handleNext}
className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
>
{step === 3 ? (
<>
<Check className="w-5 h-5" />
<span>Complete Setup</span>
</>
) : (
<>
<span>Next</span>
<ArrowRight className="w-5 h-5" />
</>
)}
</button>
</div>
)}
</div>
</div>
</div>
);
};

export default SetupScreen;