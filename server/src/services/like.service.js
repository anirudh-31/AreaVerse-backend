import { Prisma } from "@prisma/client";
import { prisma } from "../prisma/client.prisma.js";

/**
 * Function to toggle the 'likes' on a post.
 * @param {Request}  req 
 * @param {Response} res 
 * @returns 
 */
async function toggleLike(req, res){
    const { id } = req.user;
    const userId = id;
    const postId = req.params.id;
    
    if(!userId || !postId) return res.status(400).json({
        error: "userId and postId are required!"
    });

    // check if the post exists
    const post = await prisma.post.findUnique({
        where: {
            id: postId
        },
        select : {
            id     : true,
            user_id: true
        }
    })

    // if the post does not exist, then throw an error.
    if(!post) return res.status(404).json({
        error: "Post not found."
    });

    // check if the user has already liked the post. 
    const existingLike = await prisma.like.findUnique({
        where: {
            userId_postId: {userId, postId}
        },
        select: {
            id: true
        }
    });

    // If the user has like the post, then delete the like (unlike).
    if(existingLike){
        await prisma.$transaction([
            prisma.like.delete({
                where: {
                    userId_postId: {
                        userId,
                        postId
                    }
                }
            })
        ]);
        const likeCount = await prisma.like.count({
            where: {
                postId
            }
        });

        return res.status(200).json({
            liked: false,
            likeCount
        })
    }else {
        // If the user has not liked the post, then create a new record.
        try {
            await prisma.$transaction([
                prisma.like.create({
                    data: {
                        userId,
                        postId
                    }
                })
            ]);
        } catch (error) {
            // Avoiding race condition
            if(error instanceof Prisma.PrismaClientUnknownRequestError && error.code === 'P2002'){
                const likeCount = await prisma.like.count({
                    where: {
                        postId
                    }
                });
                return res.status(200).json({
                    liked: true,
                    likeCount
                })
            }
            throw error;
        }
        const likeCount = await prisma.like.count({
                    where: {
                        postId
                    }
                });
        return res.status(200).json({
            liked: true,
            likeCount
        })
    }
}

async function getLikesByPostId(postId, userId = null){
    
    const [likes, likedByUser] = await Promise.all([
        prisma.like.count({
            where: {
                postId
            }
        }),
        userId ? prisma.like.findUnique({
            where: {
                userId_postId: {userId, postId}
            },
            select : {
                id: true
            }
        }) : Promise.resolve(null)
    ])
    
    return {
        likeCount: likes,
        likedByUser: Boolean(likedByUser)
    }
}
export {
    toggleLike,
    getLikesByPostId
}