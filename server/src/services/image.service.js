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

/**
 * Function to generate a signed download URL for the image.
 * @param {String} filePath 
 */
async function generateDownloadURL(filePath){
    const { data, error } = await client.storage.from('post-images').createSignedUrl(filePath, 60 * 60);
    if ( error ) throw error;
    return data.signedUrl;
}


/**
 * Function to delete given images from storage
 * @param {Array} images 
 * @returns 
 */
async function removePostImages(images){
    const { error: deleteError } = await client.storage.from('post-images').remove(images)
    if(deleteError) {
        throw new Error(deleteError)
    }
    return true
}

export {
    generateUploadURL,
    generateDownloadURL,
    removePostImages
}
