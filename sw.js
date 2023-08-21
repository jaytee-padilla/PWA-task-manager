const addResourcesToCache = async (resources) => {
  // create a new cache called "v1"
  const cache = await caches.open('v1');

  // add to cache via array of URLs to resources (note - URLs are based on origin location, NOT FILE LOCATION e.g. jayteePadilla.com/js/idbFunctions.js)
  await cache.addAll(resources);
};

self.addEventListener('install', (event) => {
  // .waitUntil() ensures the service worker will not install UNTIL the code inside .waitUntil() successfully finishes its job
  event.waitUntil(
    addResourcesToCache([
      '/',
      '/index.html',
      '/index.css',
      '/script.js',
      '/manifest.json',
      '/js/idbFunctions.js',
      '/js/taskSeeds.js',
      '/images/web/apple-touch-icon.png',
      '/images/web/icon-192.png',
      '/images/web/icon-512.png',
      '/images/web/icon-192-maskable.png',
      '/images/web/icon-512-maskable.png',
      '/images/web/favicon.ico',
      'https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css',
      'https://fonts.googleapis.com/icon?family=Material+Icons',
      'https://fonts.gstatic.com/s/materialicons/v140/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2'
    ])
  );
});

// fetch event fires every time any resource controlled by a service worker is fetched
self.addEventListener('fetch', (event) => {
  // .respondWith() hijacks HTTP responses and updates them with our own content
  // caches.match() allows us to match each resource requested from the network with the equivalent resource available in the cache, if there is a matching one available. The matching is done via URL and various headers, just like with normal HTTP requests
  // e.g. if the requested url is '/index.html', grab the '/index.html' URL in our service worker's cache and respond with that

  event.respondWith(caches.match(event.request));
});