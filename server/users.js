const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const auth = require('./auth.js');

const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

userSchema.pre('save', async function(next) {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // generate a salt
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);

        // has the password along with our new salt
        const hash = await bcrypt.hash(this.password, salt);

        // override the plaintext password with the hashed one
        this.password = hash;
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
});

userSchema.methods.comparePassword = async function(password) {
    try {
        const isMatch = await bcrypt.compare(password, this.password);
        return isMatch;
    } catch (error) {
        return false;
    }
};

userSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}

const User = mongoose.model('User', userSchema);

// create a new user
router.post('/', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send({
            message: "username and password are required"
        });
    }

    try {
        // check to see if username already exists
        const existingUser = await User.findOne({
            username: req.body.username
        });
        if (existingUser) {
            return res.status(403).send({
                message: "username already exists"
            });
        }

        // now we create a new user
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });

        await user.save();
        return res.send(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});