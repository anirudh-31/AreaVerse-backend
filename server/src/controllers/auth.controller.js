import { loginUser, refreshAuthToken, registerNewUser } from "../services/auth.service.js";

async function signup(req, res){
    try{
        const signupResult = await registerNewUser(req.body);
        res.cookie("refreshToken", signupResult.refreshToken, {
            httpOnly: true,
            secure  : process.env.NODE_ENV === "production",
            sameSite: "strict",
            path    : "/",
            maxAge  : 7 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            token: signupResult.token,
            user : signupResult.user
        });
    }catch(err){
        res.status(400).json({
            error: err.message
        })
    }
}

async function login(req, res){
    try{
        const {userEmailOrUserName, password} = req.body;
        const loginResult = await loginUser(userEmailOrUserName, password);
        res.cookie("refreshToken", loginResult.refreshToken, {
            httpOnly: true,
            secure  : process.env.NODE_ENV === "production",
            sameSite: "strict",
            path    : "/",
            maxAge  : 7 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            token: loginResult.token,
            user : loginResult.user
        });
    }catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function getAuthToken(req, res){
    try{
        const refreshTokenResult = await refreshAuthToken(req);
        res.status(200).send({
            token: refreshTokenResult.token
        })
    }catch(err){
        res.status(401).json({ error: err.message });
    }
}

export {
    signup,
    login,
    getAuthToken
}