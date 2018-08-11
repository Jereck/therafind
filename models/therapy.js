const mongoose = require('mongoose');

const therapySchema = new mongoose.Schema({
    name: String,
    street1: String,
    street2: String,
    city: String,
    state: String,
    zip: String,
    type: String,
    website: String,
    owner: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Therapy", therapySchema);