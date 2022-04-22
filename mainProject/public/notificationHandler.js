let reg;
window.onload = async () => {
reg = await navigator.serviceWorker.getRegistration();
Notification.requestPermission().then(permission => {
    if (permission == "granted")
    {
        for (let reminder of passedReminders)
        {
            if (reminder.frequency == "oneTime")
            {
                let currentTime = new Date();   
                let reminderDate = reminder.dateNotified.split('-');             
                if (reminderDate[0] == currentTime.getFullYear() && reminderDate[1] == currentTime.getMonth()+1 && reminderDate[2] == currentTime.getDate())
                {
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
                let dayArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                let currentTime = new Date();
                let dayIndex = currentTime.getDay();
                if(reminder.daysRepeated.find(d=> d === dayArray[dayIndex]))
                {
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

function setUpReminder(reminder) {
    let year = new Date().getFullYear();
    let month = new Date().getMonth()+1;
    let day = new Date().getDate();
    console.log()
    console.log(month + "-" + day + "-" + year + " " + reminder.timeNotified + ":00");
    console.log(new Date().getTime());
    console.log(new Date(month + "-" + day + "-" + year + " " + reminder.timeNotified + ":00").getTime());
    reg.showNotification(reminder.name,
    {
        tag: reminder.id,
        showTrigger: new TimestampTrigger(new Date(month + "-" + day + "-" + year + " " + reminder.timeNotified + ":00").getTime()),
        data: {
            url: "/reminders/"+reminder.id
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