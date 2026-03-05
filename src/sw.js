/* Basic Service Worker for Offline Mode */
const CACHE_NAME = 'tricube-v1';

self.addEventListener('install', (e) => self.skipWaiting());

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((resp) => resp || fetch(event.request))
    );
});
