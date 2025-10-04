import { prisma } from '../prisma/client.prisma.js';


async function getSearchResults(req, res){
    try {
        
        const { query, type, page = 1, limit = 10} = req.query;
        
        if(!query){
            return res.status(400).json({
                error: "query parameter `query` is required."
            });
        }

        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        let results = {};

        if (type.toLowerCase() === "all") {
            const [users, posts, neighborhoods] = await Promise.all([
                // finding users
                prisma.user.findMany({
                    where: {
                        OR : [
                                {
                                    first_name: {
                                        contains: query, mode: "insensitive"
                                    },
                                    last_name :{
                                        contains: query, mode: 'insensitive'
                                    },
                                    username: {
                                        contains: query, mode: 'insensitive'
                                    }
                                }
                              ]   
                            },
                    orderBy: [{first_name: 'asc'}, {last_name:'asc'}, {username: 'asc'}],
                    select: { id: true, last_name: true, first_name: true, username: true},
                    skip,
                    take
                }),
                // finding posts
                prisma.post.findMany({
                    where: {
                        OR : [
                            {
                                description: {
                                    contains: query, mode: 'insensitive'
                                }
                            },
                            {
                                title: {
                                    contains: query, mode: 'insensitive',
                                }
                            },
                            {
                                category : {
                                    contains: query, mode: 'insensitive'
                                }
                            }
                        ],
                        status: 'APPROVED'
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    select: {id: true, title: true, category: true, type: true, user: {select: {username: true}}},
                    skip,
                    take
                }),
                // finding neighborhoods.
                prisma.neighborhood.findMany({
                    where: {
                        OR: [
                            {
                                name: {
                                    contains: query, mode: 'insensitive'
                                }
                            }
                        ]
                    },
                    select: { name: true, state: true, city: true, id: true },
                    skip, take   
                })
            ])
            
            const formattedResults = [
                                        ...users.map(u => ({ source: "user", ...u })),
                                        ...posts.map(p => ({ source: "post", ...p })),
                                        ...neighborhoods.map(n => ({ source: "neighborhood", ...n }))
                                    ];
            results = formattedResults
        }else if( type.toLowerCase() === 'users' ){
            const users = await prisma.user.findMany({
                    where: {
                        OR : [
                                {
                                    first_name: {
                                        contains: query, mode: "insensitive"
                                    },
                                    last_name :{
                                        contains: query, mode: 'insensitive'
                                    },
                                    username: {
                                        contains: query, mode: 'insensitive'
                                    }
                                }
                              ]   
                            },
                    orderBy: [{first_name: 'asc'}, {last_name:'asc'}, {username: 'asc'}],
                    select: { id: true, last_name: true, first_name: true, username: true},
                    skip,
                    take
                })
            results = [
                ...users.map((user) => ({source: 'user', ...user}))
            ]
        }else if( type.toLowerCase() === 'posts'){
            const posts = await prisma.post.findMany({
                    where: {
                        OR : [
                            {
                                description: {
                                    contains: query, mode: 'insensitive'
                                }
                            },
                            {
                                title: {
                                    contains: query, mode: 'insensitive',
                                }
                            },
                            {
                                category : {
                                    contains: query, mode: 'insensitive'
                                }
                            }
                        ],
                        status: 'APPROVED'
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    select: {id: true, title: true, category: true, type: true, user: {select: {username: true}}},
                    skip,
                    take
                })
            results = [
                ...posts.map((post) => ({
                    source: 'post',
                    ...post
                }))
            ]
        }else if( type.toLowerCase() === 'neighborhoods'){
            const neighborhoods = await prisma.neighborhood.findMany({
                where: {
                    OR: [
                        {
                            name: {
                                contains: query, mode: 'insensitive'
                            }
                        }
                    ]
                },
                select: { name: true, state: true, city: true, id: true },
                skip, take   
            })
            results = [
                ...neighborhoods.map((neighborhood) => ({
                    source: 'neighborhood   ',
                    ...neighborhood
                }))
            ]
        }else {
            return res.status(400).json({ error: "Invalid type. Use user | post | neighborhood" });
        }
        res.json({ results, page: Number(page), limit: Number(limit) });
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

export {
    getSearchResults
}