const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();

const {getHomePage} = require('./routes/index');
const {addAssignmentPage, addAssignment, deleteAssignment, editAssignment, editAssignmentPage, submitWork, submitWorkPage, getWorkPage, submitMark, submitMarkPage} = require('./routes/assignment');
const port = 2000;

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'assignmentdb'
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

// routes for the app

app.get('/', getHomePage);
app.get('/add', addAssignmentPage);
app.get('/edit/:id', editAssignmentPage);
app.get('/delete/:id', deleteAssignment);
app.get('/submit_work/:id', submitWorkPage);
app.get('/submit_work', getWorkPage);
app.get('/submit_mark/:id', submitMarkPage);
app.post('/add', addAssignment);
app.post('/edit/:id', editAssignment);
app.post('/submit_work/:id', submitWork);
app.post('/submit_mark/:id', submitMark);

// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
