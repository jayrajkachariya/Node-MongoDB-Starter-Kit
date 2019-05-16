'use strict';

require('dotenv').config();
require('colors');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const errorhandler = require('errorhandler');
const cors = require('cors');
const log4js = require('log4js');
const logger = require('./utils/logger');

const app = express();
app.use(log4js.connectLogger(logger, { level: 'info' }));

const config = require('./config.default');

mongoose.connect(config.db, { useNewUrlParser: true })
    .then(_ => logger.info(`Server connected to DB ${config.db}`))
    .catch(err => logger.error(err.name));

app.use(cors());
app.use(compression());
app.use(require('response-time')());
app.use(helmet.frameguard('sameorigin'));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

if (process.env.NODE_ENV === 'DEV') {
    app.use(errorhandler());
}

app.use('/api/v1', require('./api_v1'));

app.get('/', function(req, res) {
    res.send(`Welcome on to the port ${config.port}`);
});

app.listen(config.port, '127.0.0.1', function() {
    logger.info(`Listening on port ${config.port}`);
});
