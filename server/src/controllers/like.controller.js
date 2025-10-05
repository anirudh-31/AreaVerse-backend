import { toggleLike } from "../services/like.service.js";


async function toggleLikeStatus(req, res) {
    await toggleLike(req, res)
}

export {
    toggleLikeStatus
}