// This file facilitates all communication with a client - it determines which pages to display for each request, what data is on these pages, and parses all data received from the client.
// It also connects to the SQL server and runs various queries to insert, delete, and retrieve all relevant data.

// path is used to facilitate directory management, we join it to the directory public later so all javascript files, our .css sheet, and images can be accessible from our .ejs files.
var path = require('path');
// express is what runs our server on localhost, it receives requests and sends data out to and from clients.
var express = require('express');
var app = express();
// methodOverride is used to read PUT requests as we have to use a different method to integrate PUT requests into HTML forms.
var methodOverride = require('method-override');
// port holds the port that we host the localhost server on.
const port = 3000;
// multer is used to read FormData which is a different format of form data used in the item groups POST request as it is made asynchronously with no change to the web page.
var multer = require('multer');
// upload is used specifically during the above POST request in the method body to read FormData.
var upload = multer();
// session is used to facilitate the usage of cookies, which read a user's current session to determine what user they are and if they are authorized to view or edit data.
var session = require('express-session');
// os is used to find the SQL server name as (when set up according to the ReadMe) it should be hosted at the computer's name\REMINDDB.
var os = require("os");
// hostname is the name of the computer hosting the server, and is used to find the SQL server name as explained in the above comment.
const hostName = os.hostname();
// sql is used to communicate with the SQL server, and faciliates all requests made by this server.
var sql = require("mssql");
// As detailed in an above comment, this joins the public directory to our static files in Express so javascript files, the .css sheet, and images can accessible from our .ejs files.
app.use(express.static(path.join(__dirname,'public')));
// This line of code allows us to read certain types of form data from clients. 
app.use(express.urlencoded({ extended: true}));
// This sets our view engine as EJS, which is what all of our web pages' file types are and allows us to insert javascript easily into HTML pages.
app.set('view engine', 'ejs');
// As detailed in an above comment, this line of code allows us to read PUT requests as we have to use a different method to integrate PUT requests into HTML forms.
app.use(methodOverride('_method'));
// This sets up the session config we will use for our server, setting the secret to be a string of letters and numbers and setting the max age of the cookie to be 24 hours.
app.use(session({
    secret: "secretReMindSecretKeySecret91400",
    cookie: { maxAge: 24*60*60*1000 },
    saveUninitialized:true,
    resave: false
}));
// This is the config used to connect to the SQL server, and it uses a dummy account created for SQL server access that was created in the ReadMe. The server name and port should also be explained in the ReadMe.
var config = {
    user: 'sa',
    password: 'pass',
    database: 'reMind',
    server: hostName + '\\REMINDDB',
    port: 1443,
    trustServerCertificate: true
};

// sqlRequest is the object that will be used to facilitate all requests to the SQL server.
let sqlRequest;

// This function is what starts the Express server and it initializes the sqlRequest object using a ConnectionPool. It also displays messages to the CMD dictating it's startup and connection to the SQL server.
app.listen(port, async () => { 
    console.log('Server running on ' + port);
    let conn = new sql.ConnectionPool(config); 
    let pool = await conn.connect();
    sqlRequest = new sql.Request(pool);
    console.log('Connected to reMind database!')
});

// This function handles initial connection to the server and displays the sign in page. It also sets invalid to false so the invalid sign in flag is not shown.
app.get('/', (req, res) => {
    res.render('signin.ejs', { invalid: false });
});

// This function handles requests to the index page, and it first detects if the session of the user has a userID, and if so it finds all undeleted reminders and lists for that user to display on the homepage (and set for notifications), if not it sends them to the sign in page.
app.get('/home', async (req, res) => {
    let userID;
    if (!!Object.keys(req.session).find(k => k == 'userID'))
    {
        userID = req.session.userID;
        let passedReminders = await getUndeletedRemindersForUserID(userID);
        let passedLists = await getUndeletedListsForUserID(userID);
        res.render('index.ejs', { passedLists, passedReminders });
    }
    else
    {
        res.redirect('/');
    }
})

// This function handles when a user attempts to sign in to the Re-Mind server, if the user has a valid sign in it adds the userID attribute to their cookie so they will be authenticated on future pages.
// It then directs them to the homepage. If they did not have a valid sign in they are sent to /invalidCredentials which renders the sign in page with an incorrect sign in flag. 
app.post('/home', async (req, res) => {
    let userID;
    let userResult = await sqlRequest.query('SELECT userID, username, password FROM RM.Users'); 
    let users = userResult.recordset;
    let user = users.find(u => u.username == req.body["inputUsername"] && u.password == req.body["inputPassword"]);
    if (!!user)
    {
        let userSession = req.session;
        userSession.userID = user.userID;
        userID = user.userID;
        res.redirect('/home');
    }
    else
    {
        res.redirect('/invalidCredentials');
    }
});

// As detailed in the above comment, this simply sends the user to the sign in page with an incorrect sign in flag.
app.get('/invalidCredentials', (req, res) => {
    res.render('signin.ejs', { invalid : true});
})

// This function handles when a user attempts to view the Lists page. It first checks if they have a valid userID in their session, and if they do 
// it renders the Lists page with their undeleted reminders (for notifications) and lists. If they do not it sends them to the sign in page.
app.get('/lists', async (req, res) => {
    if (!!Object.keys(req.session).find(k => k == 'userID'))
    {
        let userID = req.session['userID'];
        let passedReminders = await getUndeletedRemindersForUserID(userID);
        let passedLists = await getUndeletedListsForUserID(userID);
        res.render('lists.ejs', { passedLists, passedReminders });
    }
    else
    {
        res.redirect('/');
    }
});

// This function handles a post request to the Lists page. It first checks if they have a valid userID in their session, and if they do it inserts the information into the SQL database
// and redirects them to the Lists page. If they do not have a valid userID it sends them to the sign in page.
app.post('/lists', async (req, res) => {
    if (!!Object.keys(req.session).find(k => k == 'userID'))
    {
        let userID = req.session['userID'];
        await sqlRequest.query('INSERT INTO RM.Lists(name, userID, isDeleted) VALUES (\'' + Object.values(req.body)[0] + '\',\'' + userID + '\', 0)');
        let newListID = await sqlRequest.query('SELECT listID FROM RM.Lists L WHERE L.listID=(SELECT MAX(listID) FROM RM.Lists)');
        for (let itemCounter = 1; itemCounter < Object.keys(req.body).length; itemCounter++)
        {
            if (Object.values(req.body)[itemCounter] != '')
            {
                await sqlRequest.query('INSERT INTO RM.ListItems(description, checked, listID) VALUES (\'' + Object.values(req.body)[itemCounter] + '\', 0, ' + newListID.recordset[0].listID + ')');
            }
        }
        res.redirect('/lists');
    }
    else
    {
        res.redirect('/');
    }
});

// This function handles when a user attempts to view the Add List page, and if they have a valid userID it allows them to visit the page and sends all item groups and undeleted reminders (for notifications)
// for the user to the page as well to facilitate item creation. If they do not have a valid userID it sends them to the sign in page.
app.get('/lists/add', async (req, res) => {
    if (!!Object.keys(req.session).find(k => k == 'userID'))
    {
        let userID = req.session['userID'];
        let passedReminders = await getUndeletedRemindersForUserID(userID);
        let passedCustomItemGroups = await getCustomItemGroupsForUserID(userID);
        res.render('addList.ejs', { passedCustomItemGroups, passedReminders });
    }
    else
    {
        res.redirect('/');
    }
});

// This function handles when a user attempts to update a list. It first checks if they have a valid userID, and if they do it then checks if the list they are attempting to update is one of their own undeleted lists.
// If it isn't, it directs them to the Lists page, but if it is one of their lists it updates the list accordingly and then sends them to the Lists page. If they do not have a valid userID it sends them to the sign in page.
app.put('/lists/:id', async (req, res) => {
    let id = parseInt(req.params.id);
    if (id != "notificationHandler.js")
    {
        if (!!Object.keys(req.session).find(k => k == 'userID'))
        {
            let userID = req.session['userID'];
            let result = await sqlRequest.query('SELECT listID, name, userID, isDeleted FROM RM.Lists L WHERE L.listID = ' + id + ' AND L.userID = ' + userID + ' AND L.isDeleted = 0');
            if (result != null)
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
                await sqlRequest.query('DELETE FROM RM.ListItems WHERE listID = ' + result.recordset[0].listID)
                for (let newItem of newValues)
                {
                    if (newItem[1] == true)
                    {
                        await sqlRequest.query('INSERT INTO RM.ListItems(description, checked, listID) VALUES (\'' + newItem[0] + '\', ' + 1 + ', ' + result.recordset[0].listID + ')');
                    }
                    else
                    {
                        await sqlRequest.query('INSERT INTO RM.ListItems(description, checked, listID) VALUES (\'' + newItem[0] + '\', ' + 0 + ', ' + result.recordset[0].listID + ')')
                    }
                }
            }
            res.redirect("/lists");
        }
        else
        {
            res.redirect('/');
        }
    }
});

// This function handles when a user attempts to view the edit/view list page for a specific list. It first checks if they have a valid userID, and it then checks to see if the list they are 
// attempting to view is one of their own undeleted lists. If it is, it renders the page and passes the list as well as their undeleted reminders (for notifications). If it isn't, it renders the page along
// with a message stating that the requested list is not valid. If they do not have a valid userID it sends them to the sign in page.
app.get('/lists/:id', async (req, res) => {
    let id = req.params.id;
    if (id != "notificationHandler.js")
    {
        if (!!Object.keys(req.session).find(k => k == 'userID'))
        {
            let userID = req.session['userID'];
            let result = await sqlRequest.query('SELECT listID, name, userID, isDeleted FROM RM.Lists L WHERE L.listID = ' + id + ' AND L.userID = ' + userID + ' AND L.isDeleted = 0');
            let passedReminders = await getUndeletedRemindersForUserID(userID);
            if (result.recordset.length == 0)
            {
                res.render('viewEditList.ejs', { valid: false, passedReminders });
            }
            else
            {
                let list = await getListByListID(id);
                let passedCustomItemGroups = await getCustomItemGroupsForUserID(userID);
                res.render('viewEditList.ejs', { valid: true, list, passedCustomItemGroups, passedReminders });
            }
        }
        else
        {
            res.redirect('/');
        }
    }
});

// This function handles the requested deletion of a list by a user. It first  checks if the user has a valid userID and whether the list to be deleted is a valid undeleted list owned by the user.
// If it is, it deletes this list in the SQL database and redirects them to the Lists page. If it is not a valid undeleted list it redirects them to the Lists page.
// If they do not have a valid userID it sends them to the sign in page.
app.delete('/lists/:id', async (req, res) => {
    let id = parseInt(req.params.id);
    if (id != "notificationHandler.js")
    {
        if (!!Object.keys(req.session).find(k => k == 'userID'))
        {
            let userID = req.session['userID'];
            let result = await sqlRequest.query('SELECT listID, name, userID, isDeleted FROM RM.Lists L WHERE L.listID = ' + id + ' AND L.userID = ' + userID + ' AND L.isDeleted = 0');
            if (result != null)
            {
                await sqlRequest.query('UPDATE RM.Lists SET isDeleted = 1 WHERE listID = ' + id);
            }
            res.redirect('/lists');
        }
        else
        {
            res.redirect('/');
        }
    }
})

// This function handles when a user attempts to view the Reminders page. It first checks if they have a valid userID in their session, and if they do 
// it renders the Reminders page with their undeleted reminders. If they do not have a valid userID it sends them to the sign in page.
app.get('/reminders', async (req, res) => {
    if (!!Object.keys(req.session).find(k => k == 'userID'))
    {
        let userID = req.session['userID'];
        let passedReminders = await getUndeletedRemindersForUserID(userID);
        res.render('reminders.ejs', { passedReminders });
    }
    else
    {
        res.redirect('/');
    }
});

// This function handles when a user attempts to view the Add Reminder page, and if they have a valid userID it allows them to visit the page and sends all their undeleted reminders (for notifications).
// If they do not have a valid userID it sends them to the sign in page.
app.get('/reminders/add', async (req, res) => {
    if (!!Object.keys(req.session).find(k => k == 'userID'))
    {
        let userID = req.session['userID'];
        let passedReminders = await getUndeletedRemindersForUserID(userID);
        res.render('addReminder.ejs', { passedReminders });
    }
    else
    {
        res.redirect('/');
    }     
});

// This function handles a post request to the Reminders page. It first checks if they have a valid userID in their session, and if they do it inserts the information into the SQL database
// and redirects them to the Reminders page. If they do not have a valid userID it sends them to the sign in page.
app.post('/reminders', async (req, res) => {
    if (!!Object.keys(req.session).find(k => k == 'userID'))
    {
        let userID = req.session['userID'];
        let keys = Object.keys(req.body);
        if (req.body["frequencyRadio"] == "oneTime")
        {
            await sqlRequest.query('INSERT INTO RM.Reminders(name, frequency, dateNotified, timeNotified, description, userID, isDeleted) VALUES (\'' + req.body["reminderName"] + '\', \'' + req.body["frequencyRadio"] + '\', \'' + req.body["datePicker"] + '\', \'' + req.body["timePicker"] + '\', \'' + req.body["reminderDescription"] + '\', ' + userID + ', ' + 0 + ')'); 
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
                    await sqlRequest.query('INSERT INTO RM.Reminders(name, frequency, timeNotified, description, userID, isDeleted) VALUES (\'' + req.body["reminderName"] + '\', \'Daily\', \'' + req.body["timePicker"] + '\', \'' + req.body["reminderDescription"] + '\', ' + userID + ', ' + 0 + ')'); 
                }
                else
                {
                    let daysString = "";
                    for (let counter = 0; counter <days.length-1; counter++)
                    {
                        daysString += days[counter] + ",";
                    }
                    daysString += days[days.length-1];
                    await sqlRequest.query('INSERT INTO RM.Reminders(name, frequency, daysRepeated, timeNotified, description, userID, isDeleted) VALUES (\'' + req.body["reminderName"] + '\', \'' +  req.body["frequencySelect"] + '\', \'' + daysString + '\', \'' + req.body["timePicker"] + '\', \'' + req.body["reminderDescription"] + '\', ' + userID + ', ' + 0 + ')'); 
                }
            }
            else
            {
                await sqlRequest.query('INSERT INTO RM.Reminders(name, frequency, timeNotified, description, userID, isDeleted) VALUES (\'' + req.body["reminderName"] + '\', \'' +  req.body["frequencySelect"] + '\', \'' + req.body["timePicker"] + '\', \'' + req.body["reminderDescription"] + '\', ' + userID + ', ' + 0 + ')');
            }
            
        }
        res.redirect('/reminders');
    }
    else
    {
        res.redirect('/');
    }
});

// This function handles when a user attempts to view the edit reminder page for a specific reminder. It first checks if they have a valid userID, and it then checks to see if the reminder they are 
// attempting to view is one of their own undeleted reminders. If it is, it renders the page and passes the reminder as well as all other undeleted reminders (for notifications). If it isn't, it renders the page along
// with a message stating that the requested reminder is not valid. If they do not have a valid userID it sends them to the sign in page.
app.get('/reminders/:id', async (req, res) => {
    let id = req.params.id;
    if (id != "notificationHandler.js")
    {
        if (!!Object.keys(req.session).find(k => k == 'userID'))
        {
            let userID = req.session['userID'];
            let passedReminders = await getUndeletedRemindersForUserID(userID);
            let result = await sqlRequest.query('SELECT * FROM RM.Reminders R WHERE R.reminderID = ' + id + ' AND R.userID = ' + userID + ' AND R.isDeleted = 0');
            if (result.recordset.length > 0)
            {
                let reminder = result.recordset[0];
                if (reminder.daysRepeated != null)
                {
                    reminder.daysRepeated = reminder.daysRepeated.split(',');
                }
                res.render('editReminder.ejs', { valid: true, reminder, passedReminders });
            }
            else
            {
                res.render('editReminder.ejs', { valid : false, passedReminders });
            }
            
        }
        else
        {
            res.redirect('/');
        }
    }
});

// This function handles when a user attempts to update a reminder. It first checks if they have a valid userID, and if they do it then checks if the reminder they are attempting to update is one of their own undeleted reminders.
// If it isn't, it directs them to the Reminders page, but if it is one of their reminders it updates the reminder accordingly and then sends them to the Reminders page. If they do not have a valid userID it sends them to the sign in page.
app.put('/reminders/:id', async (req, res) => {
    let id = parseInt(req.params.id);
    if (id != "notificationHandler.js")
    {
        if (!!Object.keys(req.session).find(k => k == 'userID'))
        {
            let userID = req.session['userID'];
            let keys = Object.keys(req.body);
            let result = await sqlRequest.query('SELECT reminderID, name, userID, isDeleted FROM RM.Reminders R WHERE R.reminderID = ' + id + ' AND R.userID = ' + userID + ' AND R.isDeleted = 0');
            if (result != null)
            {
                if (req.body["frequencyRadio"] == "oneTime")
                {
                    await sqlRequest.query('UPDATE RM.Reminders SET frequency = \'' + req.body["frequencyRadio"] + '\', daysRepeated = null, dateNotified = \'' + req.body["datePicker"] + '\', timeNotified = \'' + req.body["timePicker"] + '\', description = \'' + req.body["reminderDescription"] + '\', createdOn = SYSDATETIMEOFFSET() WHERE reminderID = ' + id); 
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
                            await sqlRequest.query('UPDATE RM.Reminders SET frequency = \'Daily\', daysRepeated = null, dateNotified = null, timeNotified = \'' + req.body["timePicker"] + '\', description = \'' + req.body["reminderDescription"] + '\', createdOn = SYSDATETIMEOFFSET() WHERE reminderID = ' + id); 
                        }
                        else
                        {
                            let daysString = "";
                            for (let counter = 0; counter <days.length-1; counter++)
                            {
                                daysString += days[counter] + ",";
                            }
                            daysString += days[days.length-1];
                            await sqlRequest.query('UPDATE RM.Reminders SET frequency = \'' + req.body["frequencySelect"] + '\', daysRepeated = \'' + daysString + '\', dateNotified = null, timeNotified = \'' + req.body["timePicker"] + '\', description = \'' + req.body["reminderDescription"] + '\', createdOn = SYSDATETIMEOFFSET() WHERE reminderID = ' + id); 
                        }
                    }
                    else
                    {
                        await sqlRequest.query('UPDATE RM.Reminders SET frequency = \'' + req.body["frequencySelect"] + '\', daysRepeated = null, dateNotified = null, timeNotified = \'' + req.body["timePicker"] + '\', description = \'' + req.body["reminderDescription"] + '\', createdOn = SYSDATETIMEOFFSET() WHERE reminderID = ' + id); 
                    }        
                }
            }
            res.redirect("/reminders");
        }
        else
        {
            res.redirect('/');
        }
    }
});

// This function handles the requested deletion of a reminder by a user. It first checks if the user has a valid userID and whether the reminder to be deleted is a valid undeleted reminder owned by the user.
// If it is, it deletes this reminder in the SQL database and redirects them to the Reminders page. If it is not a valid undeleted reminder it redirects them to the Reminders page.
// If they do not have a valid userID it sends them to the sign in page.
app.delete("/reminders/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    if (id != "notificationHandler.js")
    {
        if (!!Object.keys(req.session).find(k => k == 'userID'))
        {
            let userID = req.session['userID'];
            let result = await sqlRequest.query('SELECT reminderID, name, userID, isDeleted FROM RM.Reminders R WHERE R.reminderID = ' + id + ' AND R.userID = ' + userID + ' AND R.isDeleted = 0');
            if (result != null)
            {
                await sqlRequest.query('UPDATE RM.Reminders SET isDeleted = 1 WHERE reminderID = ' + id);
            }
            res.redirect('/reminders');
        }
        else
        {
            res.redirect('/');
        }
    }
});

// This function handles the posting of a new custom item group, and it first checks if the user has a valid userID and if they do it inserts the new item group into the database.
// It then redirects the user to the Lists page, but this request is not made from web pages directly, only from JavaScript, so any redirection should never be visible from the client's side.
// If they do not have a valid userID it sends them to the sign in page.
app.post("/itemGroups", upload.none(), async (req, res) => {
    if (!!Object.keys(req.session).find(k => k == 'userID'))
    {
        let userID = req.session['userID'];
        await sqlRequest.query('INSERT INTO RM.CustomItemGroups(name, userID) VALUES (\'' + Object.values(req.body)[0] + '\',\'' + userID + '\')');
        let newListID = await sqlRequest.query('SELECT groupID FROM RM.CustomItemGroups CIG WHERE CIG.groupID=(SELECT MAX(groupID) FROM RM.CustomItemGroups)');
        for (let itemCounter = 1; itemCounter < Object.keys(req.body).length; itemCounter++)
        {
            if (Object.values(req.body)[itemCounter] != '')
            {
                await sqlRequest.query('INSERT INTO RM.CustomItemGroupItems(description, groupID) VALUES (\'' + Object.values(req.body)[itemCounter] + '\', ' + newListID.recordset[0].groupID + ')');
            }
        }
        res.redirect('/lists');
    }
    else
    {
        res.redirect('/');
    }
});

// This function handles when a user attempts to view the Reminders page. It first checks if they have a valid userID in their session, and if they do 
// it renders the Reminders page with their undeleted reminders (for notifications) and reviews. If they do not have a valid userID it sends them to the sign in page.
app.get('/reviews', async (req, res) => {
    if (!!Object.keys(req.session).find(k => k == 'userID'))
    {
        let userID = req.session['userID'];
        let passedReviews = await getUndeletedReviewsForUserID(userID);
        let passedReminders = await getUndeletedRemindersForUserID(userID);
        let allReminders = await getAllRemindersForUserID(userID);
        res.render('reviews.ejs', { passedReviews, allReminders, passedReminders });
    }
    else
    {
        res.redirect('/');
    }
});

// This function handles a post request to the Reviews page. It first checks if they have a valid userID in their session, and if they do it inserts the information into the SQL database
// and redirects them to the Reviews page. If they do not have a valid userID it sends them to the sign in page.
app.post('/reviews', async (req, res) => {
    if (!!Object.keys(req.session).find(k => k == 'userID'))
    {
        let userID = req.session['userID'];
        if (req.body["type"] === "day")
        {
            await sqlRequest.query('INSERT INTO RM.Reviews(type, date, rating, description, userID, isDeleted) VALUES(\'day\', \'' + req.body["dayDatePicker"] + '\', ' + req.body["rating"] + ', \'' + req.body["dayReviewDescription"] + '\', ' + userID + ', ' + 0 + ')');
        }
        else if (req.body["type"] === "reminder")
        {
            let date = null;
            if (req.body["reminderDatePicker"] != "")
            {
                date = req.body["reminderDatePicker"];
            }
            await sqlRequest.query('INSERT INTO RM.Reviews(type, date, rating, reminderID, description, userID, isDeleted) VALUES(\'reminder\', \'' + date + '\', ' + req.body["rating"] + ', ' + req.body["id"] + ', \'' + req.body["reminderReviewDescription"] + '\', ' + userID + ', ' + 0 + ')');
        }
        else if (req.body["type"] === "other")
        {
            let date;
            if (req.body["otherDatePicker"] == "")
            {
                date = null;
            }
            else
            {
                date = req.body["otherDatePicker"];
            }
            await sqlRequest.query('INSERT INTO RM.Reviews(name, type, date, rating, description, userID, isDeleted) VALUES(\'' + req.body["otherNameInput"] + '\', \'other\', \'' + date + '\', ' + req.body["rating"] + ', \'' + req.body["otherReviewDescription"] + '\', ' + userID + ', ' + 0 + ')');
        }
        res.redirect('/reviews');
    }
    else
    {
        res.redirect('/');
    }
});

// This function handles when a user attempts to view the Add Review page, and if they have a valid userID it allows them to visit the page and sends undeleted reminders (for notifications).
// It also sends all elapsed reminders to be chosen for reviewing. If they do not have a valid userID it sends them to the sign in page.
app.get('/reviews/add', async (req, res) => {
    if (!!Object.keys(req.session).find(k => k == 'userID'))
    {
        let userID = req.session['userID'];
        let passedReminders = await getUndeletedRemindersForUserID(userID);
        let elapsedReminders = [];
        for (let reminder of passedReminders )
        {
            if (verifyIfReminderHasOccurred(reminder))
            {
                elapsedReminders.push(reminder);
            }
        }
        res.render('addReview.ejs', { elapsedReminders, passedReminders });
    }
    else
    {
        res.redirect('/');
    }
});

// This function handles when a user attempts to view the edit/view review page for a specific review. It first checks if they have a valid userID, and it then checks to see if the review they are 
// attempting to view is one of their own undeleted reviews. If it is, it renders the page and passes the review as well as their undeleted reminders (for notifications) and all elapsed reminders. If it isn't, it renders the page along
// with a message stating that the requested review is not valid. If they do not have a valid userID it sends them to the sign in page.
app.get('/reviews/:id', async (req, res) => {
    let id = req.params.id;
    if (id != "notificationHandler.js")
    {
        if (!!Object.keys(req.session).find(k => k == 'userID'))
        {
            let userID = req.session['userID'];
            let result = await sqlRequest.query('SELECT * FROM RM.Reviews R WHERE R.reviewID = ' + id + ' AND R.userID = ' + userID + ' AND R.isDeleted = 0');
            let passedReminders = await getUndeletedRemindersForUserID(userID);
            if (result.recordset.length == 0)
            {
                res.render('viewEditReview.ejs', { valid: false, passedReminders });
            }
            else
            {
                let review = result.recordset[0];
                let reminders = await getAllRemindersForUserID(userID);
                let elapsedReminders = [];
                for (let reminder of reminders)
                {
                    if (verifyIfReminderHasOccurred(reminder))
                    {
                        elapsedReminders.push(reminder);
                    }
                }
                res.render('viewEditReview.ejs', { valid: true, review, passedReminders, elapsedReminders });
            }
        }
        else
        {
            res.redirect('/');
        }
    }
});

// This function handles when a user attempts to update a review. It first checks if they have a valid userID, and if they do it then checks if the review they are attempting to update is one of their own undeleted reviews.
// If it isn't, it directs them to the Reviews page, but if it is one of their reviews it updates the review accordingly and then sends them to the Reivews page. If they do not have a valid userID it sends them to the sign in page.
app.put('/reviews/:id', async (req, res) => {
    let id = parseInt(req.params.id);
    if (id != "notificationHandler.js")
    {
        if (!!Object.keys(req.session).find(k => k == 'userID'))
        {
            let userID = req.session['userID'];
            let result = await sqlRequest.query('SELECT * FROM RM.Reviews R WHERE R.reviewID = ' + id + ' AND R.userID = ' + userID + ' AND R.isDeleted = 0');
            if (result != null)
            {
                if (req.body["type"] === "day")
                {
                    await sqlRequest.query('UPDATE RM.Reviews SET date = \'' + req.body["dayDatePicker"] + '\', rating = ' + req.body["rating"] + ', description = \'' + req.body["dayReviewDescription"] + '\', createdOn = SYSDATETIMEOFFSET() WHERE reviewID = ' + id);
                }
                else if (req.body["type"] === "reminder")
                {
                    let date = null;
                    if (req.body["reminderDatePicker"] != "")
                    {
                        date = req.body["reminderDatePicker"];
                    }
                    await sqlRequest.query('UPDATE RM.Reviews SET date = \'' + date + '\', rating = ' + req.body["rating"] + ', description = \'' + req.body["reminderReviewDescription"] + '\', createdOn = SYSDATETIMEOFFSET() WHERE reviewID = ' + id);
                }
                else if (req.body["type"] === "other")
                {
                    let date;
                    if (req.body["otherDatePicker"] == "")
                    {
                        date = null;
                    }
                    else
                    {
                        date = req.body["otherDatePicker"];
                    }
                    await sqlRequest.query('UPDATE RM.Reviews SET name = \'' + req.body["otherNameInput"] + '\', date = \'' + date + '\', rating = ' + req.body["rating"] + ', description = \'' + req.body["otherReviewDescription"] + '\', createdOn = SYSDATETIMEOFFSET() WHERE reviewID = ' +id);
                }
                res.redirect("/reviews");
            }
        }
        else
        {
            res.redirect('/');
        }
    }
});

// This function handles the requested deletion of a review by a user. It first checks if the user has a valid userID and whether the reivew to be deleted is a valid undeleted review owned by the user.
// If it is, it deletes this review in the SQL database and redirects them to the Reviews page. If it is not a valid undeleted review it redirects them to the Reviews page.
// If they do not have a valid userID it sends them to the sign in page.
app.delete("/reviews/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    if (id != "notificationHandler.js")
    {
        if (!!Object.keys(req.session).find(k => k == 'userID'))
        {
            let userID = req.session['userID'];
            let result = await sqlRequest.query('SELECT reviewID, name, userID, isDeleted FROM RM.Reviews R WHERE R.reviewID = ' + id + ' AND R.userID = ' + userID + ' AND R.isDeleted = 0');
            if (result != null)
            {
                await sqlRequest.query('UPDATE RM.Reviews SET isDeleted = 1 WHERE reviewID = ' + id);
            }
            res.redirect('/reviews');
        }
        else
        {
            res.redirect('/');
        }
    }
});

// This function handles requests to view the statistics page. It first checks if the user has a valid userID, and if they do it uses various functions to calculate all statistics for
// the user's undeleted reviews. It then passes these statistics along with all undeleted reviews, undeleted reminders, as well as all reminders whether they are deleted or not (if certain reviews are kept that correspond 
// to a deleted reminder, this passes those values) to the statistics page and renders the page. If they do not have a valid userID it sends them to the sign in page.
app.get('/statistics', async (req, res) => {
    if (!!Object.keys(req.session).find(k => k == 'userID'))
    {
        let userID = req.session['userID'];
        let passedReminders = await getUndeletedRemindersForUserID(userID);
        let passedReviews = await getUndeletedReviewsForUserID(userID);
        let reminders = await getAllRemindersForUserID(userID);
        let weekStatistics = findAllWeekStatistics(passedReviews);
        let dayStatistics = findAllDayStatistics(passedReviews);
        weekStatistics = sortWeekStatistics(weekStatistics);
        dayStatistics = sortDayStatistics(dayStatistics);
        res.render("statistics.ejs", { passedReviews, reminders, weekStatistics, dayStatistics, passedReminders });
    }
    else
    {
        res.redirect('/');
    }
});

// This function handles requests to the About page which it always redirects to whether the user is signed in or not.
app.get('/about', (req, res) => {
    res.render("about.ejs");
});

// This function handles requests to the Contact Us page which it always redirects to whether the user is signed in or not.
app.get('/contactUs', (req, res) => {
    res.render("contactUs.ejs");
});

// This function handles requests to the Create Account page which it always redirects to whether the user is signed in or not.
// Additionally it sets the invalid flag as false (this is only set to true when there is an issue with account creation).
app.get('/createAccount', (req, res) => {
    res.render("createAccount.ejs", { invalid: false });
});

// This function handles the account creation requests. It first checks to see if the username inputted by the new user is taken, and if it is it renders the
// account creation page with the invalid flag set to true, which displays a message stating the account name is already in use. If the username is not taken,
// it inserts the new account into the SQL database and redirects the user to the sign in page.
app.post('/', async (req, res) => {
    let username = req.body["inputUsername"];
    let password = req.body["inputPassword"];
    let userResult = await sqlRequest.query('SELECT userID, username, password FROM RM.Users'); 
    let users = userResult.recordset;
    let user = users.find(u => u.username == req.body["inputUsername"] && u.password == req.body["inputPassword"]);
    if (!!user)
    {
        res.render("createAccount.ejs", { invalid: true });
    }
    else
    {
        await sqlRequest.query('INSERT INTO RM.Users(username, password) VALUES (\''+username+'\',\''+password+'\')');
        res.redirect('/');
    }
});

// This handles all sign out requests, and simply destroys the user's session (so the cookie is not preserved with their userID). It then redirects the user to the sign in page.
app.get('/signout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

// This function is used to determine if an instance of a reminder has already occurred. It takes in a reminder and returns a boolean value which reflects whether it has occurred as of the time of the function call.
function verifyIfReminderHasOccurred(reminder)
{
    // It first checks the reminder's frequency to determine how to find whether it has occurred.
    if (reminder.frequency == "oneTime")
    {
        // If the reminder is a one-time reminder, it simply determines if the set time has already elapsed, if it has it returns true.
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
        // If the reminder is a daily reminder, it first checks whether the current time is 24 hours past the creation time, and if so it returns true.
        let dateParts = reminder.createdOn.split(' ')[0].split('-');
        let timeParts = reminder.createdOn.split(' ')[1].split(':');
        creationDate = new Date(dateParts[0], (dateParts[1]-1), dateParts[2], timeParts[0], timeParts[1], timeParts[2]);
        if (new Date().getTime() > (creationDate.getTime() + (24*60*60*1000)))
        {   
            return true;
        }
        else
        {
            // If it has not been 24 hours since the reminder's creation, it first checks whether the set time is after the creation time and the current time is past the creation time.
            // If this is the case, it returns true. (Ex - If a reminder was set for 5 PM at 3 PM and it is now 6 PM, the reminder has occurred.) 
            // If this is not the case, it then checks if 24 hours have occurred since the first checkDate. If so, it returns true (the reminder has to have occurred).
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
        // If the reminder is a weekly reminder, it first checks whether a whole week has passed, and if so it returns true as the reminder has to have occurred.
        let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let dateParts = reminder.createdOn.split(' ')[0].split('-');
        let timeParts = reminder.createdOn.split(' ')[1].split(':');
        creationDate = new Date(dateParts[0], (dateParts[1]-1), dateParts[2], timeParts[0], timeParts[1], timeParts[2]);
        if (new Date().getTime() > (creationDate.getTime() + (7*24*60*60*1000)))
        {   
            return true;
        }
        else
        {
            // If this is not the case, it then checks whether the day it was created was one of the days the reminder was set to occur.
            // If so, it then checks whether (as with the daily reminder) the set time is after the creation time and the current time is past the creation time.
            // If this is the case, it returns true. (Ex - If a reminder was set for 5 PM on Tuesday at 3 PM on the same Tuesday and it is now 6 PM on the same Tuesday, the reminder has occurred.) 
            if (reminder.daysRepeated.find(d => d == days[creationDate.getDay()]))
            {
                let setTimeParts = reminder.timeNotified.split(":");
                let checkDate = new Date(dateParts[0], dateParts[1]-1, dateParts[2], setTimeParts[0], setTimeParts[1])
                if (creationDate.getTime() < checkDate.getTime() && new Date().getTime() > checkDate.getTime())
                {
                    return true;
                }     
            }
            // If this is not the case, it then iterates through every day of the week, checking whether the reminder has occurred.
            let setTimeParts = reminder.timeNotified.split(':');
            let checkDate = new Date(creationDate.getTime());
            for (let dayCounter = 0; dayCounter < 7; dayCounter++)
            {
                checkDate = new Date(checkDate.getTime() + (24*60*60*1000));
                // The first check it does for each day is determine whether the "checked" time for the reminder is past the current time or whether the "checked" day is the current day.
                if (checkDate.getTime() >= new Date().getTime() || checkDate.getDay() == new Date().getDay())
                {
                    // If this is the case, it then checks if the current "checked" day is on the list of days set for the reminder. If so, it then checks whether the set time would have occurred.
                    // If so, it returns true. If not, it breaks as we will have already caught up to the current day, so no further checking is necessary.
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
                // The second check is to find whether the current day is on the list of days to check, and as we know that it is not the same day as today from the first if statement,
                // we know that the reminder will have occurred and return true.
                if (!!reminder.daysRepeated.find(d => d == days[checkDate]))
                {
                    return true;
                }
            }
        }
        
    }
    // Return false if none of the above conditions were met as the reminder will not have occurred.
    return false;
}

// This function calculates all week statistics from a list of passed reviews. It returns these statistics in an array of objects.
function findAllWeekStatistics(passedReviews)
{
    let weekStatistics = [];
    // It first iterates through each review and determines whether it has a date set.
    for (let review of passedReviews)
    {
        if (review.date != null)
        {
            // If it does, it finds what week it would correspond to (Sun-Sat) and determines whether there is already a statistic for that week created.
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
                // If there is, it simply pushes the current review's information onto the found statistic.
                let sameWeek = weekStatistics.find(w => w.header == statisticHeader);
                sameWeek.reviewIds.push(review.reviewID);
                sameWeek.ratings.push(review.rating);
            }
            else
            {
                // If there is not, it creates a new statistic and pushes the current review's information onto this statistic.
                weekStatistics.push({
                    header: statisticHeader,
                    reviewIds: [review.reviewID],
                    ratings: [review.rating],
                    overallRating: -1   
                });
            }
        }
    }
    // After all reviews have been checked and the appropriate ones have been added, it iterates through each statistic to determine its average rating from each review.
    for (let statistic of weekStatistics)
    {
        let runningTotal = 0;
        for (let rating of statistic.ratings)
        {
            runningTotal += parseInt(rating);
        }
        let truncateVariable = (runningTotal / statistic.ratings.length);
        // This bit of math simply makes it so decimals are limited to the tenth place.
        truncateVariable = Math.trunc(truncateVariable*10) / 10;
        statistic.overallRating = truncateVariable;
    }
    // It then returns the created statistics.
    return weekStatistics;
}

// This function calculates all day statistics from a list of passed reviews. It returns these statistics in an array of objects.
function findAllDayStatistics(passedReviews)
{
    let dayStatistics = [];
    // It first iterates through each review and determines whether it has a date set.
    for (let review of passedReviews)
    {
        if (review.date != null)
        {
            // If it does, it finds what day it corresponds to and determines whether there is already a statistic for that day created.
            let dateParts = review.date.split('-');
            let setDate = new Date(dateParts[0], dateParts[1]-1, dateParts[2]);
            let statisticHeader = setDate.toLocaleDateString();
            if (!!dayStatistics.find(d => d.header == statisticHeader))
            {
                // If there is, it simply pushes the current review's information onto the found statistic.
                let sameDay = dayStatistics.find(d => d.header == statisticHeader);
                sameDay.reviewIds.push(review.reviewID);
                sameDay.ratings.push(review.rating);
            }
            else
            {
                // If there is not, it creates a new statistic and pushes the current review's information onto this statistic.
                dayStatistics.push({
                    header: statisticHeader,
                    reviewIds: [review.reviewID],
                    ratings: [review.rating],
                    overallRating: -1
                });
            }
        }
    }
    // After all reviews have been checked and the appropriate ones have been added, it iterates through each statistic to determine its average rating from each review.
    for (let statistic of dayStatistics)
    {
        let runningTotal = 0;
        for (let rating of statistic.ratings)
        {
            runningTotal += parseInt(rating);
        }
        let truncateVariable = (runningTotal / statistic.ratings.length);
        // This bit of math simply makes it so decimals are limited to the tenth place.
        truncateVariable = Math.trunc(truncateVariable*10) / 10;
        statistic.overallRating = truncateVariable;
    }
    // It then returns the created statistics.
    return dayStatistics;
}

// This function simply sorts passed in week statistics by chronological date. It then returns the sorted week statistics.
function sortWeekStatistics(weekStatistics)
{
    // The built-in sort function is used here by checking the time of the first date in each statistic's header and comparing them.
    return (weekStatistics.sort( (a,b) => {
        let aParts = a.header.split('-')[0].split('/');
        let bParts = b.header.split('-')[0].split('/');
        let aDate = new Date(aParts[2], aParts[1], aParts[0]);
        let bDate = new Date(bParts[2], bParts[1], bParts[0]);
        return aDate - bDate;
    }));
}

// This function simply sorts passed in day statistics by chronological date. It then returns the sorted week statistics.
function sortDayStatistics(dayStatistics)
{
    // The built-in sort function is used here by checking the time of the date in each statistic's header and comparing them.
    return (dayStatistics.sort( (a,b) => {
        let aParts = a.header.split('/');
        let bParts = b.header.split('/');
        let aDate = new Date(aParts[2], aParts[1], aParts[0]);
        let bDate = new Date(bParts[2], bParts[1], bParts[0]);
        return aDate - bDate;
    }));
}

// This function returns all undeleted reminders in an array for a given userID. As there are a few things that need to be changed from the transition between the SQL server and this server, 
// a function is best suited rather than a simple query like most other requests.
async function getUndeletedRemindersForUserID(userID)
{
    // It first queries the database for all undeleted reminders for the userID.
    let remindersResult = await sqlRequest.query('SELECT * FROM RM.Reminders R WHERE R.isDeleted = 0 AND R.userID = ' + userID);
    passedReminders = remindersResult.recordset;
    // It then determines if there are no reminders and replaces the value with an empty array so the page can easily display the appropriate message.
    if (passedReminders == null)
    {
        passedReminders = [];
    }
    // It then iterates through each reminder and sets its daysRepeated and createdOn dates to be easily readable by the server and its various functions and pages.
    for (let reminder of passedReminders)
    {
        if (reminder.daysRepeated != null)
        {
            reminder.daysRepeated = reminder.daysRepeated.split(',');
        }
        let day = reminder.createdOn.getDate();
        let month = reminder.createdOn.getMonth() + 1;
        let year = reminder.createdOn.getFullYear();
        let hour = reminder.createdOn.getHours();
        let minute = reminder.createdOn.getMinutes();
        let second = reminder.createdOn.getSeconds();
        let newCreatedOn = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
        reminder.createdOn = newCreatedOn;
    }
    // It then returns these reminders.
    return passedReminders;
}

// This function returns all reminders in an array for a given userID. As there are a few things that need to be changed from the transition between the SQL server and this server, 
// a function is best suited rather than a simple query like most other requests.
async function getAllRemindersForUserID(userID)
{
    // It first queries the database for all reminders for the userID.
    let remindersResult = await sqlRequest.query('SELECT * FROM RM.Reminders R WHERE R.userID = ' + userID);
    passedReminders = remindersResult.recordset;
    // It then determines if there are no reminders and replaces the value with an empty array so the page can easily display the appropriate message.
    if (passedReminders == null)
    {
        passedReminders = [];
    }
    // It then iterates through each reminder and sets its daysRepeated and createdOn dates to be easily readable by the server and its various functions and pages.
    for (let reminder of passedReminders)
    {
        if (reminder.daysRepeated != null)
        {
            reminder.daysRepeated = reminder.daysRepeated.split(',');
        }
        let day = reminder.createdOn.getDate();
        let month = reminder.createdOn.getMonth() + 1;
        let year = reminder.createdOn.getFullYear();
        let hour = reminder.createdOn.getHours();
        let minute = reminder.createdOn.getMinutes();
        let second = reminder.createdOn.getSeconds();
        let newCreatedOn = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
        reminder.createdOn = newCreatedOn;
    }
    // It then returns these reminders.
    return passedReminders;
}

// This function returns all undeleted lists for the passed userID. As the list items are held in a different table, a function is best suited
// rather than a simple query like most other requests.
async function getUndeletedListsForUserID(userID)
{
    // It first queries the database for all undeleted lists for the userID.
    let listsResult = await sqlRequest.query('SELECT listID, name FROM RM.Lists L WHERE L.isDeleted = 0 AND L.userID = ' + userID);
    let passedLists = [];
    // It then iterates through each of these lists to find all items for each list.
    for (let list of listsResult.recordset) {
        let itemsResult = await sqlRequest.query('SELECT description, checked FROM RM.ListItems LI WHERE LI.listID = ' + list.listID);
        let newList = {
            listID: list.listID,
            name: list.name,
            items: [],
            isDeleted: false
        };
        for (let item of itemsResult.recordset)
        {
            // This converts the bit checked value in SQL to the boolean used on pages.
            let checkedResult;
            if (item.checked == 0)
            {
                checkedResult = false;
            }
            else
            {
                checkedResult = true;
            }
            let newItem = [item.description, checkedResult];
            newList.items.push(newItem);
        }
        passedLists.push(newList);
    }
    // It then determines if there are no lists and replaces the value with an empty array so the page can easily display the appropriate message.
    if (passedLists == null)
    {
        passedLists = [];
    }
    // It then returns these lists.
    return passedLists;
}

// This function returns all custom item groups for the passed userID. As the group items are held in a different table, a function is best suited 
// rather than a simple query like most other requests.
async function getCustomItemGroupsForUserID(userID)
{
    // It first queries the database for all custom item groups for the userID.
    let customItemGroupsResult = await sqlRequest.query('SELECT groupID, name FROM RM.CustomItemGroups CIG WHERE CIG.userID = ' + userID);
    let passedCustomItemGroups = [];
    // It then iterates through each of these custom groups to find all items for each group.
    for (let group of customItemGroupsResult.recordset) {
        let groupItemsResult = await sqlRequest.query('SELECT description FROM RM.CustomItemGroupItems CIG WHERE CIG.groupID = ' + group.groupID);
        let newGroup = {
            title: group.name,
            groupID: group.groupID,
            items: []
        };
        for (let item of groupItemsResult.recordset)
        {
            newGroup.items.push([item.description, false]);
        }
        passedCustomItemGroups.push(newGroup);
    }
    // It then determines if there are no groups and replaces the value with an empty array so the page can easily display the appropriate message.
    if (passedCustomItemGroups == null)
    {
        passedCustomItemGroups = [];
    }
    // It then returns these custom groups.
    return passedCustomItemGroups;
}

// This function returns all undeleted reviews for the passed userID. This was added mostly for consistency's sake as most other resources have this function.
async function getUndeletedReviewsForUserID(userID)
{
    // It first queries the database for all undeleted reviews for the userID.
    let reviewsResult = await sqlRequest.query('SELECT * FROM RM.Reviews R WHERE R.isDeleted = 0 AND R.userID = ' + userID);
    passedReviews = reviewsResult.recordset;
    // It then determines if there are no reviews and replaces the value with an empty array so the page can easily display the appropriate message.
    if (passedReviews == null)
    {
        passedReviews = [];
    }
    // It then returns these reviews.
    return passedReviews;
}

// This function returns a list for a given listID. As the list items are held in a different table, a function is best suited
// rather than a simple query like most other requests.
async function getListByListID(listID)
{
    // It first queries the database for the list, and then queries again for the items in the list.
    let listResult = await sqlRequest.query('SELECT listID, name FROM RM.Lists L WHERE L.listID = ' + listID);
    let list = listResult.recordset[0];
    let itemsResult = await sqlRequest.query('SELECT description, checked FROM RM.ListItems LI WHERE LI.listID = ' + list.listID);
    let newList = {
        listID: list.listID,
        name: list.name,
        items: [],
        isDeleted: false
    };
    for (let item of itemsResult.recordset)
    {
        // This converts the bit checked value in SQL to the boolean used on pages.
        let checkedResult;
        if (item.checked == 0)
        {
            checkedResult = false;
        }
        else
        {
            checkedResult = true;
        }
        let newItem = [item.description, checkedResult];
        newList.items.push(newItem);
    }
    // It then returns the list.
    return newList;
}