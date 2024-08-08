const { config } = require('../../config');

const { sign, verify } = require('jsonwebtoken');

const createToken = (payload) => sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiration });

const checkToken = (token, callback) => verify(token, config.jwtSecret, callback);

module.exports = {
    createToken,
    checkToken,
}