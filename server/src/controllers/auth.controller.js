import { loginUser, logoutUser, refreshAuthToken, registerNewUser, requestPasswordReset, verifyUserEmail } from "../services/auth.service.js";

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

async function logout(req, res){
    try{
        const logoutStatus = await logoutUser(req);
        res.clearCookie("refreshToken");
        res.status(200).json({
            message: "Logged out successfully"
        })
    }catch(err){
        res.status(400).json({ message: err.message });
    }
}

async function verifyEmail(req, res){
    try{
        const verificationStatus = await verifyUserEmail(req);
        res.status(200).json(verificationStatus);
    }catch(err){
        res.status(400).json({message: err.message});
    }
}

async function passwordResetRequest(req, res){
    try{
        const response = await requestPasswordReset(req);
        res.status(200).json(response)
    }catch(err){
        res.status(400).json({message: err.message})
    }
}

export {
    signup,
    login,
    logout,
    getAuthToken,
    verifyEmail,
    passwordResetRequest
}