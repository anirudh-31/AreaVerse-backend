import { createPost } from "../services/post.service.js"

async function createNewPost(req, res){
    try{
        const result = await createPost(req.body);
        res.status(200).json({});
    }catch( error ){
        console.log(error)
    }
}

export {
    createNewPost
}