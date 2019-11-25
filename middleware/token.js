const User = require('../models/users');
const jwt = require('jsonwebtoken');
var dotenv = require('dotenv').config();

module.exports = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({
            message: 'No Authorization headers found'
        })
    } else {
        const token = authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                return next(err);
            } else {
                User.find((err) => {
                    if (err) return next(err);
                    else {
                        req.user = decoded.isAdmin;
                        next();
                    }
                })
            }
        })
    }
}