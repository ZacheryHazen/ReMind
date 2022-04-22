self.addEventListener('install', event => console.log('ServiceWorker installed'));
self.addEventListener('notificationclick', event => {
    if (event.action == 'open')
    {
        self.clients.openWindow(event.notification.data.url);
    }
    else if (event.action == 'close')
    {
        event.notification.close();
    }
});