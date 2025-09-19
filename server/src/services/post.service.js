import { prisma } from '../prisma/client.prisma.js';

/**
 * Function to create a new post.
 */
async function createPost(data) {
    const { postType, images, severity, category, description } = data;
    console.log(data)
}

export {
    createPost
}