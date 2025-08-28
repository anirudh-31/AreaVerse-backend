import bcrypt from "bcryptjs";
import {prisma} from '../prisma/client.prisma.js';
import { generateAccessToken } from "../utils/jwt.js";


/**
 * Function to register a new user on the platform.
 * @param {JSON} data 
 * @returns A payload containing the signed auth token and the user infomation
 */
async function registerNewUser(data) {
    const { username, first_name, last_name, email, password, profession, city, state, area, neighborhoodId } = data;

    // Check if a record with the same username or email exists
    const userExists = await prisma.user.findFirst({
        where: {
            OR: [{ username }, { email }]
        }
    });
    // If a record already exists, then throw an error stating the same.
    if (userExists) {
        throw new Error("User already exists");
    }
    // If the user does not exist, then register the user.

    // Retrive the neighborhood id for the city + state + area that the user provided.
    let resolvedNeighborhoodId = neighborhoodId;
    if (!resolvedNeighborhoodId && area && city && state) {
        // retrieve the details if it exists and use the neighborhood.
        let neighborhood = await prisma.neighborhood.findFirst({
            where: { name: area, city, state }
        });

        // if it does not exists already, then create a record for it and use the neighborhood id.
        if (!neighborhood) {
            neighborhood = await prisma.neighborhood.create({
                data: {
                    name: area,
                    city,
                    state,
                    sentimentScore: 0
                }
            });
        }
        resolvedNeighborhoodId = neighborhood.id;
    }

    // If the required neighborhood details are not provided, then throw and error stating the same
    if (!resolvedNeighborhoodId) {
        throw new Error("Neighborhood information is required (name + city + state).");
    }

    // Hash the password for storage
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new user record
    const user = await prisma.user.create({
        data: {
            username,
            first_name,
            last_name,
            email,
            profession,
            neighborhoodId: resolvedNeighborhoodId,
            role: "USER",
            authProvider: "LOCAL",
            passwordHash: hashedPassword
        },
        select: { id: true, username: true, email: true, role: true }
    });

    // generate a new auth token for the user.
    const token = generateAccessToken({ id: user.id, username: user.username });

    return { token, user };
}

/**
 * Function to allow the user to login to the platform
 * @param {Strin} userEmailOrUserName 
 * @param {String} password 
 * @returns A Payload containing the signed auth token and the necessary user information.
 */
async function loginUser(userEmailOrUserName, password){
    // Retrive the first record that matches the given username or email.
    const user = await prisma.user.findFirst({
        where: {
                    OR: [
                            {
                                username: userEmailOrUserName
                            }, 
                            {
                                email: userEmailOrUserName
                            }
                        ]
                }
    })

    // If no record is found respond with an error stating that invalid credentials were passed.
    if (!user){
        throw new Error("Invalid credentials");
    }
    
    // If the user had not signed with a password, i.e, used a social login such as google or facebook, tell the user to login with the same provider.
    if(user.authProvider !== 'LOCAL'){
        throw new Error(`Use ${user.authProvider} login instead.`)
    }

    //If the user record is found, compare the passwords.
    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

    // If the passwords dont match, throw an error stating that invalid credentials were passed.
    if(!passwordsMatch){
        throw new Error("Invalid credentials");
    }

    // If the passwords match, create a new auth token for the user.
    const authToken = generateAccessToken({
        id: user.id,
        username: user.username,
        email: user.email,
        role:  user.role
    })

    return { authToken, 
             user: { 
                        id: user.id, 
                        username: user.username, 
                        email: user.email,
                        role: user.role 
                    } 
            };

}

export {
    registerNewUser,
    loginUser
}