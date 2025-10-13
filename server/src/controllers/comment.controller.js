import { createComment, getComments } from "../services/comment.service.js";

async function createNewComment(req, res){
    await createComment(req, res);
}

async function getCommentsByPostId(req, res){
    await getComments(req, res);
}
export {
    createNewComment,
    getCommentsByPostId
}