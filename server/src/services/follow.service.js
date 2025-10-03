import { prisma } from "../prisma/client.prisma.js";

/**
 * Function to follow a user
 * @param {Request} req 
 * @param {Response} res 
 */
async function follow(req, res){
    const { user }       = req;
    const userIdToFollow = req.params.id;
    const userIdFollowing= user.id;
    console.log({userIdFollowing, userIdToFollow})
    if (userIdFollowing ===  userIdToFollow){
        res.status(200).json({error: "You cannot follow yourself!"})
    }

    // Ensuring that the user being followed exists.
    const targerUser = await prisma.user.findUnique({
        where: {
            id: userIdToFollow
        },
        select: {
            id: true
        }
    });

    // If the user being followed does not exists, then return an error.
    if(!targerUser){
        res.status(404).json({
            error: "User being followed does not exist!"
        })
    }

    // If the user being followed exists, check if the requestor is already following the user.
    const following = await prisma.follow.findUnique({
        where: {
            followerId_followingId : {
                                        followingId: userIdToFollow,
                                        followerId : userIdFollowing
                                    }
        }
    })

    // If the requestor already follows the user, return an error.
    if(following){
        res.status(404).json({
            error: "You already follow this user!"
        })
    }

    // The requestor does not follow the user, create a new record.
    const follows = await prisma.follow.create({
        data: {
            followingId: userIdToFollow,
            followerId : userIdFollowing 
        }
    })
    console.log(follows)

    res.status(200).json({
        message: "You are now following the user."
    })
}

async function unfollow(req, res){
    const { user }         = req;
    const userIdToUnFollow = req.params.id;
    const userIdFollowing  = user.id;

    const unfollowed = await prisma.follow.deleteMany({
        where: {
            followingId: userIdToUnFollow,
            followerId : userIdFollowing
        }
    })
    
    if(unfollowed.count === 0){
        res.status(404).json({
            error: "You dont follow this user."
        })
    }

    res.status(200).json({
        message: "You have unfollowed this user!"
    })
}

async function getFollowStats(userId){
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if (!user){
        throw new Error("Invalid user");
    }

    const [followers, following] = await Promise.all([
        await prisma.follow.count({
            where: {
                followingId: userId 
            }
        }),

        await prisma.follow.count({
            where: {
                followerId: userId
            }
        })
    ]);

    return {
        followers, 
        following
    }
}

console.log(await getFollowStats("9b73ff3e-061a-4a87-8ee2-c961cedf3603"));

export {
    follow,
    unfollow,
    getFollowStats
}