const cacheName = "TELPort-test-v27";
const cacheFiles = [
    "/TELPort-app/",
    "/TELPort-app/telport-logo-6-192x192-ios.png",
    "/TELPort-app/telport-logo-6-192x192.png",
    "/TELPort-app/telport-logo-6-512x512.png",
    "/TELPort-app/telport-logo-6-192x192-maskable.png",
    "/TELPort-app/telport-logo-6-512x512-maskable.png",
    "/TELPort-app/index.html",
    "/TELPort-app/style.css",
    "/TELPort-app/elements-manager.js",
    "/TELPort-app/scroll-canceler.js",
    "/TELPort-app/src.js",
    "/TELPort-app/button-call-auto-threshold.svg",
    "/TELPort-app/button-call-ja.svg",
    "/TELPort-app/button-call-play.svg",
    "/TELPort-app/button-call-stop.svg",
    "/TELPort-app/button-listen-ja.svg",
    "/TELPort-app/button-listen-auto-threshold.svg",
    "/TELPort-app/button-selector-empty-ja.svg",
    "/TELPort-app/button-selector-fulfilled-ja.svg",
    "/TELPort-app/button-listen-auto-threshold.svg",
    "/TELPort-app/Inter-VariableFont_slnt,wght.ttf",
];

console.log(`[Service Worker] cacheName: ${cacheName}`);

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
    console.log('[Service Worker] Fetch');00
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
