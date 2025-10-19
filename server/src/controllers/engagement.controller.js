import { trackPostView } from "../services/engagement.service.js";

async function recordPostView( req, res) {
    try {
        const { postId } = req.params;
        const userId     = req.user?.id || null;
        const ipAddress  = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        await trackPostView({ postId, userId, ipAddress });

        res.status(200).json( {
            success: true,
            message: "View recorded"
        })
    } catch (error) {
        console.error("❌ Error recording view:", error);
        res.status(500).json({ success: false, message: "Failed to record view" });
    }
}

export {
    recordPostView
}