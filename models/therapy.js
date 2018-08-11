const mongoose = require('mongoose');

const therapySchema = new mongoose.Schema({
    companyName: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    website: String,
    description: String,
    phone: String,
    email: String,
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Therapy", therapySchema);