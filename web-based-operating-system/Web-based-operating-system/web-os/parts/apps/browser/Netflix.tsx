import React, { useState, useRef, useEffect } from 'react';
import { Play, Info, Search } from 'lucide-react';
import { useOS } from '../../../settings/OSContext';

interface Video {
id: string;
title: string;
description: string;
embedCode: string;
views: string;
channel: string;
duration: string;
thumbnail: string;
rating: string;
year: number;
genre: string[];
isFeatured?: boolean;
}

const Netflix: React.FC = () => {
const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
const [searchQuery, setSearchQuery] = useState('');

const videos: Video[] = [
{
id: '1',
title: 'American Manhunt: O.J. Simpson',
description: 'A gripping documentary series exploring the infamous O.J. Simpson case and its impact on American culture.',
thumbnail: 'https://img.youtube.com/vi/0CIcPQucoIw/maxresdefault.jpg',
embedCode: '<iframe width="853" height="480" src="https://www.youtube.com/embed/0CIcPQucoIw?list=PLvahqwMqN4M23qWJAjNrlCoZ7mcf9Hbgr" title="American Manhunt: O.J. Simpson | Official Trailer | Netflix" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
views: '1.5M views',
channel: 'Netflix',
duration: '3 Episodes',
rating: 'TV-MA',
year: 2025,
genre: ['Documentary', 'Crime'],
isFeatured: true
},
{
id: '2',
title: 'WWE: Unreal',
description: 'A behind-the-scenes look at the high-energy world of WWE, showcasing its larger-than-life superstars.',
thumbnail: 'https://img.youtube.com/vi/FfE8LC_FVLA/maxresdefault.jpg',
embedCode: '<iframe width="853" height="480" src="https://www.youtube.com/embed/FfE8LC_FVLA?list=PLvahqwMqN4M0tsBS3c3H9JGaKY8Lt3pXR" title="WWE: Unreal | Official Trailer | Netflix" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
views: '800K views',
channel: 'Netflix',
duration: '1h 45m',
rating: 'PG-13',
year: 2025,
genre: ['Documentary', 'Sports']
},
{
id: '3',
title: 'Hitmakers',
description: 'A documentary celebrating the music industry\'s biggest stars and the stories behind their iconic hits.',
thumbnail: 'https://img.youtube.com/vi/KsrK9tdc250/maxresdefault.jpg',
embedCode: '<iframe width="853" height="480" src="https://www.youtube.com/embed/KsrK9tdc250?list=PLvahqwMqN4M0tsBS3c3H9JGaKY8Lt3pXR" title="Hitmakers | Official Trailer | Netflix" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
views: '600K views',
channel: 'Netflix',
duration: '1h 50m',
rating: 'PG',
year: 2025,
genre: ['Documentary', 'Music']
},
{
id: '4',
title: 'The Sandman: Season 2',
description: 'The cosmic journey continues as Dream navigates the realms of gods, demons, and mortals.',
thumbnail: 'https://img.youtube.com/vi/Er18gmgqy2k/maxresdefault.jpg',
embedCode: '<iframe width="853" height="480" src="https://www.youtube.com/embed/Er18gmgqy2k?list=PLvahqwMqN4M0tsBS3c3H9JGaKY8Lt3pXR" title="The Sandman: Season 2 | Official Trailer | Netflix" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
views: '2.3M views',
channel: 'Netflix',
duration: '10 Episodes',
rating: 'TV-MA',
year: 2025,
genre: ['Fantasy', 'Drama']
},
{
id: '5',
title: 'Sakamoto Days: Part 2',
description: 'The action-packed adventures of a retired hitman balancing family life and deadly missions.',
thumbnail: 'https://img.youtube.com/vi/y-PdMVbil3o/maxresdefault.jpg',
embedCode: '<iframe width="853" height="480" src="https://www.youtube.com/embed/y-PdMVbil3o?list=PLvahqwMqN4M0tsBS3c3H9JGaKY8Lt3pXR" title="Sakamoto Days | Part 2 Official Trailer | Netflix" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
views: '1.8M views',
channel: 'Netflix',
duration: '12 Episodes',
rating: 'TV-14',
year: 2025,
genre: ['Action', 'Anime']
},
{
id: '6',
title: 'The Old Guard 2',
description: 'The immortal mercenaries return for another thrilling chapter of action and intrigue.',
thumbnail: 'https://img.youtube.com/vi/lyivgZ074PY/maxresdefault.jpg',
embedCode: '<iframe width="853" height="480" src="https://www.youtube.com/embed/lyivgZ074PY?list=PLvahqwMqN4M0tsBS3c3H9JGaKY8Lt3pXR" title="The Old Guard 2 | Official Trailer | Netflix" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
views: '3.1M views',
channel: 'Netflix',
duration: '2h 10m',
rating: 'R',
year: 2025,
genre: ['Action', 'Fantasy']
},
{
id: '7',
title: 'Black Clover: Second Season',
description: 'Asta and the Black Bulls continue their magical journey in this action-packed anime series.',
thumbnail: 'https://img.youtube.com/vi/Ln_imebEmAQ/maxresdefault.jpg',
embedCode: '<iframe width="853" height="480" src="https://www.youtube.com/embed/Ln_imebEmAQ" title="Black Clover Second Season | Official Trailer | Crunchyroll" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
views: '4.2M views',
channel: 'Crunchyroll',
duration: '51 Episodes',
rating: 'TV-14',
year: 2025,
genre: ['Anime', 'Fantasy']
},
{
id: '8',
title: 'Mortal Kombat II',
description: 'The epic martial arts tournament continues with higher stakes and deadlier fighters.',
thumbnail: 'https://img.youtube.com/vi/ZdC5mFHPldg/maxresdefault.jpg',
embedCode: '<iframe width="853" height="480" src="https://www.youtube.com/embed/ZdC5mFHPldg" title="Mortal Kombat II | Official Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
views: '2.7M views',
channel: 'Warner Bros.',
duration: '1h 55m',
rating: 'R',
year: 2025,
genre: ['Action', 'Fantasy']
},
{
id: '9',
title: 'BLEACH: Thousand-Year Blood War',
description: 'Ichigo Kurosaki faces new challenges in the climactic battles of the Soul Society.',
thumbnail: 'https://img.youtube.com/vi/78WIYzX_m98/maxresdefault.jpg',
embedCode: '<iframe width="853" height="480" src="https://www.youtube.com/embed/78WIYzX_m98" title="Official JUMP FESTA Trailer | BLEACH: Thousand-Year Blood War | VIZ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
views: '3.5M views',
channel: 'VIZ Media',
duration: '13 Episodes',
rating: 'TV-MA',
year: 2025,
genre: ['Anime', 'Action']
},
{
id: '10',
title: 'Five Nights at Freddy\'s 2',
description: 'The horror returns as new terrors unfold in the haunted animatronic-filled pizzeria.',
thumbnail: 'https://img.youtube.com/vi/dSDpoobO6yM/maxresdefault.jpg',
embedCode: '<iframe width="853" height="480" src="https://www.youtube.com/embed/dSDpoobO6yM" title="Five Nights at Freddy&#39;s 2 | Official Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
views: '5.8M views',
channel: 'Blumhouse',
duration: '1h 48m',
rating: 'PG-13',
year: 2025,
genre: ['Horror', 'Thriller']
},
{
id: '11',
title: 'Wednesday: Season 2',
description: 'Wednesday Addams dives deeper into mysteries at Nevermore Academy with her signature wit.',
thumbnail: 'https://img.youtube.com/vi/03u4xyj0TH4/maxresdefault.jpg',
embedCode: '<iframe width="853" height="480" src="https://www.youtube.com/embed/03u4xyj0TH4" title="Wednesday: Season 2 | Official Trailer | Netflix" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
views: '6.4M views',
channel: 'Netflix',
duration: '8 Episodes',
rating: 'TV-14',
year: 2025,
genre: ['Comedy', 'Horror']
},
{
id: '12',
title: 'Stranger Things 5',
description: 'The final chapter of the Hawkins gang\'s battle against the Upside Down\'s terrors.',
thumbnail: 'https://img.youtube.com/vi/iKZyYdwS3Wg/maxresdefault.jpg',
embedCode: '<iframe width="853" height="480" src="https://www.youtube.com/embed/iKZyYdwS3Wg" title="Stranger Things 5 | Official Teaser | Netflix" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
views: '7.2M views',
channel: 'Netflix',
duration: '8 Episodes',
rating: 'TV-14',
year: 2025,
genre: ['Sci-Fi', 'Horror']
},
{
id: '13',
title: 'Alice in Borderland: Season 3',
description: 'Arisu and his friends face new deadly games in the mysterious Borderland.',
thumbnail: 'https://img.youtube.com/vi/CaWRDITtT1U/maxresdefault.jpg',
embedCode: '<iframe width="853" height="480" src="https://www.youtube.com/embed/CaWRDITtT1U" title="Alice in Borderland: Season 3 | Official Teaser | Netflix" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
views: '4.9M views',
channel: 'Netflix',
duration: '6 Episodes',
rating: 'TV-MA',
year: 2025,
genre: ['Thriller', 'Sci-Fi']
},
{
id: '14',
title: 'Squid Game: Season 3',
description: 'The deadly games continue with new players and higher stakes in the final season.',
thumbnail: 'https://img.youtube.com/vi/OLPwT05kYjw/maxresdefault.jpg',
embedCode: '<iframe width="853" height="480" src="https://www.youtube.com/embed/OLPwT05kYjw" title="Squid Game: Season 3 | Final Games Trailer | Netflix" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
views: '8.1M views',
channel: 'Netflix',
duration: '7 Episodes',
rating: 'TV-MA',
year: 2025,
genre: ['Thriller', 'Drama']
},
{
id: '15',
title: 'The Fantastic Four: First Steps',
description: 'Marvel\'s First Family embarks on a cosmic adventure to save the world.',
thumbnail: 'https://img.youtube.com/vi/18QQWa5MEcs/maxresdefault.jpg',
embedCode: '<iframe width="853" height="480" src="https://www.youtube.com/embed/18QQWa5MEcs" title="The Fantastic Four: First Steps | Final Trailer | Only in Theaters July 25" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
views: '5.3M views',
channel: 'Marvel Studios',
duration: '2h 15m',
rating: 'PG-13',
year: 2025,
genre: ['Action', 'Sci-Fi']
}
];

const featuredVideo = videos.find(v => v.isFeatured) || videos[0];

const filteredVideos = videos.filter(video =>
video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
video.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
);

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

<div className="bg-black p-6 border-t border-gray-700">
<div className="max-w-4xl mx-auto">
<div className="flex items-start justify-between mb-4">
<div className="flex-1">
<h2 className="text-2xl font-bold text-white mb-2">
{selectedVideo.title}
</h2>
<div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
<span>{selectedVideo.views}</span>
<span>•</span>
<span>{selectedVideo.channel}</span>
<span>•</span>
<span>{selectedVideo.duration}</span>
</div>
<p className="text-gray-300 leading-relaxed">
{selectedVideo.description}
</p>
</div>
</div>

<button
onClick={() => setSelectedVideo(null)}
className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
>
← Back to Movies
</button>
</div>
</div>
</div>
);
}

return (
<div className="h-full bg-black text-white">
<div className="relative">
<div className="relative h-96 overflow-hidden">
<iframe
width="100%"
height="100%"
src={featuredVideo.embedCode.match(/src="([^"]*)"/)?.[1]}
title={featuredVideo.title}
frameBorder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
referrerPolicy="strict-origin-when-cross-origin"
allowFullScreen
/>
<div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />

<div className="absolute top-4 left-4 right-4 flex items-center justify-between">
<div className="flex items-center space-x-4">
<h1 className="text-2xl font-bold text-red-600">NETFLIX</h1>
<nav className="hidden md:flex space-x-6">
<button className="text-white hover:text-gray-300 transition-colors">Home</button>
<button className="text-gray-300 hover:text-white transition-colors">TV Shows</button>
<button className="text-gray-300 hover:text-white transition-colors">Movies</button>
<button className="text-gray-300 hover:text-white transition-colors">My List</button>
</nav>
</div>

<div className="flex items-center space-x-4">
<div className="relative">
<Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
<input
type="text"
placeholder="Search..."
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
className="pl-10 pr-4 py-2 bg-black bg-opacity-50 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-white"
/>
</div>
<div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
<span className="text-sm font-bold">U</span>
</div>
</div>
</div>

<div className="absolute bottom-8 left-8 max-w-lg">
<h2 className="text-4xl font-bold mb-4">{featuredVideo.title}</h2>
<p className="text-lg mb-6 leading-relaxed">{featuredVideo.description}</p>
<div className="flex items-center space-x-4">
<button
onClick={() => handleVideoSelect(featuredVideo)}
className="flex items-center space-x-2 px-8 py-3 bg-white text-black rounded hover:bg-gray-200 transition-colors font-semibold"
>
<Play className="w-5 h-5" />
<span>Play</span>
</button>
<button className="flex items-center space-x-2 px-6 py-3 bg-gray-600 bg-opacity-70 text-white rounded hover:bg-opacity-90 transition-colors">
<Info className="w-5 h-5" />
<span>More Info</span>
</button>
</div>
</div>
</div>
</div>

<div className="p-8 space-y-8">
<div>
<h3 className="text-2xl font-bold mb-4">Popular on Netflix</h3>
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
{filteredVideos.slice(0, 6).map((video) => (
<div
key={video.id}
className="group cursor-pointer transition-transform hover:scale-105"
onClick={() => handleVideoSelect(video)}
>
<div className="relative">
<img
src={video.thumbnail}
alt={video.title}
className="w-full aspect-[2/3] object-cover rounded"
/>
<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded flex items-center justify-center">
<Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
</div>
</div>
<h4 className="mt-2 font-medium text-sm">{video.title}</h4>
</div>
))}
</div>
</div>

<div>
<h3 className="text-2xl font-bold mb-4">Trending Now</h3>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
{filteredVideos.slice(6).map((video) => (
<div
key={video.id}
className="group cursor-pointer"
onClick={() => handleVideoSelect(video)}
>
<div className="relative">
<img
src={video.thumbnail}
alt={video.title}
className="w-full aspect-video object-cover rounded"
/>
<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded flex items-center justify-center">
<Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
</div>
</div>
<div className="mt-2">
<h4 className="font-medium">{video.title}</h4>
<div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
<span>{video.year}</span>
<span>•</span>
<span>{video.rating}</span>
<span>•</span>
<span>{video.duration}</span>
</div>
<div className="flex flex-wrap gap-1 mt-1">
{video.genre.map((g) => (
<span key={g} className="text-xs text-gray-400">{g}</span>
))}
</div>
</div>
</div>
))}
</div>
</div>

<div>
<h3 className="text-2xl font-bold mb-4">Continue Watching</h3>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
{filteredVideos.slice(0, 3).map((video) => (
<div
key={video.id}
className="group cursor-pointer"
onClick={() => handleVideoSelect(video)}
>
<div className="relative">
<img
src={video.thumbnail}
alt={video.title}
className="w-full aspect-video object-cover rounded"
/>
<div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
<div className="h-full bg-red-600" style={{ width: '35%' }} />
</div>
<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded flex items-center justify-center">
<Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
</div>
</div>
<h4 className="mt-2 font-medium">{video.title}</h4>
<p className="text-sm text-gray-400">35% watched</p>
</div>
))}
</div>
</div>
</div>
</div>
);
};

export default Netflix;