const CACHE_NAME = 'tt-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/js/app.js',
  'https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
