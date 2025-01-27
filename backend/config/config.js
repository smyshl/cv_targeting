const dotenv = require('dotenv');
const fs = require('fs');

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env'

if (!fs.existsSync(envFile)) {
    throw new Error(`${envFile} not found`);
};

dotenv.config({ path: envFile });


function getEnvVariable(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} is not set`);
    };
    return value;
}


module.exports = {
    getEnvVariable,

}