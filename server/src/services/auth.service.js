import bcrypt from "bcryptjs";
import {prisma} from '../prisma/client.prisma.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";


/**
 * Function to register a new user on the platform.
 * @param {JSON} data 
 * @returns A payload containing the signed auth token and the user infomation
 */
async function registerNewUser(data) {
    const { username, first_name, last_name, email, password, profession, city, state, area, neighborhoodId, dateOfBirth } = data;

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
                    country: "India",
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
            dateOfBirth,
            profession,
            neighborhoodId: resolvedNeighborhoodId,
            role: "USER",
            authProvider: "LOCAL",
            passwordHash: hashedPassword
        },
        select: { id: true, username: true, email: true, role: true }
    });

    // generate a new auth token for the user.
    const token = generateAccessToken({ id: user.id, username: user.username, role: user.role });
    // generate a new refresh token for the user.
    const refreshToken = generateRefreshToken({ id: user.id });
    // store the generate token in the refreshToken database.
    await prisma.refreshtoken.create({
        data: {
            token    : refreshToken,
            userId   : user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }
    })


    return { token, user, refreshToken };
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
                },
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

    // delete any existing refresh tokens ----- doesn't allow multiple sessions.
    await prisma.refreshtoken.deleteMany({ where: { userId: user.id } });

    // If the passwords match, create a new auth token for the user.
    const token = generateAccessToken({
        id: user.id,
        username: user.username,
        email: user.email,
        role:  user.role
    })
    // Create a refresh token for the user.
    const refreshToken = generateRefreshToken({ id: user.id });
    // store the generate token in the refreshToken database.
    await prisma.refreshtoken.create({
        data: {
            token    : refreshToken,
            userId   : user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }
    })


    return { token,
             refreshToken,
             user: { 
                        id: user.id, 
                        username: user.username, 
                        email: user.email,
                        role: user.role 
                    } 
            };
}

/**
 * Function to log the user out of the system.
 * @param {Request} req 
 * @returns 
 */
async function logoutUser(req){
    const refreshToken = req.cookies.refreshToken;
    if(refreshToken){
        await prisma.refreshtoken.deleteMany({
            where: {token: refreshToken}
        })
    }
    return true;
}

/**
 * Function to generate a new auth token for the user.
 * @param {Request}  req 
 * @param {Response} res 
 * @returns {Response} containing the new auth token
 */
async function refreshAuthToken(req){
    const refreshToken = req.cookies.refreshToken;
    // If no refresh token is found in request, revert with a 401 unauthorized error
    if(!refreshToken){
        throw new Error("No refresh token found");
    }
    const isRefreshTokenValid = verifyRefreshToken(refreshToken);
    if(isRefreshTokenValid) {
        // If refresh token is found in the request, check if it exits in the database.
        const storedToken = await prisma.refreshtoken.findUnique({
            where: {token: refreshToken}
        }) 
        // If no stored token is found, revert with a 401 unauthorized error.
        if(!storedToken){
            throw new Error("No refresh token found");
        }
        // Validate the refresh token.
        if(storedToken.revoked || storedToken.expiresAt < new Date()){
            // If the refresh token is invalid, revert with a 403 Forbidden status.
        throw new Error("Invalid refresh token");
        }
        
        // retrieve the user details pertaining to the token
        const user = await prisma.user.findFirst({
            where : {id: storedToken.userId},
            select: { id: true, username: true, email: true, role: true }
        })

        
        // generate a new access token for the user
        const token = generateAccessToken({
            id      : user.id,
            username: user.username,
            email   : user.email,
            role    :  user.role
        })
        return {
                    token
               }
    } else {
        throw new Error("Invlaid or expired refresh token")
    }
}

export {
    registerNewUser,
    loginUser,
    logoutUser,
    refreshAuthToken
}