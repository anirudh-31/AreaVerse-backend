import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_TOKEN);

/**
 * Function to create a signed URL for image uploads.
 * @param {String} fileName 
 * @param {String} userId 
 * @returns 
 */
async function generateUploadURL(fileName, fileType, userId){
    const filePath = `${userId}/${Date.now()}_${fileName}`;
    
    const { data, error }    = await client.storage.from('post-images').createSignedUploadUrl(filePath, 60 * 10, { contentType: fileType }) // Signed URLs will have a 10 minute validity
    
    const { signedUrl, path } = data;
    

    if (error) {
        throw new Error(error.message)
    }
    return {
        path,
        signedUrl
    }
}

export {
    generateUploadURL
}
