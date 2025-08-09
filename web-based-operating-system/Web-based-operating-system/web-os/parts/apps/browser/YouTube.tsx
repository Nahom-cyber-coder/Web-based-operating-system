import React, { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import { useOS } from '../../../settings/OSContext';

interface Video {
id: string;
title: string;
description: string;
embedCode: string;
views: string;
channel: string;
duration: string;
}

const YouTube: React.FC = () => {
const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

const videos: Video[] = [
{
id: '1',
title: 'Jiraiya - See You Again [AMV]',
description: 'An emotional Naruto AMV tribute to Jiraiya set to "See You Again".',
embedCode: '<iframe width="853" height="480" src="https://www.youtube.com/embed/Q4wm1LgxPR0?list=RDQ4wm1LgxPR0" title="Jiraiya- See you again 「AMV」" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
views: '9.8M views',
channel: 'Anime Music Vault',
duration: '4:21'
},
{
id: '2',
title: 'Fall Out Boy - Centuries (Official Video)',
description: 'Fall Out Boy\'s iconic anthem "Centuries\" with its epic visuals.',
embedCode: '<iframe width="853" height="480" src="https://www.youtube.com/embed/LBr7kECsjcQ?list=RDQ4wm1LgxPR0" title="Fall Out Boy - Centuries (Official Video)" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
views: '410M views',
channel: 'FallOutBoyVEVO',
duration: '4:32'
},
{
id: '3',
title: 'PnB Rock - Unforgettable (Freestyle)',
description: 'A freestyle from PnB Rock over the unforgettable beat.',
embedCode: '<iframe width="853" height="480" src="https://www.youtube.com/embed/NahQKl3z3mg?list=RDNahQKl3z3mg" title="PnB Rock - Unforgettable (Freestyle)" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
views: '7.1M views',
channel: 'PnB Rock',
duration: '2:59'
},
{
id: '4',
title: 'SAVAGE DAD - COMPLETE SEASON 1 🪓',
description: 'All episodes of Savage Dad season 1 compiled into one video.',
embedCode: '<iframe width="853" height="480" src="https://www.youtube.com/embed/iM542Vuaj6o" title="SAVAGE DAD COMPLETE SEASON 1 🪓" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
views: '2.2M views',
channel: 'Savage Universe',
duration: '18:41'
},
{
id: '5',
title: 'SAVAGE DAD - COMPLETE SEASON 2 🔥🪓',
description: 'The epic continuation of the Savage Dad saga.',
embedCode: '<iframe width="853" height="480" src="https://www.youtube.com/embed/_uY0TJH_dYQ" title="SAVAGE DAD COMPLETE SEASON 2 🔥🪓" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
views: '3.9M views',
channel: 'Savage Universe',
duration: '21:12'
},
{
id: '6',
title: 'Assassin\'s Creed Shadows - Walkthrough Part 1',
description: 'Gameplay walkthrough of Assassin\'s Creed Shadows: Part 1.',
embedCode: '<iframe width="853" height="480" src="https://www.youtube.com/embed/kH9faLXla_M" title="ASSASSIN&#39;S CREED SHADOWS Walkthrough Gameplay Part 1 - INTRO (FULL GAME)" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
views: '6.5M views',
channel: 'GamersZone',
duration: '36:50'
},
{
id: '7',
title: 'Cicada 3301: An Internet Mystery',
description: 'A documentary-style look into the secret puzzle group Cicada 3301.',
embedCode: '<iframe width="853" height="480" src="https://www.youtube.com/embed/I2O7blSSzpI" title="Cicada 3301: An Internet Mystery" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
views: '1.2M views',
channel: 'Internet Histories',
duration: '14:12'
},
{
id: '8',
title: 'We Hosted the Largest Hardware Hackathon',
description: 'Behind the scenes of the biggest hardware hackathon ever hosted.',
embedCode: '<iframe width="853" height="480" src="https://www.youtube.com/embed/kaEFv7e49mo" title="We Hosted the Largest Hardware Hackathon" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
views: '730K views',
channel: 'Tech Builders',
duration: '13:27'
},
{
id: '9',
title: 'Dancin - [ Slowed + Reverbed ] Aaron Smith',
description: 'A slowed + reverb version of Aaron Smith\'s viral track "Dancin".',
embedCode: '<iframe width="800" height="480" src="https://www.youtube.com/embed/3q23Die-Z1Q" title="Dancin - [ Slowed + reverbed ] Aaron Smith" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
views: '17.3M views',
channel: 'LoFi Garden',
duration: '3:52'
},
{
id: '10',
title: 'MONTAGEM BAILÃO',
description: 'High-energy Brazilian dance montage set to thumping beats.',
embedCode: '<iframe width="853" height="480" src="https://www.youtube.com/embed/B9KFb_fmvV8" title="MONTAGEM BAILÃO" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
views: '22.1M views',
channel: 'DJ Silva Mix',
duration: '5:02'
}
];

const handleVideoSelect = (video: Video) => {
setSelectedVideo(video);
};

if (selectedVideo) {
return (
<div className="h-full bg-black text-white flex flex-col">
<div className="flex-1 bg-black flex items-center justify-center p-4">
<div 
className="w-full max-w-4xl"
dangerouslySetInnerHTML={{ __html: selectedVideo.embedCode }}
/>
</div>

<div className="bg-white dark:bg-gray-900 p-6 border-t border-gray-200 dark:border-gray-700">
<div className="max-w-4xl mx-auto">
<div className="flex items-start justify-between mb-4">
<div className="flex-1">
<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
{selectedVideo.title}
</h2>
<div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
<span>{selectedVideo.views}</span>
<span>•</span>
<span>{selectedVideo.channel}</span>
<span>•</span>
<span>{selectedVideo.duration}</span>
</div>
<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
{selectedVideo.description}
</p>
</div>
</div>

<button
onClick={() => setSelectedVideo(null)}
className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
>
← Back to Videos
</button>
</div>
</div>
</div>
);
}

return (
<div className="h-full bg-white dark:bg-gray-900">
<div className="border-b border-gray-200 dark:border-gray-700 p-4">
<div className="flex items-center space-x-3">
<div className="text-2xl">📺</div>
<h1 className="text-2xl font-bold text-red-600">YouTube</h1>
</div>
</div>

<div className="p-6 overflow-y-auto" style={{ height: 'calc(100% - 80px)' }}>
<div className="max-w-6xl mx-auto">
<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Trending Videos</h2>
<p className="text-gray-600 dark:text-gray-400 mb-8">Click on any video to watch it</p>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{videos.map((video) => (
<div
key={video.id}
onClick={() => handleVideoSelect(video)}
className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105"
>
<div className="relative">
<div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg flex items-center justify-center relative overflow-hidden">
<img
src={`https://img.youtube.com/vi/${video.embedCode.match(/embed\/([^"?]*)/)?.[1]}/maxresdefault.jpg`}
alt={video.title}
className="w-full h-full object-cover"
onError={(e) => {
(e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop';
}}
/>
<div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
{video.duration}
</div>
<div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-30 rounded-t-lg">
<Play className="w-12 h-12 text-white" />
</div>
</div>
</div>

<div className="p-4">
<h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
{video.title}
</h3>
<p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
{video.description}
</p>
<div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
<span>{video.channel}</span>
<span>{video.views}</span>
</div>
</div>
</div>
))}
</div>
</div>
</div>
</div>
);
};

export default YouTube;