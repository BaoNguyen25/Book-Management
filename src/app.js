"use strict";

const express = require('express');
const app = express();
const session = require('express-session');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const passport = require('./config/config.passport');

//apply middleware
app.use(helmet(
    {
        contentSecurityPolicy: false,
    }
));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//set view engine
app.set('view engine', 'ejs');

//attach dbs
require('./dbs/init.mongoose');

//attach routes
app.use('/', require('./routes/index'));

module.exports = app;
