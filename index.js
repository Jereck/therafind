const   express         = require('express'),
        bodyParser      = require('body-parser'),
        mongoose        = require('mongoose'),
        passport        = require('passport'),
        LocalStrategy   = require('passport-local'),

        Therapy         = require('./models/therapy'),
        User            = require('./models/user'),
        app             = express();

const   indexRoutes     = require('./routes/index'),
        basicRoutes     = require('./routes/basic-reg'),
        proRoutes       = require('./routes/pro-reg'),
        profileRoutes   = require('./routes/profile');

var port = process.env.PORT || 3000;

// MONGOOSE
mongoose.connect('mongodb://Jereck:stella1011@ds119422.mlab.com:19422/therafind', { useNewUrlParser: true });

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

app.use(indexRoutes);
app.use(basicRoutes);
app.use(proRoutes);
app.use(profileRoutes);

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
});

app.get('/getlocation', (req, res) => {
    
})

app.listen(port, () => {
    console.log("Server started on port: " + port);
});