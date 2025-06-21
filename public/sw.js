const CACHE_NAME = 'nexusshop-v2';
const STATIC_CACHE = 'nexusshop-static-v2';
const DYNAMIC_CACHE = 'nexusshop-dynamic-v2';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/favicon.ico',
    '/apple-touch-icon.png',
    '/logo.png',
    '/logo.svg',
    '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Precaching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache when possible, with network fallback
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // For build assets, use a cache-first strategy.
    if (request.url.includes('/build/')) {
        event.respondWith(
            caches.match(request).then(cachedResponse => {
                return cachedResponse || fetch(request).then(networkResponse => {
                    if (networkResponse.ok) {
                        const responseToCache = networkResponse.clone();
                        caches.open(STATIC_CACHE).then(cache => {
                            cache.put(request, responseToCache);
                        });
                    }
                    return networkResponse;
                }).catch(error => {
                    console.error('Fetching build asset failed:', error);
                    // Return a 404 or a fallback if needed
                })
            })
        );
        return;
    }
    
    // For other requests (API, etc.), use network-first strategy.
    event.respondWith(
        fetch(request)
            .then((networkResponse) => {
                if (networkResponse.ok) {
                    const responseToCache = networkResponse.clone();
                    caches.open(DYNAMIC_CACHE).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // If network fails, try to get it from the cache.
                return caches.match(request).then(cachedResponse => {
                    return cachedResponse || Promise.resolve(new Response(null, { status: 404 }));
                });
            })
    );
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    // Handle any pending requests when connection is restored
    console.log('Background sync triggered');
} 