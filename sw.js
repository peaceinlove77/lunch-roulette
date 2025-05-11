const CACHE_NAME = "lunch-roulette-v1";
const ASSETS = [
  "./",
  "index.html",
  "manifest.json",
  "icon.png",
  "og_image.png"
];

// 설치-시 정적 자산 캐싱
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 활성화-시 이전 캐시 정리
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 네트워크 → 캐시 로드 실패 시 캐시 제공
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const cloned = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, cloned));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
