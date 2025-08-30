import { prisma } from "../prisma/client.prisma.js";

/**
 * Function to get the users profile information
 * @param {Request} req 
 * @param {Response} res 
 */
async function getMe(userId){
    const userDetails = await prisma.user.findUnique({
        where  : {id: userId},
        select : {
            email        : true,
            first_name   : true,
            last_name    : true,
            username     : true,
            profession   : true,
            createdAt    : true,
            dateOfBirth  : true,
            neighborhood : {
                                select : {
                                    name   : true,
                                    state  : true,
                                    city   : true,
                                    country: true
                                }  
                            }
        },
        // include: {
        //     neighborhood : {
        //         select :{
        //             name   : true,
        //             state  : true,
        //             city   : true,
        //             country: true
        //         }  
        //     }
        // } 
    })
    if (!userDetails){
        throw new Error("User not found");
    }

    return userDetails;
}

export {
    getMe
}