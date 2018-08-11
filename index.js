const   express         = require('express'),
        mysql           = require('mysql'),
        bodyParser      = require('body-parser'),
        mongoose        = require('mongoose'),
        passport        = require('passport'),
        flash           = require('connect-flash'),
        crypto          = require('crypto'),
        sess            = require('express-session'),
        LocalStrategy   = require('passport-local'),
        app             = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));

app.set("view engine", "ejs");

// MONGOOSE
mongoose.connect('mongodb://Jereck:stella1011@ds119422.mlab.com:19422/therafind')
// SCHEMA SETUP
const therapySchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    street1: String,
    street2: String,
    city: String,
    state: String,
    zip: String,
    type: String,
    website: String
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const Therapy = mongoose.model("Therapy", therapySchema);
const User = mongoose.model("User", userSchema);

app.get('/', (req, res) => {
    res.render('index');
});

app.get("/therapies", (req, res) => {
    Therapy.find({}, (err, therapies) =>{
        if(err) {
            console.log(err);
        } else {
            res.render("therapies", {therapies: therapies})
        }
    });
});

app.post('/search', (req, res) => {
    let searchParam = req.body.search;
    Therapy.find(
        {
            $or: [
                { state: searchParam },
                { city: searchParam },
                { zip: searchParam }
            ]
        }, (err, therapies) => {
            if (err) {
                console.log(err);
            } else {
                console.log(therapies);
                res.render("therapies", {therapies: therapies});
            }
        }
    )
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/register', (req, res) => {
    res.render("register");
});

app.post('/register', (req, res) => {
    let therapy = req.body.therapy;
    let user = req.body.user;

    Therapy.create(therapy, user, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

app.listen(port, () => {
    console.log("Server started on port: " + port);
});