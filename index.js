const express = require('express'),
    mysql = require('mysql'),
    bodyParser = require('body-parser'),
    app = express();

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
        console.log(results);
        res.render('therapies', {
            therapies: results
        });

    });
});

// app.get('/therapies', (req, res) => {
//     let therapies = 'SELECT * FROM therapies';
//     let query = db.query(therapies, (err, result) => {
//         if (err) throw err;
//         res.render("therapies", {
//             therapies: result
//         });
//     });
// });

app.get('/register', (req, res) => {
    res.render("register");
});

app.post('/register', (req, res) => {
    // Create new therapy
    let therapy = req.body.therapy;
    let sql = 'INSERT INTO therapies SET ?';
    let query = db.query(sql, therapy, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.redirect('/therapies');
    });
});

app.get('/createtable', (req, res) => {
    var sql = 'CREATE TABLE therapies(id int AUTO_INCREMENT, name VARCHAR(255), street1 VARCHAR(255), street2 VARCHAR(255), city VARCHAR(255), state VARCHAR(255), zip VARCHAR(255), type VARCHAR(255), website VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send("Table created!");
    });
});

app.get('/droptable', (req, res) => {
    var sql = "DROP TABLE therapy";
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send("Table deleted");
    });
});

app.get('/addfield', (req, res) => {
    var sql = "ALTER TABLE therapies ADD COLUMN email VARCHAR(255)";
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send("Email column added to table");
    });
});

app.get('/getwashington', (req, res) => {
    db.query("SELECT * FROM therapies WHERE state = 'Washington'", (err, result, fields) => {
        if(err) throw err;
        res.send(result);
    });
});

app.get('/gettherapy/:id', (req, res) => {
    let sql = `SELECT * FROM therapies WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
    })
})


app.listen('3000', () => {
    console.log("Server started on port 3000");
});