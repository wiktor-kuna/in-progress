const express = require('express');
const mainRouter = express.Router();
const { UserRecord } = require('../records/user.record');
const {v4: uuid} = require('uuid');
const logUsersList = {};

mainRouter
    .get('/', (req, res) => {
        res.render('start');
    })

    .get('/logout', (req, res) => {
        res.cookie('log', 'false');
        res.cookie('user', {});
        res.redirect('/');
        res.end();
    })

    //no REST :(
    .get('/delete', async (req, res) => {
        if ((req.cookies.log === 'true') && (logUsersList[req.cookies.user.login] === req.cookies.user.id)) {
            await UserRecord.delete(req.cookies.user.login);
            res.redirect('/main/logout');
            res.end();
        } else {
            res.redirect('/main/profile');
            res.end();
        }
    })

    .get('/login', (req, res) => {
        if ((req.cookies.log === 'true') && (logUsersList[req.cookies.user.login] === req.cookies.user.id)) {
            res.redirect('/main/profile');
            res.end();
        } else {
            res.render('login');
        }
    })

    .post('/login', async (req, res) => {
        try {
            const user = await UserRecord.login(req.body.login, req.body.password);
            console.log('Tadam!: ',user)
            res.cookie('log', 'true');
            const id = uuid();
            res.cookie('user', {
                login: user.login,
                id,
            });
            logUsersList[user.login] = id;
            res.end("ok");

        } catch (e) {
            console.log(e.message);
            res.cookie('log', 'false');
            res.end();
        }
    })

    .get('/profile', async (req, res) => {
        if (req.cookies.log !== 'true') {
            res.redirect('/main/login');
            res.end();
        } else if (logUsersList[req.cookies.user.login] !== req.cookies.user.id) {
            res.cookie('log', 'false');
            res.cookie('user', {});
            res.redirect('/main/login');
            res.end();
        } else {
            res.render('profile', { 
                login: req.cookies.user.login, 
                coins: await UserRecord.loadCoins(req.cookies.user.login),
                isActive: await UserRecord.isActive(req.cookies.user.login), 
                isAdmin: await UserRecord.isAdmin(req.cookies.user.login)});
        }
    })

    .get('/control/:param?/:user?', async (req, res) => {
        if (
            (req.cookies.log !== 'true') ||
            (logUsersList[req.cookies.user.login] !== req.cookies.user.id) ||
            (await UserRecord.isAdmin(req.cookies.user.login) !== 1)
        ) {
            res.cookie('log', 'false');
            res.cookie('user', {});
            res.redirect('/main/login');
            res.end();
        } else if (req.params.param && req.params.user) {
            const user = req.params.user;
            const param = req.params.param;
            if (param === "activate") {
                await UserRecord.changeActive(user);
                res.redirect('/main/control');
                res.end();
            } else if (param === "admin") {
                await UserRecord.changeAdmin(user);
                res.redirect('/main/control');
                res.end();
            }
        }
        
        else {    
            res.render('control', {
                isAdmin: await UserRecord.isAdmin(req.cookies.user.login),
                results: await UserRecord.getToActivate(),           
            });
        }
    })

    .get('/form', (req, res) => {
        res.render('form');
    })

    .post('/form', async (req, res) => {
        try {
            const person = new UserRecord({
                login: req.body.login,
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                password: req.body.password,
            }, true);
            const login = await person.insert();
            if (login === req.body.login) {
                res.end("OK. User is added.")
            } 
        } catch (e) {
            res.end(e.message);
        }
    })

    .post('/coins/:what?', async (req, res) => {

        const login = req.cookies.user.login;
        const coins = await UserRecord.loadCoins(login);
        if (req.params.what === "add") {
            await UserRecord.saveCoins(login, coins + 1);
            res.end((coins + 1) + '');
        } else if (req.params.what === undefined) {
            res.end(coins + '');
        }
    })

    .get('/test', async (req, res) => {
        await UserRecord.all();
        res.end();
    })
module.exports = {
    mainRouter,
    logUsersList
}