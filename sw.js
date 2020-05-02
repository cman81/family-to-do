var cacheName = 'honeydo-pwa-v2';
var filesToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/**
 * Serve cached content when offline
 * @see https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#network-falling-back-to-cache
 */
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});
