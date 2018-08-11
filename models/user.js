const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    isPro: Boolean,
    therapy: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Therapy"
        },
        companyName: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);