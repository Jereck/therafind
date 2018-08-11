const mongoose = require('mongoose');

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

module.exports = mongoose.model("Therapy", therapySchema);