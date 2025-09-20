import { createPost } from "../services/post.service.js"

async function createNewPost(req, res){
    try{
        const result = await createPost(req);
        res.status(200).json(result);
    }catch( error ){
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

export {
    createNewPost
}