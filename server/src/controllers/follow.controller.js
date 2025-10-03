import { follow, unfollow } from "../services/follow.service.js";


async function followUser(req, res){
    await follow(req, res);
}

async function unfollowUser(req, res){
    await unfollow(req, res)
}
export {
    followUser,
    unfollowUser
}