import { getHomeFeed } from "../services/feed.service.js";


async function homeFeed(req, res){
    try {
        const userId = req?.user?.id;
        const page   = Number(req.query.page ) || 1;
        const limit  = Number(req.query.limit) || 10;

        const feed   =  await getHomeFeed(userId, page, limit, res);

        
    } catch (error) {
        console.error("Error fetching home feed:", error);
        res.status(500).json({ success: false, message: "Failed to fetch home feed" });
    }
}

export {
    homeFeed
}