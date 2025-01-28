const { startServer } = require('./server.js');
const logger = require('../config/logger.js');


process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err}`);
    console.error('Uncaught Exception:', err);
    process.exit(1);
});


process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection: ${reason}`);
    console.error('Unhandled Rejection:', reason);
    process.exit(1);
});

startServer();