const dotenv = require('dotenv');
const fs = require('fs');
const logger = require('./logger.js');
const { resolve } = require('path');

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env'

if (!fs.existsSync(envFile)) {
    logger.error(`${envFile} not found`);
    throw new Error(`${envFile} not found`);
};

dotenv.config({ path: envFile });


function getEnvVariable(name) {
    const value = process.env[name];
    if (!value) {
        logger.error(`Environment variable ${name} is not set`);
        throw new Error(`Environment variable ${name} is not set`);
    };
    return value;
}


module.exports = {
    getEnvVariable,

}