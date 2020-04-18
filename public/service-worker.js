
const FILEST_TO_CACHE = [
"/","/index.html","index.js","/db.js","/style.css"
];

self.addEventListener('install', function(event) {

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});