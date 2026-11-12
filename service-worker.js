const CACHE_NAME = "revizz-v1";
const CACHE_PREFIX = "revizz-";
const STATIC_ASSETS = [
  // ou urlsToCache
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
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }),
  );
});

// MESSAGE : activation à la demande
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING" && event.source?.id) {
    event.waitUntil(self.skipWaiting());
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

// FETCH : stratégie Stale-While-Revalidate unifiée
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  const isNavigate = request.mode === "navigate";

  const isStatic = STATIC_ASSETS.some((asset) => {
    const assetURL = new URL(asset, self.registration.scope).pathname;
    return url.pathname === assetURL;
  });

  if (!isNavigate && !isStatic) {
    return;
  }

  const cachePromise = caches.open(CACHE_NAME);

  // Mise à jour réseau en arrière-plan
  const fetchPromise = cachePromise.then(async (cache) => {
    const response = await fetch(request);

    if (response.ok && response.type === "basic") {
      try {
        await cache.put(request, response.clone());
      } catch (error) {
        // Un échec de mise en cache ne bloque pas la réponse réseau.
      }
    }

    return response;
  });

  // Le navigateur doit attendre la fin de la mise à jour du cache.
  event.waitUntil(fetchPromise.catch(() => {}));

  event.respondWith(
    (async () => {
      const cache = await cachePromise;
      const cachedResponse = await cache.match(request);

      // Si la ressource est en cache, on la sert immédiatement.
      if (cachedResponse) {
        return cachedResponse;
      }

      // Sinon, on attend la réponse réseau
      try {
        return await fetchPromise;
      } catch (error) {
        // Secours hors ligne pour les navigations
        if (isNavigate) {
          const fallback = await cache.match(
            new URL("./index.html", self.registration.scope).href,
          );

          if (fallback) return fallback;
        }

        return Response.error();
      }
    })(),
  );
});
