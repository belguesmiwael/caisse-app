// sw.js — CaisseApp TN Service Worker
// Offline-first strategy: cache static assets, background sync for sales

const CACHE_NAME = 'caisseapp-tn-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// ── INSTALL ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ── ACTIVATE ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── FETCH — Cache First for static, Network First for Firebase ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Firebase requests — network first, no cache
  if (url.hostname.includes('firestore.googleapis.com') ||
      url.hostname.includes('firebase') ||
      url.hostname.includes('googleapis.com')) {
    event.respondWith(
      fetch(event.request).catch(() => new Response('{}', {headers:{'Content-Type':'application/json'}}))
    );
    return;
  }

  // Static assets — cache first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => caches.match('/index.html'));
    })
  );
});

// ── BACKGROUND SYNC — Offline sales ──
self.addEventListener('sync', event => {
  if (event.tag === 'sync-sales') {
    event.waitUntil(syncPendingSales());
  }
});

async function syncPendingSales() {
  const db = await openIDB();
  const pending = await getAllPending(db);
  for (const sale of pending) {
    try {
      await fetch('/api/sales', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(sale)
      });
      await deletePending(db, sale.id);
    } catch(e) {}
  }
}

// Minimal IndexedDB helpers for offline queue
function openIDB() {
  return new Promise((res, rej) => {
    const req = indexedDB.open('caisseapp-offline', 1);
    req.onupgradeneeded = e => e.target.result.createObjectStore('pending', {keyPath:'id',autoIncrement:true});
    req.onsuccess = e => res(e.target.result);
    req.onerror = rej;
  });
}
function getAllPending(db) {
  return new Promise(res => {
    const tx = db.transaction('pending','readonly');
    const req = tx.objectStore('pending').getAll();
    req.onsuccess = () => res(req.result);
  });
}
function deletePending(db, id) {
  return new Promise(res => {
    const tx = db.transaction('pending','readwrite');
    tx.objectStore('pending').delete(id);
    tx.oncomplete = res;
  });
}
