import { prisma } from "../prisma/client.prisma.js";

/**
 * Function to get the users profile information
 * @param {Request} req 
 * @param {Response} res 
 */
async function getMe(userId){
    const userDetails = await prisma.user.findUnique({
        where  : {id: userId},
        select : {
            id           : true,
            email        : true,
            first_name   : true,
            last_name    : true,
            username     : true,
            profession   : true,
            createdAt    : true,
            dateOfBirth  : true,
            isVerified   : true,
            neighborhood : {
                                select : {
                                    name   : true,
                                    state  : true,
                                    city   : true,
                                    country: true
                                }  
                            }
        },
    })
    if (!userDetails){
        throw new Error("User not found");
    }

    const postCount = await prisma.post.count({
        where: {
            user_id : userId
        }
    })

    return {
        ...userDetails,
        postCount
    };
}

/**
 * Function to get posts created by a user
 * @param {*} req 
 * @returns 
 */
async function getMyPosts(req){
    const { user } = req;
    const { id   } = req.params;
    const page     = parseInt(req.query.page)  || 1;
    const limit    = parseInt(req.query.limit) || 3;
    const skip     = (page - 1) * limit;
    let totalPosts;
    let baseSelect = {
        where  : {
            user_id: id
        },
        select : {
            id         : true, 
            title      : true,
            description: true,
            createdAt  : true,
        },
        orderBy: {
            createdAt : 'desc'
        },
        take   : limit,
        skip
    }

    if(user.id !== id){
        baseSelect  = {
            ...baseSelect,
            where : {
                status : 'APPROVED',
                user_id: id
            }
        }
        totalPosts = await prisma.post.count({
            where: {
                status: 'APPROVED',
                user_id: id
            }
        })
    }else {
        totalPosts = await prisma.post.count({
            where: {
                user_id: id
            }
        })
    }
    
    const postList = await prisma.post.findMany(baseSelect)
    return {
        posts: postList,
        page,
        limit,
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit)
    }

}

async function getUser(userId){
    const userDetails = await prisma.user.findUnique({
        where  : {id: userId},
        select : {
            id           : true,
            first_name   : true,
            last_name    : true,
            username     : true,
            profession   : true,
            createdAt    : true,
            dateOfBirth  : true,
            isVerified   : true,
            neighborhood : {
                                select : {
                                    name   : true,
                                    state  : true,
                                    city   : true,
                                    country: true
                                }  
                            }
        },
    })
    if (!userDetails){
        throw new Error("User not found");
    }

    const postCount = await prisma.post.count({
        where: {
            user_id : userId,
            status: 'APPROVED'
        }
    })

    return {
        ...userDetails,
        postCount,
        followers: 0,
        following: 0
    };
}
export {
    getMe,
    getMyPosts,
    getUser
}