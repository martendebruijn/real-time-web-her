const staticCacheName = 'site-static-v1';
const dynamicCache = 'site-dynamic-v1';
const assets = ['/dist/all.js', '/dist/front.js', '/dist/styles.js'];

// install service worker
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      cache.addAll(assets);
    })
  );
});

// activate event
// self.addEventListener('activate', evt => {
//   evt.waitUntil(
//     caches.keys().then(keys => {
//       return Promise.all(keys
//         .filter(key => key !== staticCacheName && key !== dynamicCache)
//         .map(key => caches.delete(key))
//         )
//     })
//   )
// });

// // fetch events
// self.addEventListener('fetch', evt => {
//   evt.respondWith(
//     caches.match(evt.request).then(cacheRes => {
//       return cacheRes || fetch(evt.request).then(fetchRes => {
//         return caches.open(dynamicCache).then(cache => {
//           cache.put(evt.request.url, fetchRes.clone());
//           return fetchRes;
//         })
//       })
//     }).catch(() => caches.match('/fallback'))
//   );
// });
