import { prisma } from "../prisma/client.prisma.js";

/**
 * Function to create a new comment on a post.
 * When parentId is present in the request body, the comment is considered as a reply to an existing comment with the id == parentId,
 * and when absent or null, the comment is considered as a new comment on the post. 
 * @param {Request} req 
 * @param {Response} res 
 */
async function createComment(req, res){
    const { postId, content, parentId = null} = req.body;
    const { id }                              = req.user;

    const newComment = await prisma.$transaction( async (transaction) => {
        const newComment = await transaction.comment.create({
            data: {
                userId: id,
                postId,
                content,
                parentId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true 
                    }
                }
            }
        })

        // If the comment is a reply to an existing comment, then update the reply count on the comment.
        // Else update the comment count on the post
        let count = null;
        if (parentId){
            const data = await transaction.comment.update({
                where: {
                    id: parentId
                },
                data: {
                    replyCount: {
                        increment: 1
                    }
                },
                select: {
                    replyCount: true
                }
            })
            count = data.replyCount;
        }else{
            const data = await transaction.post.update({
                where: {
                    id: postId
                },
                data : {
                    commentCount: {
                        increment: 1
                    }
                },
                select: {
                    commentCount: true
                }
            });
            count = data.commentCount;
        }  
        const status = {
            'status'        : 200,
            'message'       : "Comment posted successfully",
            'totalComments' : count,
            newComment
        }
        return status;
    })

    return res.status(200).json(newComment)
}

async function getComments(req, res){
    const { postId, page = 1, limit = 1 } = req.query;
    const pageNumber   = Number(page);
    const limitResults = Number(limit);

    const skip = ( page - 1) * limitResults;

    const comments = await prisma.comment.findMany({
        where: {
            postId,
            parentId: null
        },
        include: {
            user: {
                select: {
                    id      : true,
                    username: true
                }
            },
            replies: {
                include: {
                    user: {
                        select: {
                            id      : true,
                            username: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'asc'
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        },
        skip,
        take: limitResults
    });

    const totalComments = await prisma.comment.count({
        where: {
            postId,
            parentId: null
        }
    });


    res.status(200).json({
        comments,
        pagination: {
            totalComments,
            page      : pageNumber,
            limit     : limitResults,
            totalPages: Math.ceil( totalComments / limitResults)
        }
    });

    
}
export {
    createComment,
    getComments
}