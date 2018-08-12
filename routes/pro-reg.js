const   express     = require('express'),
        passport    = require('passport'),
        Therapy     = require('../models/therapy'),
        User        = require('../models/user'),
        stripe      = require('stripe')('sk_test_LmFARXcxDCRwRUrFTVxB7L3Y'),
        router      = express.Router();

// PRO USER REGISTRATION
router.post('/p-user-reg', (req, res) => {
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

// ROUTE FOR PRO THERAPY SETUP
router.get('/pro-setup', (req, res) => {
    res.render("pro-setup");
});

// PRO THERAPY REGISTRATION
router.post('/pro-therapy-register', isLoggedIn, (req, res) => {
    let name = req.body.companyName;
    let add = req.body.address;
    let city = req.body.city;
    let state = req.body.state;
    let zip = req.body.zip;
    let web = req.body.website;
    let desc = req.body.description;
    let phone = req.body.phone;
    let email = req.body.email;
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
        website: web,
        description: desc,
        phone: phone,
        email: email,
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