const path = require('path');
const EventSource = require('eventsource');
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const port = 3000;
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: true}));

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
//app.use(express.json());

//app.set('views', path.join(__dirname, 'views'));

let lists = [
    {
        id: 1,
        name: "Pizzas",
        items: [ ["pepperoni", true], ["cheese", true], ["supreme", false], ["meat lovers", true], ["hawaiian", true], ["pepperoni", true], ["cheese", true], ["hawaiian", true], ["supreme", true], ["meat lovers", true] ]
    },
    {
        id: 2,
        name: "Pizzas",
        items: [ ["pepperoni", false], ["supreme", false], ["meat lovers", false], ["hawaiian", false], ["cheese", false], ["pepperoni", false], ["cheese", false], ["hawaiian", false], ["supreme", false], ["meat lovers", false] ]
    },
    {
        id: 3,
        name: "Pizzas",
        items: [ ["pepperoni", false], ["cheese", false], ["meat lovers", false], ["hawaiian", false] ]
    },
    {
        id: 4,
        name: "Pizzas",
        items: [ ["pepperoni", true], ["cheese", true], ["supreme", true], ["hawaiian", true], ["meat lovers", true], ["pepperoni", true], ["cheese", true], ["hawaiian", true], ["supreme", true], ["meat lovers", true], ["fish", true] ]
    },
    {
        id: 5,
        name: "Pizzas",
        items: [ ["cheese", false], ["supreme", false], ["meat lovers", false], ["hawaiian", false] ]
    },
    {
        id: 6,
        name: "Pizzas",
        items: [ ["pepperoni", true], ["cheese", true], ["hawaiian", true], ["supreme", true], ["meat lovers", true], ["pepperoni", true], ["cheese", true], ["hawaiian", true], ["supreme", true], ["meat lovers", true] ]
    },
    {
        id: 7,
        name: "Pizzas",
        items: [ ["pepperoni", false], ["cheese", false], ["hawaiian", false], ["supreme", true], ["meat lovers", false], ["double pizza", false], ["cheese", false], ["hawaiian", false], ["supreme", false], ["meat lovers", false] ]
    }
];

let reminders = [
    {
        id: 1,
        name: "Dentist Appointment",
        description: "i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. "
    },
    {
        id: 2,
        name: "Dentist Appointment",
        description: "i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. "
    },
    {
        id: 3,
        name: "Dentist Appointment",
        description: "i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. "
    },
    {
        id: 4,
        name: "Dentist Appointment",
        description: "i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned."
    },
    {
        id: 5,
        name: "Dentist Appointment",
        description: "i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. "
    },
    {
        id: 6,
        name: "Dentist Appointment",
        description: "i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. "
    },
    {
        id: 7,
        name: "Dentist Appointment",
        description: "i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. "
    },
    {
        id: 8,
        name: "Dentist Appointment",
        description: "i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. "
    },
    {
        id: 9,
        name: "Dentist Appointment",
        description: "i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. "
    },
    {
        id: 10,
        name: "Dentist Appointment",
        description: "i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. i love going to the dentist because i love having my teeth cleaned. "
    }
];

let username = "";
let password = "";

app.listen(port, () => {
    console.log('Running server');
});

app.get('/', (req, res) => {
    res.render('signin.ejs');
});

app.get('/home', (req, res) => {
    res.render('index.ejs', { lists, reminders });
});

app.post('/home', (req, res) => {
    const { inputUsername, inputPassword } = req.body;
    res.render('index.ejs', { lists, reminders });
});

app.get('/lists', (req, res) => {
    res.render('lists.ejs', { lists });
});

app.post('/lists', (req, res) => {
    console.log(req.body);
    let newId = Object.keys(lists).length + 1;
    let newName = Object.values(req.body)[0];
    let newValues = [];
    for (let counter = 1; counter < Object.values(req.body).length; counter++)
    {
        if (Object.values(req.body)[counter] != '')
        {
            newValues.push((Object.values(req.body))[counter]);
        }
    }
    lists.push({ id: newId, name: newName, items: newValues});
    res.render('lists.ejs', { lists });
});

app.get('/lists/add', (req, res) => {
    res.render('addList.ejs');
});

app.put('/lists/:id', (req, res) => {
    let id = parseInt(req.params.id);
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
});
app.get('/lists/:id', (req, res) => {
    let id = req.params.id;
    let list = lists.find(l => l.id == id);
    res.render('viewEditList.ejs', { list });
});

app.get('/reminders', (req, res) => {
    res.render('reminders.ejs', { reminders });
});

app.get('/reminders/add', (req, res) => {
   res.render('addReminder.ejs');     
});

app.get('/reviews', (req, res) => {
    res.render('reviews.ejs');
});
