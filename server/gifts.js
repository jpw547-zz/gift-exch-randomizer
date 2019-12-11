const mongoose = require('mongoose');
const express = require('express');
const auth = require('./auth.js');
const router = express.Router();


const giftSchema = new mongoose.Schema({
    user: String,
    name: String,
    year: Number,
    mapping: {
        type: Map,
        of: String
    }
});

const Gift = mongoose.model('Gift', giftSchema);

// get gift lists
router.get('/', async(req, res) => {
    try {
        const giftList = await Gift.find();
        return res.send(giftList);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

// add a gift list
router.post('/', async(req, res) => {
    const gift = new Gift({
        user: req.body.user,
        name: req.body.name,
        year: req.body.year,
        mapping: req.body.mapping
    });
    try {
        console.log("saving list...", gift)
        await gift.save();
        return res.send(gift);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

// update a gift list
router.put('/:id', auth.verifyToken, async(req, res) => {
    try {
        const g = await Gift.findOne({
            _id: req.params.id
        });
        if (!g) {
            return res.status(404).send({
                error: "list not found"
            });
        }

        g.name = req.body.name;
        g.year = req.body.year;
        g.mapping = req.body.mapping;

        console.log("saving list...", g)
        await g.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})

// delete a gift list
router.delete('/:id', auth.verifyToken, async(req, res) => {
    try {
        await Gift.deleteOne({
            _id: req.params.id
        });
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

// assign names for a gift list
router.put('/', async(req, res) => {
    let gift = {
        _id: req.body._id,
        user: req.body.user,
        name: req.body.name,
        year: req.body.year,
        mapping: req.body.mapping
    };

    let keyList = Object.keys(gift.mapping);
    let usedNames = [];
    let today = new Date(Date.now());
    let newList = {
        _id: '',
        user: gift.user,
        name: gift.name,
        year: today.getFullYear(),
        mapping: {}
    };

    for (const name of keyList) {
        let recipient = '';
        let valid = false;

        while (!valid) {
            recipient = keyList[Math.floor(Math.random() * keyList.length)];
            if (recipient != name && gift.mapping[name] != recipient && !usedNames.includes(recipient)) {
                valid = true;
            }
        }

        console.log("unused name - ", recipient);

        newList.mapping[name] = recipient;
        usedNames.push(recipient);
    }

    usedNames = [];

    return res.status(200).send(newList);
})

module.exports = router;