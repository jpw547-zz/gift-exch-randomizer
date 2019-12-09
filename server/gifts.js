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
        await Gift.save();
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

module.exports = router;