const CACHE_NAME = 'psychosuite-v8'; // Увеличена версия для принудительного обновления
const urlsToCache = [
  './',
  './index.html',
  './index.js',
  './sw-register.js',
  './manifest.json',
  // Важные внешние зависимости для полного офлайн-режима
  'https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js',
  'https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js',
  'https://esm.sh/@google/genai',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', event => {
  // Выполняем установку
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Добавляем все необходимые файлы в кэш
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    // Ищем запрос в кэше
    caches.match(event.request)
      .then(response => {
        // Если ресурс есть в кэше, возвращаем его
        if (response) {
          return response;
        }
        // Если ресурса нет в кэше, идем в сеть
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        // Удаляем старые версии кэша
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});