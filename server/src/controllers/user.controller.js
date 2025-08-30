import { getMe } from "../services/user.service.js";

async function getMyDetails(req, res){
    try{
        const userId = req.user.id;
        const userDetails = await getMe(userId);
        res.status(200).send(userDetails)
    }catch(err){
        res.status(400).send({error: err.message})
    }
}

export {
    getMyDetails
}