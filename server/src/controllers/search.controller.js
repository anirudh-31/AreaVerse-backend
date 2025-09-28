import { getSearchResults } from "../services/search.service.js";


async function search(req, res){
    await getSearchResults(req, res)
}

export {
    search
}