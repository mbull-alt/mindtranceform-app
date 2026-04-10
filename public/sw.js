const CACHE = 'mt-v1';
const SHELL = ['/', '/index.html'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Don't intercept API calls or Supabase requests
  if (
    url.hostname.includes('supabase') ||
    url.hostname.includes('onrender.com') ||
    url.hostname.includes('stripe') ||
    url.hostname.includes('elevenlabs') ||
    url.hostname.includes('openai') ||
    e.request.method !== 'GET'
  ) return;

  e.respondWith(
    fetch(e.request)
      .then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(e.request).then(cached => cached || caches.match('/index.html'))
      )
  );
});
