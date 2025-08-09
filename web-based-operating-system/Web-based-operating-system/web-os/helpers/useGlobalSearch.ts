import { useState, useEffect, useMemo } from 'react';
import { useAppRegistry } from '../settings/AppRegistryContext';
import { useFileSystem } from '../settings/FileSystemContext';

interface SearchResult {
id: string;
title: string;
description: string;
type: 'app' | 'file' | 'folder' | 'web';
icon: string;
action: () => void;
category?: string;
}

export const useGlobalSearch = (query: string) => {
const { getInstalledApps } = useAppRegistry();
const { items } = useFileSystem();
const [webResults, setWebResults] = useState<SearchResult[]>([]);

const apps = getInstalledApps();
const files = items.filter(item => !item.isDeleted);

const appResults = useMemo(() => {
if (!query.trim()) return [];

return apps
.filter(app => 
app.name.toLowerCase().includes(query.toLowerCase()) ||
app.category.toLowerCase().includes(query.toLowerCase())
)
.map(app => ({
id: `app-${app.id}`,
title: app.name,
description: `${app.category} application`,
type: 'app' as const,
icon: app.icon,
category: app.category,
action: () => {
}
}));
}, [apps, query]);

const fileResults = useMemo(() => {
if (!query.trim()) return [];

return files
.filter(file => 
file.name.toLowerCase().includes(query.toLowerCase()) ||
(file.content && file.content.toLowerCase().includes(query.toLowerCase()))
)
.slice(0, 10)
.map(file => ({
id: `file-${file.id}`,
title: file.name,
description: `${file.type === 'folder' ? 'Folder' : 'File'} in ${file.parentId || 'Root'}`,
type: file.type === 'folder' ? 'folder' as const : 'file' as const,
icon: file.icon || (file.type === 'folder' ? '📁' : '📄'),
action: () => {
}
}));
}, [files, query]);

useEffect(() => {
if (!query.trim()) {
setWebResults([]);
return;
}

const mockWebResults: SearchResult[] = [
{
id: `web-${query}`,
title: `Search "${query}" on the web`,
description: 'Open browser and search for this term',
type: 'web',
icon: '🌐',
action: () => {
}
}
];

setWebResults(mockWebResults);
}, [query]);

const allResults = useMemo(() => {
const combined = [...appResults, ...fileResults, ...webResults];

return combined.sort((a, b) => {
const aExact = a.title.toLowerCase() === query.toLowerCase();
const bExact = b.title.toLowerCase() === query.toLowerCase();

if (aExact && !bExact) return -1;
if (!aExact && bExact) return 1;

const aStarts = a.title.toLowerCase().startsWith(query.toLowerCase());
const bStarts = b.title.toLowerCase().startsWith(query.toLowerCase());

if (aStarts && !bStarts) return -1;
if (!aStarts && bStarts) return 1;

return a.title.localeCompare(b.title);
});
}, [appResults, fileResults, webResults, query]);

return {
results: allResults,
hasResults: allResults.length > 0,
appResults,
fileResults,
webResults
};
};