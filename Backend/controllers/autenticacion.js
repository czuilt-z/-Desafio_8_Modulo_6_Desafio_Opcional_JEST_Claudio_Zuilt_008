
const jwt = require('jsonwebtoken');
const { secretKey } = require('../utils');

const login = (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === '1234') {
        const token = jwt.sign(
            { username },
            secretKey,
            { expiresIn: '1h' }
        );

        return res.json({ token });
    }

    return res.status(400).json({
        message: 'Credenciales incorrectas'
    });
};

module.exports = { login };
