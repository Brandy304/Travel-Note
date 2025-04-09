/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'travel-note-v3';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/js/main.chunk.js',
  '/static/css/main.chunk.css',
  '/offline.html'
];

// Install phase - Precaching critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()) // Force activate new SW
  );
});

// Activation phase - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => key !== CACHE_NAME && caches.delete(key))
      );
    })
    .then(() => self.clients.claim()) // Control all pages
  );
});

// Fetch interception - Network-first strategy
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
  
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache successful responses
          const clone = response.clone();
          return caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, clone))
            .then(() => response);  // Return original response
        })
        .catch(() => {
          // Fallback to cache when offline
          return caches.match(event.request)
            .then(cached => cached || caches.match('/offline.html'));
        })
    );
  });