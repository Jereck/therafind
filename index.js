const   express         = require('express'),
        bodyParser      = require('body-parser'),
        mongoose        = require('mongoose'),
        passport        = require('passport'),
        LocalStrategy   = require('passport-local'),

        Therapy    = require('./models/therapy'),
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

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/register', (req, res) => {
    res.render("options");
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

app.get('/therapy/:id', (req, res) => {
    Therapy.findById(req.params.id, (err, foundTherapy) => {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {therapy: foundTherapy});
        }
    });
});


// BASIC USER REGISTRATION
app.post('/b-user-reg', (req, res) => {
    var newUser = new User(
        {
            username: req.body.username, 
            email: req.body.email,
            isPro: false
        }
    );
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render("basic-register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/basic-setup");
        });
    });
});

// PRO USER REGISTRATION
app.post('/p-user-reg', (req, res) => {
    var newUser = new User(
        {
            username: req.body.username, 
            email: req.body.email,
            isPro: true,
        }
    );
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render("pro-register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/pro-setup");
        });
    });
});

app.get("/basic-setup", (req, res) => {
    res.render("basic-setup");
});

app.get('/pro-setup', (req, res) => {
    res.render("pro-setup");
})

app.get("/profile/:id", isLoggedIn, (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            console.log(foundUser);
            res.render("profile", {user: foundUser});
        }
    });
});

app.get('/register/:tagId', (req, res) => {
    if (req.params.tagId == 'basic') {
        res.render("basic-register");
    }
    if (req.params.tagId == 'pro') {
        res.render("pro-register");
    }
});

app.post('/basic-therapy-register', isLoggedIn, (req, res) => {
    let therapy = req.body;

    Therapy.create(therapy, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            newlyCreated.user.id = req.user._id;
            newlyCreated.user.username = req.user.username;

            res.redirect("/");
        }
    });
});

app.post('/pro-therapy-register', isLoggedIn, (req, res) => {
    let therapy = req.body;

    Therapy.create(therapy, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            newlyCreated.user.id = req.user._id;
            newlyCreated.user.username = req.user.username

            res.redirect("/");
        }
    });
});



// LOGIN/LOG OUT LOGIC
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', passport.authenticate("local", { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/profile/' + req.user.id);
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

app.listen(port, () => {
    console.log("Server started on port: " + port);
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}