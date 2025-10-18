import { createComment, getComments, getRepliesOnComment } from "../services/comment.service.js";

async function createNewComment(req, res){
    await createComment(req, res);
}

async function getCommentsByPostId(req, res){
    await getComments(req, res);
}

async function getReplies(req, res){
    await getRepliesOnComment(req, res);
}
export {
    createNewComment,
    getCommentsByPostId,
    getReplies
}