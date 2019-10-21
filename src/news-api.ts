
import axios from 'axios'
import { URLS } from './Urls'

export interface Article {
    source: {
            id?: string
            name: string
        }
        author: string
        title: string
        description: string
        url: string
        urlToImage: string
        publishedAt: string
        content: string
}


export const getNews = async (stock: string, before: Date): Promise<Article[]> => {
    const url = URLS.news(stock.replace(/ /g, '%20'), before)

    try {
        const response = await axios({
            "method": "GET",
            "url": url,
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
            }
        }).then(res => res.data.articles as Article[]);
        return response
    }
    catch (error) {
        console.log(error);
        const empty: Article[] = []
        return empty
    }
}
