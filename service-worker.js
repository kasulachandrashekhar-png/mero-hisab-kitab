const CACHE_NAME = 'merohisab-v2'; // क्यासको नाम परिवर्तन गरियो
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // क्यास फेल नहोस् भनेर एउटा-एउटा फाइल थप्ने (error handling)
      return Promise.allSettled(
        ASSETS.map(url => cache.add(url).catch(err => console.warn(`Cache add failed for ${url}`, err)))
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // क्यासमा छ भने दिने, नत्र इन्टरनेटबाट ल्याउने
      return response || fetch(event.request).catch(() => {
        // इन्टरनेट नहुँदा index.html देखाउने
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});