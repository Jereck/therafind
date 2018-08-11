const   express     = require('express'),
        Therapy     = require('../models/therapy'),
        User        = require('../models/user'),
        router      = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/search', (req, res) => {
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

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/register', (req, res) => {
    res.render("options");
});

router.get('/register/:tagId', (req, res) => {
    if (req.params.tagId == 'basic') {
        res.render("basic-register");
    }
    if (req.params.tagId == 'pro') {
        res.render("pro-register");
    }
});



module.exports = router;