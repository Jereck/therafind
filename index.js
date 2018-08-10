const express = require('express'),
    mysql = require('mysql'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    flash = require('connect-flash'),
    crypto = require('crypto'),
    sess = require('express-session'),
    LocalStrategy = require('passport-local'),
    app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));

app.set("view engine", "ejs");

var db = mysql.createConnection({
    host : 'therafindapi.cunofn8qnv7c.us-west-1.rds.amazonaws.com',
    user : 'Jereck725',
    password : 'stella1011',
    port : '3306',
    database : 'therafindapi'
});

db.connect((err) => {
    if (err) {
        console.log('Database connection failed: ' + err.stack);
        return;
    }

    console.log('Connected to database');
});

// //Create Connection
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '123456',
//     database: 'therapyapi'
// });

// // Connect
// db.connect((err) => {
//     if (err) {
//         throw err;
//     }
//     console.log("Database Connected");
// });

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/search', (req, res) => {
    let searchParam = req.body.search;
    let sql = `SELECT * FROM therapies WHERE 
                state = '${searchParam}'
                or city ='${searchParam}'
                or zip = '${searchParam}'`;
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.render('therapies', {
            therapies: results
        });
        console.log(results);
    });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/register', (req, res) => {
    res.render("register");
});

app.post('/register', (req, res) => {
    let therapy = req.body.therapy;

    let sql = 'INSERT INTO therapies SET ?';
    let query = db.query(sql, therapy, (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});


app.listen(port, () => {
    console.log("Server started on port: " + port);
});