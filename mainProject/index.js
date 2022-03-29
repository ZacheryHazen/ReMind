const path = require('path');
const EventSource = require('eventsource');
const express = require('express');
const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname,'public')));


/*
const evtSource = new EventSource("http://192.168.1.8:3000");
evtSource.onmessage = function (message) {
    console.log("we got something ", message);
};
*/
app.listen(port, () => {
    console.log('howdy');
})
app.get('/', (req, res) => {
    res.render('index.ejs');
})
app.get('/takeMeToChurch', (req, res) => {
    res.render('church.ejs');
})