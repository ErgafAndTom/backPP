require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER || 'PrintPeaks',
        password: process.env.DB_PASS || 'Kv14061992',
        database: process.env.DB_NAME || 'printpeaksdbnew',
        host: process.env.DB_HOST || '127.0.0.1',
        dialect: 'mysql',
    },
};

