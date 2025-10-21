import { prisma } from '../prisma/client.prisma.js';
import { generateDownloadURL } from './image.service.js';

async function getHomeFeed(userId, page=1, limit=10){
    const skip = ( page - 1 ) * limit;

    const viewedPosts = await prisma.engagement.findMany({
        where: {
            userId
        },
        select: {
            postId: true
        }
    });

    const viewedPostIds = viewedPosts.map( p => p.postId);

    const posts = await prisma.post.findMany({
        where: {
            status: 'APPROVED',
            id    : {
                notIn : viewedPostIds
            },
        },
        select: {
            user: {
                select: {
                    id        : true,
                    username  : true,
                    first_name: true,
                    last_name : true,
                },
            },
            images: {
                select: {
                    url: true,
                },
            },
            id         : true,
            description: true,
            type       : true,
            title      : true,
            category   : true,
            severity   : true,
            createdAt  : true,            
        },
        orderBy: {
            createdAt: 'desc'   
        },
        skip,
        take: limit * 2,
    });

    // Compute engagements scores.
    const scoredPosts = posts.map((post) => {
        const daysOld      = Math.max(0, (Date.now() - new Date(post.createdAt)) / (1000 * 60 * 60 * 24));
        const recencyBoost = Math.max( 0, 100 - daysOld * 10);
        const score        = (
            // (post.likeCount    * 3) + 
            (post.commentCount * 5) + 
            (post.viewCount    * 1) +
            recencyBoost
        );
        return {
            ...post,
            score
        }
    });

    scoredPosts.sort((a, b) => b.score - a.score);

    const paginatedPosts = scoredPosts.slice(0, limit);
    
    for (const post of paginatedPosts){
        if(post.images && post.images.length  > 0){
            const signedUrls = await Promise.all(
                post.images.map( async (img) => {
                    const data = await generateDownloadURL(img.url);
                    return {
                        ...img,
                        url: data || null
                    };
                })
            );
            post.images = signedUrls.filter(Boolean);
        }
    }
    
    // tracking new views
    await prisma.$transaction(
        paginatedPosts.map(post =>
            prisma.engagement.upsert({
                where: {
                    userId_postId_type: {
                        userId,
                        postId: post.id,
                        type: 'VIEW',
                    },
                },
                update: {
                    userId_postId_type: {
                        userId,
                        postId: post.id,
                        type: 'VIEW',
                    },
                },
                create: {
                    userId,
                    postId: post.id,
                    type: 'VIEW',
                },
            })
        )
    );

    return paginatedPosts;
}

export {
    getHomeFeed
}