// This file facilitates the creation of notifications as well as determines which reminder will get a notification.
// It is run on the load event of every signed-in Re-Mind page.

// reg is the registration for the ServiceWorker, which it retrieves from the navigator with getRegistration.
let reg;
window.onload = async () => {
reg = await navigator.serviceWorker.getRegistration();
// It then finds all notifications registered to this ServiceWorker and closes every notification registered to the ServiceWorker.
const notifications = await reg.getNotifications({
    includeTriggered: true
});
notifications.forEach(notification => notification.close());
// The below function dictates how to set up each reminder's notifications by checking each reminder's frequency and then detecting whether it will occur within the current day.
// A reminder's notification is only created if it will occur in the future on the current day, this allows Daily and Weekly reminders to not create infinite notifications on a schedule.
Notification.requestPermission().then(permission => {
    // Checks whether permission has been granted by the user, and if it is proceeds to check each reminder to create notifications.
    if (permission == "granted")
    {
        for (let reminder of passedReminders)
        {
            if (reminder.frequency == "oneTime")
            {
                // If it is a one time reminder, it first checks if the current date is the date on which the reminder is set.
                let currentTime = new Date();   
                let reminderDate = reminder.dateNotified.split('-');             
                if (reminderDate[0] == currentTime.getFullYear() && reminderDate[1] == currentTime.getMonth()+1 && reminderDate[2] == currentTime.getDate())
                {
                    // It then determines if the set time is past the current hour, and if not then if the set time is within the same hour but ahead in minutes.
                    // If so, it calls setUpReminder to finalize notification creation.
                    let hourAndMin = reminder.timeNotified.split(":");
                    if (hourAndMin[0] > currentTime.getHours())
                    {
                        setUpReminder(reminder);
                    }
                    else if (hourAndMin[0] == currentTime.getHours() && hourAndMin[1] > currentTime.getMinutes())
                    {
                        setUpReminder(reminder);
                    }
                }
            }
            else if (reminder.frequency == "Daily")
            {
                // If it is a daily reminder, it determines if the set time is past the current hour, and if not then if the set time is within the same hour but ahead in minutes.
                // If so, it calls setUpReminder to finalize notification creation.
                let currentTime = new Date();
                let hourAndMin = reminder.timeNotified.split(":");
                if (hourAndMin[0] > currentTime.getHours())
                {
                    setUpReminder(reminder);
                }
                else if (hourAndMin[0] == currentTime.getHours() && hourAndMin[1] > currentTime.getMinutes())
                {
                    setUpReminder(reminder);
                } 
            }
            else if (reminder.frequency == "Weekly")
            {
                // If it is a weekly reminder, it first determines if the current day is included in the set days for the reminder's occurrence.
                let dayArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                let currentTime = new Date();
                let dayIndex = currentTime.getDay();
                if(reminder.daysRepeated.find(d=> d === dayArray[dayIndex]))
                {
                    // If it is, then it determines if the set time is past the current hour, and if not then if the set time is within the same hour but ahead in minutes.
                    // If so, it calls setUpReminder to finalize notification creation.
                    let hourAndMin = reminder.timeNotified.split(":");
                    if (hourAndMin[0] > currentTime.getHours())
                    {
                        setUpReminder(reminder);
                    }
                    else if (hourAndMin[0] == currentTime.getHours() && hourAndMin[1] > currentTime.getMinutes())
                    {
                        setUpReminder(reminder);
                    }
                }
            }
        }
    }
})
};

// The below function takes in a reminder and initializes a notification for the reminder's occurrence via the ServiceWorker.
function setUpReminder(reminder) {
    let year = new Date().getFullYear();
    let month = new Date().getMonth()+1;
    let day = new Date().getDate();
    // It sets the name to be the reminder's name, tag to be the reminder's ID, the URL to be the reminder's edit/view URL, and gives the notification two buttons: 'View Reminder' and 'Close', both of which are handled in notification.js.
    reg.showNotification(reminder.name,
    {
        tag: reminder.reminderID,
        showTrigger: new TimestampTrigger(new Date(month + "-" + day + "-" + year + " " + reminder.timeNotified + ":00").getTime()),
        data: {
            url: "/reminders/"+reminder.reminderID
        },
        actions: [
        {
            action: 'open',
            title: 'View Reminder'
        },
        {
          action: 'close',
          title: 'Close'
        }]
    })
}