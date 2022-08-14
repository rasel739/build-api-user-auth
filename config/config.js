const config = require('../config-env/config-env');

module.exports = {
    development: {
        username: config.pgdb.user,
        password: config.pgdb.password,
        database: config.pgdb.database,
        host: config.pgdb.host,
        dialect: config.pgdb.dialect,
    },
    test: {
        username: config.pgdb.user,
        password: config.pgdb.password,
        database: config.pgdb.database,
        host: config.pgdb.host,
        dialect: config.pgdb.dialect,
    },
    production: {
        username: config.pgdb.user,
        password: config.pgdb.password,
        database: config.pgdb.database,
        host: config.pgdb.host,
        dialect: config.pgdb.dialect,
    }
};