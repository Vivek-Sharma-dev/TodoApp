import crypto from 'crypto';
import jwt from 'jsonwebtoken'
import config from '../config/config.js';


export const generateRefreshToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
    }, config.JWT_SECRET, {
        expiresIn: config.REFRESH_TOKEN_EXPIRY
    })
}

export const generateAccessToken = (user, sessionId) => {
    return jwt.sign({
        id: user.id,
        sessionId: sessionId,
        email: user.email,
    }, config.JWT_SECRET, {
        expiresIn: config.ACCESS_TOKEN_EXPIRY
    })
}


export const generateHashedRefreshToken = (refreshToken) => {
    return crypto.createHash('sha256').update(refreshToken).digest('hex')
}