const FILES_TO_CACHE = [
  "/","/index.html","index.js","/db.js","/style.css"]
const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";


self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Your files were pre-cached successfully!");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});
//activation of service worker
elf.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(keyList =>  {
      return Promise.all(
        keyList.map(key =>  {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("deleting old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// fetch
self.addEventListener("fetch", event => {
  if(evt.request.url.includes('/api/')) {
      console.log('[Service Worker] Fetch(data)', event.request.url);
  
evt.respondWith(
              caches.open(DATA_CACHE_NAME).then(cache => {
              return fetch(event.request)
              .then(response => {
                  if (response.status === 200){
                      cache.put(event.request.url, response.clone());
                  }
                  return response;
              })
              .catch(err => {
                  return cache.match(evt.request);
              });
          })
          );
          return;
      }
//response to service worker
event.respondWith(
  caches.open(CACHE_NAME).then( cache => {
    return cache.match(event.request).then(response => {
      return response || fetch(event.request);
    });
  })
);
});


