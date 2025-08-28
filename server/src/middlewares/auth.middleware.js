import {verifyAccessToken} from '../utils/jwt.js'

function authenticateToken(req, res, next) {
    const authHeader = req.headers['Authorization'];
    const token      = authHeader && authHeader.split(' ')[1];

    // Check if a token is actually present in the header. 
    // If it isn't then respond with a 401 Unauthorized error.
    if(!token){
        res.status(401).json({
            error: 'Access token required'
        })
    }

    // If the token is present, validate the token.
    // If the token is valid extract the payload, 
    // add it the the incomming request and move on to the next process.
    // If it is not valid respond with a 403 Forbidden error.
    try{
        const tokenPayload = verifyAccessToken(token)
        req.user           = tokenPayload;
        next();
    } catch(err){
        return res.status(403).json({
            error: 'Invalid or expired token'
        })
    };
}

export {
    authenticateToken
}