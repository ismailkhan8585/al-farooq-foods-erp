// Service Worker for AL FAROOQ FOODS - 100% Offline PWA
const CACHE_NAME = 'al-farooq-foods-v3'
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.webmanifest',
  '/al-farooq-foods-logo.png',
  '/icon-light-32x32.png',
  '/apple-icon.png',
  '/icon.svg',
  '/products/prod-1.svg',
  '/products/prod-2.svg',
  '/products/prod-3.svg',
  '/products/prod-4.svg',
  '/products/prod-5.svg',
  '/products/prod-6.svg',
  '/products/prod-7.svg',
  '/products/prod-8.svg',
  '/products/prod-9.svg',
  '/products/prod-10.svg',
  '/products/prod-11.svg',
  '/categories/cat-1.svg',
  '/categories/cat-2.svg',
  '/categories/cat-3.svg',
  '/categories/cat-4.svg',
  '/categories/cat-5.svg',
  '/categories/cat-6.svg',
  '/categories/cat-7.svg',
  '/raw-materials/raw-1.jpg',
  '/raw-materials/raw-2.jpg',
  '/raw-materials/raw-3.jpg',
  '/raw-materials/raw-4.jpg',
  '/raw-materials/raw-5.jpg',
  '/raw-materials/raw-6.jpg',
  '/raw-materials/raw-7.jpg',
  '/raw-materials/raw-8.jpg',
  '/raw-materials/raw-9.jpg',
  '/raw-materials/raw-10.jpg',
  '/raw-materials/raw-11.jpg',
  '/raw-materials/raw-12.jpg',
  '/raw-materials/raw-13.jpg',
  '/raw-materials/raw-14.jpg',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {})
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    })
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  
  const url = new URL(event.request.url)
  // Do not intercept or cache Next.js internal chunks, dev resources, or API routes
  if (url.pathname.startsWith('/_next') || url.pathname.startsWith('/api') || url.pathname.includes('webpack') || url.pathname.includes('hot-update')) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone()
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone)
              })
            }
          })
          .catch(() => {})
        return cachedResponse
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse
          }
          const responseClone = networkResponse.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
          return networkResponse
        })
        .catch(() => {
          // If offline and request is for page navigation, return cached root
          if (event.request.mode === 'navigate') {
            return caches.match('/')
          }
          return new Response('Offline', { status: 503, statusText: 'Offline' })
        })
    })
  )
})
