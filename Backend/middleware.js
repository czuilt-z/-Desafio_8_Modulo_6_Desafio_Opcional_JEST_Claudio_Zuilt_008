
const jwt = require('jsonwebtoken');
const { secretKey } = require('./utils');

const verificarToken = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            message: 'Token no proporcionado'
        });
    }

    const token = authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Token no proporcionado'
        });
    }

    try {
        jwt.verify(token, secretKey);
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Token inválido o expirado'
        });
    }
};

module.exports = { verificarToken };
