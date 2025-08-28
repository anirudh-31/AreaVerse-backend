import { loginUser, registerNewUser } from "../services/auth.service.js";

async function signup(req, res){
    try{
        const signupResult = await registerNewUser(req.body);
        res.status(200).json(signupResult);
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
        res.status(200).json(loginResult);
    }catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export {
    signup,
    login
}