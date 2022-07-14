const express = require('express');
const gamesRouter = express.Router();
const {readFile, readdir} = require('fs/promises');
const {logUsersList} = require('./mainRouter'); 
const { UserRecord } = require('../records/user.record');

gamesRouter

    .get('/cw', (req, res) => {
        res.redirect('/static/games/cw');
        res.end();
    })

    .get('/cw/editor/:user?/:id?', async (req, res) => {
        if (
            (req.cookies.log !== 'true') ||
            (logUsersList[req.cookies.user.login] !== req.cookies.user.id) ||
            (await UserRecord.isActive(req.cookies.user.login) !== 1)
        ) {
            res.cookie('log', 'false');
            res.cookie('user', {});
            res.redirect('/main/login');
            res.end();
        } else if (
            (req.params.id === undefined) &&
            (req.params.user === undefined)
            ) {
                res.json({login: req.cookies.user.login})
        } else if (
            (req.params.id === undefined)
        ) {
            const list = await readdir(__dirname + `/../db/games/cw/users/${req.cookies.user.login}`);
            console.log("list", list);
            res.json(list);  
        }
    })

    .get('/cw/db/', async (req, res) => {
        const data = await readFile(__dirname + '/../db/games/cw/questions.json', 'utf-8');
        res.json(JSON.parse(data));
    })

module.exports = {gamesRouter};