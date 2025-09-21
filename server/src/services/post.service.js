import { prisma } from '../prisma/client.prisma.js';
import { generateDownloadURL } from './image.service.js';

/**
 * Function to create a new post.
 * @param {Request} req 
 * @returns Status message
 */
async function createPost(req) {
    const { postType, images, severity, category, description, title } = req.body;
    const { user }                                              = req;

    const post =  await prisma.post.create(
                                            {
                                                data: {
                                                    type       : postType.toUpperCase(),
                                                    severity   : severity?.toUpperCase(),            
                                                    description: description,
                                                    category   : category,
                                                    title      : title,
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
        message: "Report created successfully",
        id     : post.id
    }
}

/**
 * Function to retrieve a post.
 * @param {String} postId 
 * @param {JSON} user 
 */
async function getPost(postId, user){
    const post = await prisma.post.findUnique({
        where: {
            id: postId
        },
        include: {
            images: true, 
            user  : true,
        }
    });

    if (!post) throw new Error("Post not found.");

    if ( post.status !== 'APPROVED' && post.user_id !== user.id && user.role !== 'ADMIN') {
        throw new Error("You are not authorized to view this post as of now.");
    }

    const signedImageURLs = await Promise.all(
        post.images.map( async (image) => ({
            url: await generateDownloadURL(image.url)
        }))
    );

    return {
        ...post,
        images: signedImageURLs
    };
}

/**
 * Function to get the reports pending review.
 * @param {*} page 
 * @param {*} pageSize 
 * @returns 
 */
async function getReviewQueuePosts(page = 1, pageSize = 10) {
    const [ posts, total ] = await Promise.all([
        prisma.post.findMany({
            where: {
                status: {
                    in: ['REPORTED', 'UNDER_REVIEW'],
                },
            },
            select: {
                title: true,
                id:true,
                createdAt: true,
                user  : {
                    select : {
                        id        : true,
                        first_name: true,
                        last_name : true,
                        email     : true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip : (page - 1) * pageSize,
            take: pageSize
        }),
        prisma.post.count({
            where: {
                status : {
                    in : ['REPORTED', 'UNDER_REVIEW']
                }
            }
        }),
    ]);

    return {
        posts,
        pagination: {       
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
        },
    }
};
export {
    createPost,
    getPost,
    getReviewQueuePosts
}