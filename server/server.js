const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static('../public'));

// connect to the database
mongoose.connect('mongodb://localhost:27017/gift-exch', {
    useNewUrlParser: true
});

app.use(cookieParser());

const gifts = require('./gifts.js');
app.use('/api/gifts', gifts);
const users = require('./users.js');
app.use('/api/users', users);

app.listen(5730, () => console.log('Server listening on port 5730'));