const   express     = require('express'),
        Therapy     = require('../models/therapy'),
        User        = require('../models/user'),
        router      = express.Router();

        
router.get('/therapy/:id', (req, res) => {
    Therapy.findById(req.params.id, (err, foundTherapy) => {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {therapy: foundTherapy});
        }
    });
});

router.get("/profile/:id", isLoggedIn, (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            Therapy.find({'user.id': foundUser._id}, (err, foundTherapies) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(foundTherapies);
                    res.render("profile", {user: foundUser, therapies: foundTherapies});
                }
            });
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