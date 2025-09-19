import { generateUploadURL } from "../services/image.service.js"


async function getSignedImageUploadURL(req, res) {
    try {
        const { fileName, fileType } = req.body;
        const { id }       = req.user;
        const result = await generateUploadURL(fileName, fileType, id);
        res.status(200).send(result)
    }catch( err ){
        res.status(400).send({
            error: err.message
        })
    }

}

export {
    getSignedImageUploadURL
}