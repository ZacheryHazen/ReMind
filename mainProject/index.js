const path = require('path');
const EventSource = require('eventsource');
const express = require('express');
const app = express();
const https = require('https');
const methodOverride = require('method-override');
const port = 3000;
const fs = require('fs');
const key = fs.readFileSync('cert/localhost-key.pem', 'utf-8');
const cert = fs.readFileSync('cert/localhost.pem', 'utf-8');
var multer = require('multer');
var upload = multer();
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: true}));


app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
//app.use(express.json());

//var bodyParser = require('body-parser');
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true })); 

//app.use(upload.array()); 
//app.use(express.static('public'));
let lists = [
    {
        id: 1,
        name: "Pizzas 1",
        items: [ ["pepperoni", true], ["cheese", true], ["supreme", false], ["meat lovers", true], ["hawaiian", true], ["pepperoni", true], ["cheese", true], ["hawaiian", true], ["supreme", true], ["meat lovers", true] ],
        isDeleted: false
    },
    {
        id: 2,
        name: "Pizzas 2",
        items: [ ["pepperoni", false], ["supreme", false], ["meat lovers", false], ["hawaiian", false], ["cheese", false], ["pepperoni", false], ["cheese", false], ["hawaiian", false], ["supreme", false], ["meat lovers", false] ],
        isDeleted: false
    },
    {
        id: 3,
        name: "Pizzas 3",
        items: [ ["pepperoni", false], ["cheese", false], ["meat lovers", false], ["hawaiian", false] ],
        isDeleted: false
    },
    {
        id: 4,
        name: "Pizzas 4",
        items: [ ["pepperoni", true], ["cheese", true], ["supreme", true], ["hawaiian", true], ["meat lovers", true], ["pepperoni", true], ["cheese", true], ["hawaiian", true], ["supreme", true], ["meat lovers", true], ["fish", true] ],
        isDeleted: false
    },
    {
        id: 5,
        name: "Pizzas 5",
        items: [ ["cheese", false], ["supreme", false], ["meat lovers", false], ["hawaiian", false] ],
        isDeleted: true
    },
    {
        id: 6,
        name: "Pizzas 6",
        items: [ ["pepperoni", true], ["cheese", true], ["hawaiian", true], ["supreme", true], ["meat lovers", true], ["pepperoni", true], ["cheese", true], ["hawaiian", true], ["supreme", true], ["meat lovers", true] ],
        isDeleted: false
    },
    {
        id: 7,
        name: "Pizzas 7",
        items: [ ["pepperoni", false], ["cheese", false], ["hawaiian", false], ["supreme", true], ["meat lovers", false], ["double pizza", false], ["cheese", false], ["hawaiian", false], ["supreme", false], ["meat lovers", false] ],
        isDeleted: false
    }
];

let reminders = [
    {
        id: 1,
        name: "Dentist Appointment 1",
        frequency: "Weekly",
        daysRepeated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
        dateNotified: null,
        timeNotified: "12:17",
        description: "i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. ",
        createdOn: "2022-01-14 15:32:11",
        isDeleted: false
    },
    {
        id: 2,
        name: "Dentist Appointment 2",
        frequency: "Daily",
        daysRepeated: null,
        dateNotified: null,
        timeNotified: "12:17",
        description: "i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. ",
        createdOn: "2022-01-14 15:32:11",
        isDeleted: false
    },
    {
        id: 3,
        name: "Dentist Appointment 3",
        frequency: "oneTime",
        daysRepeated: null,
        dateNotified: "2023-03-14",
        timeNotified: "17:32",
        description: "i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. ",
        createdOn: "2022-01-14 15:32:11",
        isDeleted: true
    },
    {
        id: 4,
        name: "Dentist Appointment 4",
        frequency: "Daily",
        daysRepeated: null,
        dateNotified: null,
        timeNotified: "12:17",
        description: "i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. ",
        createdOn: "2022-01-14 15:32:11",
        isDeleted: false
    },
    {
        id: 5,
        name: "Dentist Appointment 5",
        frequency: "oneTime",
        daysRepeated: null,
        dateNotified: "2022-04-18",
        timeNotified: "12:17",
        description: "i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. ",
        createdOn: "2022-01-14 15:32:11",
        isDeleted: false
    },
    {
        id: 6,
        name: "Dentist Appointment 6",
        frequency: "oneTime",
        daysRepeated: null,
        dateNotified: "2022-04-05",
        timeNotified: "17:32",
        description: "i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. ",
        createdOn: "2022-01-14 15:32:11",
        isDeleted: false
    }
];

let reviews = [
    {
        id: 1,
        name: "dillons trip",
        type: "other",
        date: "2022-04-21",
        rating: 4,
        reminderID: null,
        description: "it was a great time going to dillons, love the store",
        isDeleted: false
    },
    {
        id: 2,
        name: null,
        type: "reminder",
        date: "2022-03-14",
        rating: 2,
        reminderID: 3,
        description: "it was a great time going to dillons, love the store",
        isDeleted: false
    },
    {
        id: 3,
        name: null,
        type: "day",
        date: "2022-04-21",
        rating: 3,
        reminderID: null,
        description: "it was a great time going to dillons, love the store",
        isDeleted: false
    },
    {
        id: 4,
        name: "dillons trip",
        type: "other",
        date: "2022-04-25",
        rating: 1,
        reminderID: null,
        description: "it was a great time going to dillons, love the store it was a great time going to dillons, love the store it was a great time going to dillons, love the store it was a great time going to dillons, love the store it was a great time going to dillons, love the store it was a great time going to dillons, love the store ",
        isDeleted: false
    },
    {
        id: 5,
        name: null,
        type: "reminder",
        date: "2022-04-21",
        rating: 2,
        reminderID: 4,
        description: "it was a great time going to dillons, love the store",
        isDeleted: false
    },
    {
        id: 6,
        name: null,
        type: "day",
        date: "2022-04-20",
        rating: 5,
        reminderID: null,
        description: "it was a great time going to dillons, love the store",
        isDeleted: false
    },
    {
        id: 7,
        name: null,
        type: "day",
        date: "2022-04-20",
        rating: 5,
        reminderID: null,
        description: "it was a great time going to dillons, love the store",
        isDeleted: false
    },
    {
        id: 8,
        name: null,
        type: "day",
        date: "2022-04-20",
        rating: 5,
        reminderID: null,
        description: "it was a great time going to dillons, love the store",
        isDeleted: false
    },
    {
        id: 9,
        name: null,
        type: "day",
        date: "2022-04-20",
        rating: 5,
        reminderID: null,
        description: "it was a great time going to dillons, love the store",
        isDeleted: false
    },
    {
        id: 10,
        name: null,
        type: "day",
        date: "2022-04-20",
        rating: 5,
        reminderID: null,
        description: "it was a great time going to dillons, love the store",
        isDeleted: false
    }
];

let customItemGroups = [
    {
        title: "group1",
        id: 1,
        items: [
            ["item1", false ],
            ["item2", false ],
            ["item3", false]]
    },
    {
        title: "group2",
        id: 2,
        items: [
            ["item4", false ],
            ["item5", false ],
            ["item6", false]]
    }
]

let username = "";
let password = "";

const server = https.createServer({key: key, cert: cert }, app);

server.listen(3000, () => { console.log('Server running on 3000') });

app.get('/', (req, res) => {
    res.render('signin.ejs');
});

app.get('/home', (req, res) => {
    let passedLists = lists.filter(list => list.isDeleted == false);
    // HEY MAN FILTER OUT APPROPRIATELY BACK HERE
    let passedReminders = reminders.filter(reminder => reminder.isDeleted == false);
    res.render('index.ejs', { passedLists, passedReminders });
});

app.post('/home', (req, res) => {
    const { inputUsername, inputPassword } = req.body;
    let passedLists = lists.filter(list => list.isDeleted == false);
    let passedReminders = reminders.filter(reminder => reminder.isDeleted == false);
    res.render('index.ejs', { passedLists, passedReminders });
});

app.get('/lists', (req, res) => {
    let passedReminders = reminders.filter(reminder => reminder.isDeleted == false);
    let passedLists = lists.filter(list => list.isDeleted == false);
    res.render('lists.ejs', { passedLists, passedReminders });
});

app.post('/lists', (req, res) => {
    let newId = Object.keys(lists).length + 1;
    let newName = Object.values(req.body)[0];
    let newValues = [];
    for (let counter = 1; counter < Object.values(req.body).length; counter++)
    {
        if (Object.values(req.body)[counter] != '')
        {
            newValues.push([(Object.values(req.body))[counter], false]);
        }
    }
    lists.push({ id: newId, name: newName, items: newValues, isDeleted: false});
    res.redirect("/lists");
});

app.get('/lists/add', (req, res) => {
    let passedReminders = reminders.filter(reminder => reminder.isDeleted == false);
    res.render('addList.ejs', { customItemGroups, passedReminders });
});

app.put('/lists/:id', (req, res) => {
    let id = parseInt(req.params.id);
    if (id != "notificationHandler.js")
    {
        let keys = Object.keys(req.body);
        let values = Object.values(req.body);
        let newValues = [];
        for (let counter = 0; counter < values.length; counter++)
        {
            if (values[counter] != '' && keys[counter].substring(0,4) == "text")
            {
                if (keys.find(x => x == "checkBox" + keys[counter].substring(4)) != undefined)
                {
                    let newValue = [ values[counter], true ];
                    newValues.push(newValue);
                }
                else
                {
                    let newValue = [ values[counter], false ];
                    newValues.push(newValue);
                }
            }
        }
        let listIndex = lists.indexOf(lists.find(l => l.id == id));
        lists[listIndex].items = newValues;
        res.redirect("/lists");
    }
});

app.get('/lists/:id', (req, res) => {
    let id = req.params.id;
    if (id != "notificationHandler.js")
    {
        let list = lists.find(l => l.id == id);
        let passedReminders = reminders.filter(reminder => reminder.isDeleted == false);
        res.render('viewEditList.ejs', { list, customItemGroups, passedReminders });
    }
});

app.delete('/lists/:id', (req, res) => {
    let id = parseInt(req.params.id);
    if (id != "notificationHandler.js")
    {
        let list = lists.find(l => l.id == id);
        list.isDeleted = true;
        res.redirect('/lists');
    }
})

app.get('/reminders', (req, res) => {
    let passedReminders = reminders.filter(reminder => reminder.isDeleted == false);
    res.render('reminders.ejs', { passedReminders });
});

app.get('/reminders/add', (req, res) => {
    let passedReminders = reminders.filter(reminder => reminder.isDeleted == false);
   res.render('addReminder.ejs', { passedReminders});     
});

app.post('/reminders', (req, res) => {
    let keys = Object.keys(req.body);
    let newId = Object.keys(reminders).length + 1;
    let newValue;
    let currentTime = new Date();
    let createdOn = (currentTime.getFullYear()+"-"+(currentTime.getMonth()+1)+"-"+currentTime.getDate()+" "+currentTime.getHours()+":"+currentTime.getMinutes()+":"+currentTime.getSeconds());
    if (req.body["frequencyRadio"] == "oneTime")
    {
        newValue = { id: newId, 
            name: req.body["reminderName"], 
            frequency: req.body["frequencyRadio"], 
            daysRepeated: null,
            dateNotified: req.body["datePicker"], 
            timeNotified: req.body["timePicker"], 
            description: req.body["reminderDescription"],
            createdOn: createdOn,
            isDeleted: false};
    }
    else
    {
        let days = [];
        if (req.body["frequencySelect"] != "Daily")
        {
            if (keys.find(x => x == "sundayCheckBox"))
            {
                days.push("Sun");
            }
            if (keys.find(x => x == "mondayCheckBox"))
            {
                days.push("Mon");
            }
            if (keys.find(x => x == "tuesdayCheckBox"))
            {
                days.push("Tue");
            }
            if (keys.find(x => x == "wednesdayCheckBox"))
            {
                days.push("Wed");
            }
            if (keys.find(x => x == "thursdayCheckBox"))
            {
                days.push("Thu");
            }
            if (keys.find(x => x == "fridayCheckBox"))
            {
                days.push("Fri");
            }
            if (keys.find(x => x == "saturdayCheckBox"))
            {
                days.push("Sat");
            }
            if (days.length == 7 && req.body["frequencySelect"] == "Weekly")
            {
                newValue = { id: newId,
                    name: req.body["reminderName"], 
                    frequency: "Daily",
                    daysRepeated: null,
                    dateNotified: null,
                    timeNotified: req.body["timePicker"], 
                    description: req.body["reminderDescription"],
                    createdOn: createdOn,
                    isDeleted: false};
            }
            else
            {
                newValue = { id: newId,
                    name: req.body["reminderName"], 
                    frequency: req.body["frequencySelect"], 
                    daysRepeated: days,
                    dateNotified: null,
                    timeNotified: req.body["timePicker"], 
                    description: req.body["reminderDescription"],
                    createdOn: createdOn,
                    isDeleted: false};
            }
        }
        else
        {
            newValue = { id: newId,
                name: req.body["reminderName"], 
                frequency: req.body["frequencySelect"], 
                daysRepeated: null,
                dateNotified: null,
                timeNotified: req.body["timePicker"], 
                description: req.body["reminderDescription"],
                createdOn: createdOn,
                isDeleted: false};
        }
        
    }
    reminders.push(newValue);
    res.redirect('/reminders');
});

app.get('/reminders/:id', (req, res) => {
    let id = req.params.id;
    if (id != "notificationHandler.js")
    {
        let reminder = reminders.find(r => r.id == id);
        let passedReminders = reminders.filter(reminder => reminder.isDeleted == false);
        res.render('editReminder.ejs', { reminder, passedReminders });
    }
});

app.put('/reminders/:id', (req, res) => {
    let id = parseInt(req.params.id);
    if (id != "notificationHandler.js")
    {
        let keys = Object.keys(req.body);
        let reminderIndex = reminders.indexOf(reminders.find(r => r.id == id));
        if (req.body["frequencyRadio"] == "oneTime")
        {
            reminders[reminderIndex].frequency = req.body["frequencyRadio"];
            reminders[reminderIndex].daysRepeated = null;
            reminders[reminderIndex].dateNotified = req.body["datePicker"];
            reminders[reminderIndex].timeNotified = req.body["timePicker"];
            reminders[reminderIndex].description = req.body["reminderDescription"];
        }
        else
        {
            let days = [];
            if (req.body["frequencySelect"] != "Daily")
            {
                if (keys.find(x => x == "sundayCheckBox"))
                {
                    days.push("Sun");
                }
                if (keys.find(x => x == "mondayCheckBox"))
                {
                    days.push("Mon");
                }
                if (keys.find(x => x == "tuesdayCheckBox"))
                {
                    days.push("Tue");
                }
                if (keys.find(x => x == "wednesdayCheckBox"))
                {
                    days.push("Wed");
                }
                if (keys.find(x => x == "thursdayCheckBox"))
                {
                    days.push("Thu");
                }
                if (keys.find(x => x == "fridayCheckBox"))
                {
                    days.push("Fri");
                }
                if (keys.find(x => x == "saturdayCheckBox"))
                {
                    days.push("Sat");
                }
                if (days.length == 7 && req.body["frequencySelect"] == "Weekly")
                {
                    reminders[reminderIndex].frequency = "Daily";
                    reminders[reminderIndex].daysRepeated = null;
                    reminders[reminderIndex].dateNotified = null;
                    reminders[reminderIndex].timeNotified = req.body["timePicker"];
                    reminders[reminderIndex].description = req.body["reminderDescription"];
                }
                else
                {
                    reminders[reminderIndex].frequency = req.body["frequencySelect"];
                    reminders[reminderIndex].daysRepeated = days;
                    reminders[reminderIndex].dateNotified = null;
                    reminders[reminderIndex].timeNotified = req.body["timePicker"];
                    reminders[reminderIndex].description = req.body["reminderDescription"];
                }
            }
            else
            {
                reminders[reminderIndex].frequency = req.body["frequencySelect"];
                reminders[reminderIndex].daysRepeated = null;
                reminders[reminderIndex].dateNotified = null;
                reminders[reminderIndex].timeNotified = req.body["timePicker"];
                reminders[reminderIndex].description = req.body["reminderDescription"];
            }        
        }
        res.redirect("/reminders");
    }
});

app.delete("/reminders/:id", (req, res) => {
    let id = parseInt(req.params.id);
    if (id != "notificationHandler.js")
    {
        let reminder = reminders.find(r => r.id == id);
        reminder.isDeleted = true;
        res.redirect('/reminders');
    }
})

app.post("/itemGroups", upload.none(), (req, res) => {
    let newId = Object.keys(customItemGroups).length + 1;
    let newTitle = Object.values(req.body)[0];
    let newValues = [];
    for (let counter = 1; counter < Object.values(req.body).length; counter++)
    {
        if (Object.values(req.body)[counter] != '')
        {
            newValues.push([(Object.values(req.body))[counter], false]);
        }
    }
    customItemGroups.push({ id: newId, title: newTitle, items: newValues });
    res.redirect('/lists');
})

app.get('/reviews', (req, res) => {
    let passedReviews = reviews.filter(r => r.isDeleted == false);
    let passedReminders = reminders.filter(reminder => reminder.isDeleted == false);
    let allReminders = reminders;
    res.render('reviews.ejs', { passedReviews, allReminders, passedReminders });
});

app.post('/reviews', (req, res) => {
    let newID = Object.keys(reviews).length + 1;
    if (req.body["type"] === "day")
    {
        let newReview = { 
            id: newID,
            name: null,
            type: "day",
            date: req.body["dayDatePicker"],
            rating: req.body["rating"],
            reminderID: null,
            description: req.body["dayReviewDescription"],
            isDeleted: false
        }
        reviews.push(newReview);
    }
    else if (req.body["type"] === "reminder")
    {
        let date = null;
        if (req.body["reminderDatePicker"] != "")
        {
            date = req.body["reminderDatePicker"];
        }
        let newReview = { 
            id: newID,
            name: null,
            type: "reminder",
            date: date,
            rating: req.body["rating"],
            reminderID: req.body["id"],
            description: req.body["reminderReviewDescription"],
            isDeleted: false
        }
        reviews.push(newReview);
    }
    else if (req.body["type"] === "other")
    {
        let newReview = { 
            id: newID,
            name: req.body["otherNameInput"],
            type: "other",
            date: req.body["otherDatePicker"],
            rating: req.body["rating"],
            reminderID: null,
            description: req.body["otherReviewDescription"],
            isDeleted: false
        }
        reviews.push(newReview);
    }
    res.redirect('/reviews');
})

app.get('/reviews/add', (req, res) => {
    let passedReminders = reminders.filter(reminder => reminder.isDeleted == false);
    let elapsedReminders = [];
    for (let reminder of passedReminders )
    {
        if (verifyIfReminderHasOccurred(reminder))
        {
            elapsedReminders.push(reminder);
        }
    }
    res.render('addReview.ejs', { elapsedReminders, passedReminders });
})

app.get('/reviews/:id', (req, res) => {
    let id = parseInt(req.params.id);
    if (id != "notificationHandler.js")
    {
        let review = reviews.find(r => r.id == id);
        let passedReminders = reminders.filter(reminder => reminder.isDeleted == false);
        res.render('viewEditReview.ejs', { review, passedReminders });
    }
})

app.get('/statistics', (req, res) => {
    let passedReminders = reminders.filter(reminder => reminder.isDeleted == false);
    let passedReviews = reviews.filter(r => r.isDeleted == false);
    let weekStatistics = findAllWeekStatistics(passedReviews);
    let dayStatistics = findAllDayStatistics(passedReviews);
    weekStatistics = sortWeekStatistics(weekStatistics);
    dayStatistics = sortDayStatistics(dayStatistics);
    res.render("statistics.ejs", { passedReviews, reminders, weekStatistics, dayStatistics, passedReminders });
})

function verifyIfReminderHasOccurred(reminder)
{
    if (reminder.frequency == "oneTime")
    {
        let dateParts = reminder.dateNotified.split('-');
        let timeParts = reminder.timeNotified.split(':');
        let setDate = new Date(dateParts[0], (dateParts[1]-1), dateParts[2], timeParts[0], timeParts[1]);
        if (new Date().getTime() > setDate.getTime())
        {
            return true;
        }
    }
    else if (reminder.frequency == "Daily")
    {
        let dateParts = reminder.createdOn.split(' ')[0].split('-');
        let timeParts = reminder.createdOn.split(' ')[1].split(':');
        creationDate = new Date(dateParts[0], (dateParts[1]-1), dateParts[2], timeParts[0], timeParts[1], timeParts[2]);
        if (new Date().getTime() > (creationDate.getTime() + (24*60*60*1000)))
        {   
            return true;
        }
        else
        {
            let setTimeParts = reminder.timeNotified.split(":");
            let checkDate = new Date(dateParts[0], dateParts[1]-1, dateParts[2], setTimeParts[0], setTimeParts[1])
            if (creationDate.getTime() < checkDate.getTime() && new Date().getTime() > checkDate.getTime())
            {
                return true;
            }
            else if (checkDate.getTime() + (24*60*60*1000) < new Date().getTime())
            {
                return true;
            }  
        }
    }
    else if (reminder.frequency == "Weekly")
    {
        let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let dateParts = reminder.createdOn.split(' ')[0].split('-');
        let timeParts = reminder.createdOn.split(' ')[1].split(':');
        creationDate = new Date(dateParts[0], (dateParts[1]-1), dateParts[2], timeParts[0], timeParts[1], timeParts[2]);
        if (new Date().getTime() > (creationDate.getTime() + (7*24*60*60*1000)))
        {   
            return true;
        }
        else if (reminder.daysRepeated.length == 1 && reminder.daysRepeated[0] == days[creationDate.getDay()])
        {
            let setTimeParts = reminder.timeNotified.split(":");
            let checkDate = new Date(dateParts[0], dateParts[1]-1, dateParts[2], setTimeParts[0], setTimeParts[1])
            if (creationDate.getTime() < checkDate.getTime() && new Date().getTime() > checkDate.getTime())
            {
                return true;
            }           
        }
        else
        {
            let setTimeParts = reminder.timeNotified.split(':');
            let checkDate = new Date(creationDate.getTime());
            for (let dayCounter = 0; dayCounter < 7; dayCounter++)
            {
                checkDate = new Date(checkDate.getTime() + (24*60*60*1000));
                if (checkDate.getTime() >= new Date().getTime() || checkDate.getDay() == new Date().getDay())
                {
                    if (reminder.daysRepeated.find(d => d == days[checkDate.getDay()]))
                    {
                        let tempDate = new Date(checkDate);
                        let setTime = new Date(tempDate.getFullYear(), (tempDate.getMonth()+1), tempDate.getDate(), setTimeParts[0], setTimeParts[1]);
                        if(setTime.getTime() < new Date().getTime())
                        {
                            return true;
                        }
                    }
                    break;
                }
                if (!!reminder.daysRepeated.find(d => d == days[checkDate]))
                {
                    return true;
                }
            }
        }
        
    }
    return false;
}

function findAllWeekStatistics(passedReviews)
{
    let weekStatistics = [];
    for (let review of passedReviews)
    {
        if (review.date != null)
        {
            let dateParts = review.date.split('-');
            let setDate = new Date(dateParts[0], dateParts[1]-1, dateParts[2]);
            let dayOfWeek = setDate.getDay();
            let startOfWeek = new Date(setDate.getTime() - (dayOfWeek*24*60*60*1000)+1);
            let startWeekString = startOfWeek.toLocaleDateString();
            let endOfWeek = new Date(startOfWeek.getTime() + (6*24*60*60*1000));
            let endWeekString = endOfWeek.toLocaleDateString();
            let statisticHeader = startWeekString + "-" + endWeekString;
            if (!!weekStatistics.find(w => w.header == statisticHeader))
            {
                let sameWeek = weekStatistics.find(w => w.header == statisticHeader);
                sameWeek.reviewIds.push(review.id);
                sameWeek.ratings.push(review.rating);
            }
            else
            {
                weekStatistics.push({
                    header: statisticHeader,
                    reviewIds: [review.id],
                    ratings: [review.rating],
                    overallRating: -1   
                });
            }
        }
    }
    for (let statistic of weekStatistics)
    {
        let runningTotal = 0;
        for (let rating of statistic.ratings)
        {
            runningTotal += parseInt(rating);
        }
        statistic.overallRating = (runningTotal / statistic.ratings.length);
    }
    return weekStatistics;
}

function findAllDayStatistics(passedReviews)
{
    let dayStatistics = [];
    for (let review of passedReviews)
    {
        if (review.date != null)
        {
            let dateParts = review.date.split('-');
            let setDate = new Date(dateParts[0], dateParts[1]-1, dateParts[2]);
            let statisticHeader = setDate.toLocaleDateString();
            if (!!dayStatistics.find(d => d.header == statisticHeader))
            {
                let sameDay = dayStatistics.find(d => d.header == statisticHeader);
                sameDay.reviewIds.push(review.id);
                sameDay.ratings.push(review.rating);
            }
            else
            {
                dayStatistics.push({
                    header: statisticHeader,
                    reviewIds: [review.id],
                    ratings: [review.rating],
                    overallRating: -1
                });
            }
        }
    }
    for (let statistic of dayStatistics)
    {
        let runningTotal = 0;
        for (let rating of statistic.ratings)
        {
            runningTotal += rating;
        }
        statistic.overallRating = (runningTotal / statistic.ratings.length);
    }
    return dayStatistics;
}

function sortWeekStatistics(weekStatistics)
{
    return (weekStatistics.sort( (a,b) => {
        let aParts = a.header.split('-')[0].split('/');
        let bParts = b.header.split('-')[0].split('/');
        let aDate = new Date(aParts[2], aParts[1], aParts[0]);
        let bDate = new Date(bParts[2], bParts[1], bParts[0]);
        return aDate - bDate;
    }));
}

function sortDayStatistics(dayStatistics)
{
    return (dayStatistics.sort( (a,b) => {
        let aParts = a.header.split('/');
        let bParts = b.header.split('/');
        let aDate = new Date(aParts[2], aParts[1], aParts[0]);
        let bDate = new Date(bParts[2], bParts[1], bParts[0]);
        return aDate - bDate;
    }));
}