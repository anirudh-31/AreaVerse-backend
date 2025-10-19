import { prisma } from '../prisma/client.prisma.js';

async function trackPostView( { postId, userId, ipAddress }) {
    const metric = await prisma.$transaction( async (tx) => {
        let userIdentifier = userId || ipAddress;

        // check if the user or IP has already viewed the post
        const existingView = await tx.engagement.findFirst({
            where: {
                postId,
                type: 'VIEW',
                ...(userId ? {userId} : { userId: null, post: { id: postId}}),
            },
        });

        // If user has not seen the post, then record a unique view
        if(!existingView){
            await tx.engagement.create({
                data: {
                    postId,
                    userId,
                    type: 'VIEW'
                },
            });

            // Increment both total and unique view counts.
            await tx.post.update({
                where: {
                    id: postId
                },
                data: {
                    viewCount: {
                        increment: 1
                    },
                    uniqueViews: {
                        increment: 1
                    },
                },
            });
        }else {
            // Increment only total views
            await tx.post.update({
                where: {
                    id: postId
                },
                data:{
                    viewCount: {
                        increment: 1
                    },
                },
            });
        }

        return {
            success: true
        }
    });
}

export {
    trackPostView
}