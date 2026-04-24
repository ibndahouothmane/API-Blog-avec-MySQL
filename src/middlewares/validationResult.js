const { validationResult } = require('express-validator');

function verifierValidation(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            erreurs: errors.array()
        });
    }

    next();
}

module.exports = { verifierValidation };