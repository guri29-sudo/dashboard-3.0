self.addEventListener('push', function (event) {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Personal Assistant';
    const options = {
        body: data.message || 'You have a new productivity insight!',
        icon: '/vite.svg',
        badge: '/vite.svg',
        data: {
            url: self.location.origin
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
