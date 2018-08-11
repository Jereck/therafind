const   express     = require('express'),
        passport    = require('passport'),
        Therapy     = require('../models/therapy'),
        User        = require('../models/user'),
        router      = express.Router();

// BASIC USER REGISTRATION
router.post('/b-user-reg', (req, res) => {
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

router.get("/basic-setup", (req, res) => {
    res.render("basic-setup");
});

router.post('/basic-therapy-register', isLoggedIn, (req, res) => {
    let name = req.body.companyName;
    let add = req.body.address;
    let city = req.body.city;
    let state = req.body.state;
    let zip = req.body.zip;
    let user = {
        id: req.user._id,
        username: req.user.username
    };
    
    let newTherapy = {
        companyName: name,
        address: add,
        city: city,
        state: state,
        zip: zip,
        user: user
    };

    Therapy.create(newTherapy, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/");
        }
    });
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;