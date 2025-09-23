import { createPost, getPost, getReviewQueuePosts, updateStatus } from "../services/post.service.js"

async function createNewPost(req, res){
    try{
        const result = await createPost(req);
        res.status(200).json(result);
    }catch( error ){
        res.status(500).json({
            message: error.message
        })
    }
}

async function getReport(req, res){
    try{
        const result = await getPost(req.params.id, req.user);
        res.status(200).json(result);
    }catch( error ){
        res.status(403).send({
            message: error.message
        })
    }
}

async function fetchReviewQueue(req, res){
    try {
        const page     = Number.parseInt(req.query.page, 10)     || 1;
        const pageSize = Number.parseInt(req.query.pageSize, 10) || 10;
        const result = await getReviewQueuePosts(page, pageSize);
        res.status(200).json(result);
    }catch( error ){
        res.status(500).json({
            message: error.message
        })
    }
}

async function updatePostStatus(req, res){
    try {
        const response = await updateStatus(req);
        res.status(200).send(response);
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

export {
    createNewPost,
    getReport,
    fetchReviewQueue,
    updatePostStatus
}