const CACHE_NAME = "revizz-v1";
const CACHE_PREFIX = "revizz-";
const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./quiz-data.js",
  "./manifest.json",
  "./assets/icons/icon-rz-192.png",
  "./assets/icons/icon-rz-512.png",
];

// INSTALLATION
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Ecoute d'un message venant du script principal pour forcer l'activation
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// ACTIVATION
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(
              (name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME,
            )
            .map((name) => caches.delete(name)),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// FETCH
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // Navigation : réseau prioritaire, cache en secours
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put("./index.html", response.clone());
          }

          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);

          return (await cache.match("./index.html")) || Response.error();
        }),
    );

    return;
  }

  // Ressources statiques : Stale-While-Revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(request);

      const networkPromise = fetch(request).then((response) => {
        if (response.ok && response.type === "basic") {
          cache.put(request, response.clone());
        }
        return response;
      });

      if (cachedResponse) {
        event.waitUntil(networkPromise.catch(() => {}));
        return cachedResponse;
      }

      return networkPromise.catch(async () => {
        return (await cache.match(request)) || Response.error();
      });
    }),
  );
});
