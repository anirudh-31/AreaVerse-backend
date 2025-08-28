import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Extracting run-time properties \\
const ACCESS_TOKEN    = process.env.JWT_ACCESS_SECRET    || 'access-token';
const REFRESH_TOKEN   = process.env.JWT_REFRESH_SECRET   || 'refresh-token';
const ACCESS_EXPIRES  = process.env.ACCESS_TOKEN_EXPIRES || '15m';
const REFRESH_EXPIRES = process.env.REFRES_TOKEN_EXPIRES || '7d';

/**
 * Function to generate the access token for the specified user.
 * @param {String} userId 
 * @returns AccessToken
 */
function generateAccessToken (userId) {
    return jwt.sign({userId}, ACCESS_TOKEN, { expiresIn: ACCESS_EXPIRES});
};

/**
 * Function to generate the refresh token for the specified user.
 * @param {String} userId 
 * @returns RefreshToken
 */
function generateRefreshToken (userId) {
    return jwt.sign({userId}, REFRESH_TOKEN, { expiresIn: REFRESH_EXPIRES});
}

/**
 * Function to check if the specified token is valid.
 * @param {String} token 
 * @returns Whether the token is valid
 */
function verifyAccessToken (token) {
    return jwt.verify(token, ACCESS_TOKEN);
}

/**
 * Function to check if 
 * @param {String} token 
 * @returns 
 */
function verifyRefreshToken (token) {
    return jwt.verify(token, REFRESH_TOKEN);
}


export {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}