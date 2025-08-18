const CACHE_NAME = 'your-dealership-cache-v1';
const urlsToCache = [
  '/',
  '/offline.html' // A fallback page for when the user is offline
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // If the request fails (e.g., user is offline),
          // and the request is for a navigation, show the offline page.
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });
      })
  );
});
