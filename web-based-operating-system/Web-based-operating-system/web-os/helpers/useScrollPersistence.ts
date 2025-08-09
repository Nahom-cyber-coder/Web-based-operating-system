import { useEffect, useRef } from 'react';

export const useScrollPersistence = (appId: string) => {
const scrollRef = useRef<HTMLDivElement>(null);
const storageKey = `scroll-${appId}`;

useEffect(() => {
const savedScroll = localStorage.getItem(storageKey);
if (scrollRef.current && savedScroll) {
scrollRef.current.scrollTop = parseInt(savedScroll, 10);
}

return () => {
if (scrollRef.current) {
localStorage.setItem(storageKey, scrollRef.current.scrollTop.toString());
}
};
}, [storageKey]);

useEffect(() => {
const element = scrollRef.current;
if (!element) return;

const handleScroll = () => {
localStorage.setItem(storageKey, element.scrollTop.toString());
};

element.addEventListener('scroll', handleScroll, { passive: true });
return () => element.removeEventListener('scroll', handleScroll);
}, [storageKey]);

return scrollRef;
};