const log4js = require('log4js');
log4js.configure({
    appenders: {
        console: { type: 'console' },
        FILE: { type: 'file', filename: 'server.log' },
    },
    categories: {
        DEV: { appenders: ['console'], level: 'info' },
        PROD: { appenders: ['FILE'], level: 'info' },
        default: { appenders: ['console'], level: 'info' },
    },
});

const logger = process.env.NODE_ENV === 'PROD' ? log4js.getLogger('PROD') : log4js.getLogger('DEV');

module.exports = logger;
