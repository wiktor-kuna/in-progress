const express = require('express');
const gamesRouter = express.Router();
const {readFile} = require('fs/promises')
gamesRouter

    .get('/cw', (req, res) => {
        res.redirect('/static/games/cw');
        res.end();
    })

    .get('/cw/db/', async (req, res) => {
        const data = await readFile(__dirname + '/../db/games/cw/questions.json', 'utf-8');
        const newData = JSON.parse(data);
        res.json(newData);
    })

module.exports = {gamesRouter};