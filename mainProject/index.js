const path = require('path');
const EventSource = require('eventsource');
const express = require('express');
const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname,'public')));



app.listen(port, () => {
    console.log('Running server');
})
app.get('/', (req, res) => {
    res.render('signin.ejs');
})
app.get('/home', (req, res) => {
    res.render('index.ejs');
})