const express = require('express');
const cors = require('cors');
const path = require('path');
const { getEnvVariable } = require('../config/env.js');
const logger = require('../config/logger.js');
const routes = require('../routes');


const app = express();
const PORT = getEnvVariable('PORT') || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: ['http://localhost:3000', "http://127.0.0.1:3000"],
    //   exposedHeaders: ['x-access-token'],
      })
    );

app.use(express.static(path.join(__dirname, '../../frontend/public')));  

app.use('/api', routes);

async function startServer() {
    try {
        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
        })
    } catch (error) {
        logger.error('Failed to start server:', error);
        throw error;
    }
}


module.exports = {
    app,
    startServer,

}