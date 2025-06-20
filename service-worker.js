const CACHE_VERSION = 'v3'; 
const CACHE_NAME = `offline-cache-${CACHE_VERSION}`;
const OFFLINE_URLS = [
    '/offline.html',
    '/stylePAG.css'
];


self.addEventListener("install", (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_URLS))
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key.startsWith('offline-cache-') && key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    if (event.request.mode === "navigate") {
        event.respondWith(
            fetch(event.request).catch(() =>
                caches.open(CACHE_NAME).then(cache =>
                    cache.match('/offline.html')
                )
            )
        );
    }
});
