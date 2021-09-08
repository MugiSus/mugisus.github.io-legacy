const cacheName = "TELPort-test-v4";
const cacheFiles = [
    "style.css",
    "telport-logo-6-192x192-ios.png",
    "telport-logo-6-192x192.png",
    "telport-logo-6-512x512.png",
    "index.html",
    "src.js",
    "sw.js",
    "telport-logo-6-192x192-maskable.png",
    "telport-logo-6-512x512-maskable.png"
];

self.addEventListener('fetch', (event) => {
    console.log(`[Service Worker] Fetched resource ${event.request.url}`);
})

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Install');
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log(`[Service Worker] Caching all: app shell and content`);
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activate');
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (key != cacheName) {
                    console.log(`[Service Worker] Deleting Cache: ${key}`)
                    return caches.delete(key);
                }
            }));
        })
    );
});