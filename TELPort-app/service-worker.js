const cacheName = "TELPort-test-v21";
const cacheFiles = [
    "style.css",
    "telport-logo-6-192x192-ios.png",
    "telport-logo-6-192x192.png",
    "telport-logo-6-512x512.png",
    "telport-logo-6-192x192-maskable.png",
    "telport-logo-6-512x512-maskable.png",
    "index.html",
    "scroll-canceler.js",
    "service-worker.js",
    "modal-manager.js",
    "src.js",
    "button-call-ja.svg",
    "button-listen-ja.svg",
    "button-selector-empty-ja.svg",
    "button-selector-fulfilled-ja.svg",
    "button-ok.svg",
];

self.addEventListener('install', event => {
    console.log('[Service Worker] Install');
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log(`[Service Worker] Caching all: app shell and content`);
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener('fetch', event => {
    console.log('[Service Worker] Fetch');
    event.respondWith(
        caches.match(event.request).then(resource => {
            console.log(`[Service Worker] Fetching resource: ${event.request.url}`);
            return resource || fetch(event.request).then(async response => {
                return caches.open(cacheName).then(cache => {
                    console.log(`[Service Worker] Caching new resource: ${event.request.url}`);
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        }),
    );
});
    
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activate');
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key != cacheName) {
                        console.log(`[Service Worker] Deleting Cache: ${key}`)
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});