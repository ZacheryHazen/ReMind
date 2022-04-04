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
// app.use(express.json());

let lists = [
    {
        id: 1,
        name: "Pizzas",
        items: [ "pepperoni", "cheese", "supreme", "meat lovers", "hawaiian", "pepperoni", "cheese", "hawaiian", "supreme", "meat lovers" ]
    },
    {
        id: 2,
        name: "Pizzas",
        items: [ "pepperoni", "supreme", "meat lovers", "hawaiian", "cheese", "pepperoni", "cheese", "hawaiian", "supreme", "meat lovers" ]
    },
    {
        id: 3,
        name: "Pizzas",
        items: [ "pepperoni", "cheese", "meat lovers", "hawaiian" ]
    },
    {
        id: 4,
        name: "Pizzas",
        items: [ "pepperoni", "cheese", "supreme", "hawaiian", "meat lovers", "pepperoni", "cheese", "hawaiian", "supreme", "meat lovers", "fish" ]
    },
    {
        id: 5,
        name: "Pizzas",
        items: [ "cheese", "supreme", "meat lovers", "hawaiian" ]
    },
    {
        id: 6,
        name: "Pizzas",
        items: [ "pepperoni", "cheese", "hawaiian", "supreme", "meat lovers", "pepperoni", "cheese", "hawaiian", "supreme", "meat lovers" ]
    },
    {
        id: 7,
        name: "Pizzas",
        items: [ "pepperoni", "cheese", "hawaiian", "supreme", "meat lovers", "double pizza" , "cheese", "hawaiian", "supreme", "meat lovers" ]
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
})
app.get('/', (req, res) => {
    res.render('signin.ejs');
})
app.get('/home', (req, res) => {
    res.render('index.ejs', { lists, reminders });
})
app.post('/home', (req, res) => {
    const { inputUsername, inputPassword } = req.body;
    res.render('index.ejs', { lists, reminders });
})
app.get('/lists', (req, res) => {
    res.render('lists.ejs', { lists });
})
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
})
app.get('/lists/add', (req, res) => {
    res.render('addList.ejs');
})
app.get('/lists/:id', (req, res) => {
    let id = req.params.id;
    let list = lists.find(l => l.id == id);
    res.render('viewEditList.ejs', { list });
})
app.patch('/lists/:id', (req, res) => {
    console.log(req.body);
    res.render('lists.ejs', { lists} );
})
app.get('/reminders', (req, res) => {
    res.render('reminders.ejs', { reminders });
})
app.get('/reviews', (req, res) => {
    res.render('reviews.ejs');
})
