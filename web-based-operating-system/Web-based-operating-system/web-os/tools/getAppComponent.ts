import { lazy } from 'react';
import apps from '../data/apps';

const cache: Record<string, ReturnType<typeof lazy>> = {};

export function getAppComponent(appId: string) {
if (!cache[appId] && apps[appId as keyof typeof apps]) {
cache[appId] = lazy(apps[appId as keyof typeof apps]);
}
return cache[appId];
}

export function clearAppCache() {
Object.keys(cache).forEach(key => delete cache[key]);
}