import { follow, getFollowers, getFollowing, unfollow } from "../services/follow.service.js";


async function followUser(req, res){
    await follow(req, res);
}

async function unfollowUser(req, res){
    await unfollow(req, res)
}

async function getFollowerList(req, res){
    await getFollowers(req, res)
}

async function getFollowingList(req, res){
    await getFollowing(req, res)
}
export {
    followUser,
    unfollowUser,
    getFollowerList,
    getFollowingList
}