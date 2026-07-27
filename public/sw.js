const CACHE_NAME = 'hoa-fuma-v1';
const STATIC_ASSETS = [
  '/',
  '/icons/favicon-light.png',
  '/icons/favicon-dark.png',
  '/apple-icon.png',
];

const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>离线模式 - hoa.moe</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      text-align: center;
      background-color: #09090b;
      color: #f4f4f5;
    }
    h1 { margin-bottom: 12px; font-size: 2rem; font-weight: 700; }
    p { color: #a1a1aa; max-width: 480px; margin-bottom: 24px; line-height: 1.6; }
    button {
      background-color: #27272a;
      color: #f4f4f5;
      border: 1px solid #3f3f46;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s ease;
    }
    button:hover { background-color: #3f3f46; }
  </style>
</head>
<body>
  <h1>当前处于离线状态</h1>
  <p>您当前未连接到互联网。已缓存的内容可继续浏览，请在恢复网络连接后刷新页面。</p>
  <button onclick="window.location.reload()">重新加载</button>
</body>
</html>`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS).catch((err) => {
          console.warn('[SW] Pre-caching static assets failed:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log('[SW] Clearing legacy cache:', cache);
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests or non-http(s) schemes (e.g. extension schemes)
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Skip HMR / development socket requests
  if (
    url.pathname.includes('/_next/webpack-hmr') ||
    url.pathname.includes('/__nextjs')
  ) {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(request);

      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (networkResponse.type === 'basic' || networkResponse.type === 'cors')
          ) {
            cache.put(request, networkResponse.clone()).catch((err) => {
              console.warn('[SW] Failed to put response into cache:', err);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (request.mode === 'navigate') {
            return new Response(OFFLINE_HTML, {
              headers: { 'Content-Type': 'text/html; charset=utf-8' },
            });
          }
          return new Response('Network error', {
            status: 503,
            statusText: 'Service Unavailable',
          });
        });

      // Stale-While-Revalidate: return cached asset immediately if present, otherwise await fetch
      return cachedResponse || fetchPromise;
    })()
  );
});
