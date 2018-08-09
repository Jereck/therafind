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

//Create Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'therapyapi'
});

// Connect
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("MySql Connected");
});

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