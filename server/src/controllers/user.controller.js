import { getMe, getMyPosts, getUser } from "../services/user.service.js";

async function getMyDetails(req, res){
    try{
        const userId = req.user.id;
        const userDetails = await getMe(userId);
        res.status(200).json(userDetails)
    }catch(err){
        res.status(400).json({error: err.message});
    }
}

async function getUserPosts(req, res){
    try {
        const posts = await getMyPosts(req);
        res.status(200).json(posts)
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

async function getUserDetails(req, res){
    try {
        const userId = req.params.id;
        const userDetails = await getUser(userId);
        res.status(200).json(userDetails)
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}
export {
    getMyDetails,
    getUserPosts,
    getUserDetails
}