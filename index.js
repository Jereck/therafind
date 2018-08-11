const   express         = require('express'),
        mysql           = require('mysql'),
        bodyParser      = require('body-parser'),
        mongoose        = require('mongoose'),
        passport        = require('passport'),
        LocalStrategy   = require('passport-local'),

        Therapy         = require('./models/therapy'),
        User            = require('./models/user'),
        app             = express();

var port = process.env.PORT || 3000;

// MONGOOSE
mongoose.connect('mongodb://Jereck:stella1011@ds119422.mlab.com:19422/therafind')

// BODY PARSER SETUP
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// STATIC FILES
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));


// VIEW ENGINE
app.set("view engine", "ejs");

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Stella is the best dog ever!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
                res.render("therapies", {therapies: therapies});
            }
        }
    )
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/therapy/:id', (req, res) => {
    Therapy.findById(req.params.id, (err, foundTherapy) => {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {therapy: foundTherapy});
        }
    });
});

app.get('/register', (req, res) => {
    res.render("register");
});

app.post('/register', (req, res) => {
    let therapy = req.body.therapy;
    let user = req.body.user;

    let newUser = new User({ username: req.body.user.email });

    User.register(newUser, req.body.user.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render("/register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/");
        });
    });

    Therapy.create(therapy, user, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/login"
    }), (req, res) => {
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

app.listen(port, () => {
    console.log("Server started on port: " + port);
});