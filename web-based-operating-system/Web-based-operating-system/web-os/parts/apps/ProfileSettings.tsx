import React, { useState } from 'react';
import { useAuth } from '../../helpers/useAuth';
import { Camera, User, Lock, Mail, Save, Eye, EyeOff } from 'lucide-react';

const ProfileSettings: React.FC = () => {
const { user, updateProfile, changePassword } = useAuth();
const [isEditingUsername, setIsEditingUsername] = useState(false);
const [isChangingPassword, setIsChangingPassword] = useState(false);
const [username, setUsername] = useState(user?.username || '');
const [email, setEmail] = useState(user?.email || '');
const [oldPassword, setOldPassword] = useState('');
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [showPasswords, setShowPasswords] = useState(false);
const [error, setError] = useState('');
const [success, setSuccess] = useState('');

const handleUsernameUpdate = () => {
if (username.trim()) {
updateProfile({ username: username.trim() });
setIsEditingUsername(false);
setSuccess('Username updated successfully!');
setTimeout(() => setSuccess(''), 3000);
}
};

const handleEmailUpdate = () => {
if (email.trim()) {
updateProfile({ email: email.trim() });
setSuccess('Email updated successfully!');
setTimeout(() => setSuccess(''), 3000);
}
};

const handlePasswordChange = async () => {
setError('');

if (newPassword !== confirmPassword) {
setError('New passwords do not match');
return;
}

if (newPassword.length < 3) {
setError('Password must be at least 3 characters long');
return;
}

const success = await changePassword(oldPassword, newPassword);
if (success) {
setSuccess('Password changed successfully!');
setOldPassword('');
setNewPassword('');
setConfirmPassword('');
setIsChangingPassword(false);
setTimeout(() => setSuccess(''), 3000);
} else {
setError('Current password is incorrect');
}
};

const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const file = e.target.files?.[0];
if (file) {
const reader = new FileReader();
reader.onload = (event) => {
const result = event.target?.result as string;
updateProfile({ avatar: result });
setSuccess('Profile picture updated successfully!');
setTimeout(() => setSuccess(''), 3000);
};
reader.readAsDataURL(file);
}
};

return (
<div className="space-y-6">
<div>
<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Settings</h3>

{success && (
<div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
<p className="text-green-800 dark:text-green-200 text-sm">{success}</p>
</div>
)}

{error && (
<div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
<p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
</div>
)}

<div className="flex items-center space-x-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6">
<div className="relative">
<img
src={user?.avatar}
alt={user?.username}
className="w-20 h-20 rounded-full object-cover"
/>
<label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer transition-colors">
<Camera className="w-4 h-4" />
<input
type="file"
accept="image/*"
onChange={handleProfilePictureChange}
className="hidden"
/>
</label>
</div>
<div>
<h4 className="font-medium text-gray-900 dark:text-white">{user?.username}</h4>
<p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
Click camera icon to change profile picture
</p>
</div>
</div>

<div className="space-y-4">
<div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
<div className="flex items-center space-x-3">
<User className="w-5 h-5 text-gray-500" />
<div>
<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
Username
</label>
{isEditingUsername ? (
<div className="flex items-center space-x-2 mt-1">
<input
type="text"
value={username}
onChange={(e) => setUsername(e.target.value)}
className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
autoFocus
/>
<button
onClick={handleUsernameUpdate}
className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
>
<Save className="w-3 h-3" />
</button>
<button
onClick={() => {
setIsEditingUsername(false);
setUsername(user?.username || '');
}}
className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm transition-colors"
>
Cancel
</button>
</div>
) : (
<p className="text-gray-900 dark:text-white">{user?.username}</p>
)}
</div>
</div>
{!isEditingUsername && (
<button
onClick={() => setIsEditingUsername(true)}
className="text-blue-500 hover:text-blue-600 text-sm"
>
Edit
</button>
)}
</div>

<div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
<div className="flex items-center space-x-3">
<Mail className="w-5 h-5 text-gray-500" />
<div>
<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
Email
</label>
<input
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
onBlur={handleEmailUpdate}
className="block mt-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
/>
</div>
</div>
</div>

<div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
<div className="flex items-center justify-between mb-3">
<div className="flex items-center space-x-3">
<Lock className="w-5 h-5 text-gray-500" />
<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
Password
</label>
</div>
<button
onClick={() => setIsChangingPassword(!isChangingPassword)}
className="text-blue-500 hover:text-blue-600 text-sm"
>
{isChangingPassword ? 'Cancel' : 'Change'}
</button>
</div>

{isChangingPassword && (
<div className="space-y-3">
<div className="relative">
<input
type={showPasswords ? 'text' : 'password'}
placeholder="Current password"
value={oldPassword}
onChange={(e) => setOldPassword(e.target.value)}
className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm pr-10"
/>
<button
type="button"
onClick={() => setShowPasswords(!showPasswords)}
className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
>
{showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
</button>
</div>

<input
type={showPasswords ? 'text' : 'password'}
placeholder="New password"
value={newPassword}
onChange={(e) => setNewPassword(e.target.value)}
className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
/>

<input
type={showPasswords ? 'text' : 'password'}
placeholder="Confirm new password"
value={confirmPassword}
onChange={(e) => setConfirmPassword(e.target.value)}
className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
/>

<button
onClick={handlePasswordChange}
className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
>
Update Password
</button>
</div>
)}
</div>
</div>
</div>
</div>
);
};

export default ProfileSettings;