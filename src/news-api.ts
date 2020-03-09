
import axios from "axios"
import { Article } from "./types"
import { URLS } from "./Urls"

export const getNews = async (stock: string, before: Date): Promise<Article[]> => {
    const url = URLS.news(stock.replace(/ /g, "%20"), before)

    try {
        const response = await axios({
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            },
            method: "GET",
            url,
        }).then(res => res.data.articles as Article[]);
        return response
    } catch (error) {
        const empty: Article[] = []
        return empty
    }
}
