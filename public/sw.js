// Custom Service Worker for Push Notifications
// Precache manifest placeholder
self.__WB_MANIFEST;

self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.message || data.body,
      icon: '/logo.png',
      badge: '/favicon.svg',
      vibrate: [200, 100, 200],
      tag: data.type || 'notification',
      requireInteraction: data.type === 'match' || data.type === 'prize',
      data: {
        url: data.url || '/',
        type: data.type
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    console.error('Error showing notification:', error);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window if none found
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync for offline notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-notifications') {
    event.waitUntil(syncNotifications());
  }
});

async function syncNotifications() {
  // Placeholder for syncing notifications when back online
  console.log('Syncing notifications...');
}
