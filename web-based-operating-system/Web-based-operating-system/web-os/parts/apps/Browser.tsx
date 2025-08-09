import React, { useState } from 'react';
import { useOS } from '../../settings/OSContext';
import { useScrollPersistence } from '../../helpers/useScrollPersistence';
import WifiOffScreen from './browser/WifiOff';
import YouTube from './browser/YouTube';
import Spotify from './browser/Spotify';
import PokiGames from './browser/PokiGames';
import Instagram from './browser/Instagram';
import Netflix from './browser/Netflix';

const Browser: React.FC = () => {
const { wifiConnected } = useOS();
const [currentSite, setCurrentSite] = useState<string | null>(null);

const scrollRef = useScrollPersistence('browser-homepage');

const websites = [
{
id: 'youtube',
name: 'YouTube',
icon: '📺',
color: 'bg-red-500',
description: 'Watch videos and music',
component: YouTube
},
{
id: 'spotify',
name: 'Spotify',
icon: '🎵',
color: 'bg-green-500',
description: 'Listen to music and podcasts',
component: Spotify
},
{
id: 'pokigames',
name: 'Poki Games',
icon: '🎮',
color: 'bg-purple-500',
description: 'Play free online games',
component: PokiGames
},
{
id: 'instagram',
name: 'Instagram',
icon: '📸',
color: 'bg-pink-500',
description: 'Share photos and stories',
component: Instagram
},
{
id: 'netflix',
name: 'Netflix',
icon: '🎭',
color: 'bg-red-700',
description: 'Movies and TV shows',
component: Netflix
}
];

if (!wifiConnected) {
return <WifiOffScreen />;
}

if (currentSite) {
const site = websites.find(w => w.id === currentSite);
if (site) {
const SiteComponent = site.component;
return (
<div className="h-full bg-white dark:bg-gray-900">
<div className="border-b border-gray-200 dark:border-gray-700 p-3 flex items-center space-x-3">
<button
onClick={() => setCurrentSite(null)}
className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm transition-colors"
>
← Back
</button>
<div className="flex items-center space-x-2">
<span className="text-lg">{site.icon}</span>
<span className="font-medium text-gray-900 dark:text-white">{site.name}</span>
</div>
</div>

<div className="h-full" style={{ height: 'calc(100% - 60px)' }}>
<SiteComponent />
</div>
</div>
);
}
}

return (
<div className="h-full bg-white dark:bg-gray-900">
<div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
<div className="flex items-center space-x-3">
<span className="text-2xl">🌐</span>
<h1 className="text-xl font-semibold text-gray-900 dark:text-white">WebOS Browser</h1>
</div>
<div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
<div className="w-2 h-2 bg-green-500 rounded-full"></div>
<span>Connected</span>
</div>
</div>

<div ref={scrollRef} className="p-6 overflow-y-auto" style={{ height: 'calc(100% - 80px)' }}>
<div className="max-w-4xl mx-auto">
<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Popular Websites</h2>
<p className="text-gray-600 dark:text-gray-400 mb-8">Click on any website to visit it</p>

<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
{websites.map((website) => (
<button
key={website.id}
onClick={() => setCurrentSite(website.id)}
className={`${website.color} hover:scale-105 transform transition-all duration-200 rounded-xl p-6 text-white shadow-lg hover:shadow-xl`}
>
<div className="text-center">
<div className="text-4xl mb-3">{website.icon}</div>
<h3 className="font-semibold text-lg mb-1">{website.name}</h3>
<p className="text-sm opacity-90">{website.description}</p>
</div>
</button>
))}
</div>
</div>
</div>
</div>
);
};

export default Browser;