import { getMe, getPostsByUser } from "../services/user.service.js";

async function getMyDetails(req, res){
    try{
        const userId = req.user.id;
        const userDetails = await getMe(userId);
        res.status(200).send(userDetails)
    }catch(err){
        res.status(400).send({error: err.message});
    }
}

async function getUserPosts(req, res){
    try {
        const posts = await getPostsByUser(req);
        res.status(200).json(posts)
    } catch (error) {
        res.status(400).send({error: error.message});
    }
}

export {
    getMyDetails,
    getUserPosts
}