// This file handles notification events, such as open and close. Upon the open event, the user is directed to the corresponding reminder's edit page, on close the notification is closed.

// Displays a message whenever the Service Worker is installed.
self.addEventListener('install', event => console.log('ServiceWorker installed'));
self.addEventListener('notificationclick', event => {
    // If the 'View Notification' button is clicked, it first checks if a tab is open on the site, if so it redirects to that tab and navigates to the URL of the reminder.
    if (event.action == 'open')
    {
        event.waitUntil(clients.matchAll({ type: 'window' }).then(clientsArr => {
            let window = clientsArr.find(windowClient => windowClient.url.includes('http://localhost:3000'));
            if (!!window)
            {
                window.focus();
                window.navigate(event.notification.data.url);
            }
            else
            {
                // If there is no tab open for the Re-Mind site it opens a new window and navigates to the URL of the reminder. 
                self.clients.openWindow(event.notification.data.url);
            }
        }));
        
    }
    else if (event.action == 'close')
    {
        // Closes the notification if 'Close' is clicked.
        event.notification.close();
    }
});