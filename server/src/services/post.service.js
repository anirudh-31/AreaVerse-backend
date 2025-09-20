import { prisma } from '../prisma/client.prisma.js';

/**
 * Function to create a new post.
 */
async function createPost(req) {
    console.log(req)
    const { postType, images, severity, category, description } = req.body;
    const { user }                                              = req;

    const post =  await prisma.post.create(
                                            {
                                                data: {
                                                    type       : postType.toUpperCase(),
                                                    severity   : severity?.toUpperCase(),            
                                                    description: description,
                                                    category   : category,
                                                    user_id    : user.id,
                                                    images     : {
                                                        create : images?.map(image => ({
                                                            url: image
                                                        }))
                                                    },
                                                    histories  : {
                                                        create : {
                                                            status   : 'REPORTED',
                                                            changedBy: user.id,
                                                            message  : 'Report created.'
                                                        }
                                                    }
                                                    
                                                },
                                                select: {
                                                    id: true
                                                }
                                            },
    )
    return {
        message: "Report created successfully"
    }
}

export {
    createPost
}