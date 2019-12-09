import axios from "axios"
import { HTMLElement, parse } from "node-html-parser"
import { isNull } from "util"
import { News } from "./types"
import { URLS } from "./Urls"

export const getNews = async (stock: string, before: Date) => {
    const url = URLS.news(stock.replace(/ /g, "%20"), before)
    try {
        const response = await axios({
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            },
            method: "GET",
            url,
        })
        return parseNews((response.data as string))
    } catch (error) {
        const empty: News[] = []
        return empty
    }
}

const parseNews = (html: string): News[] => {
    const out: News[] = []
    const root = parse(html)

    if (root instanceof HTMLElement) {
        const articles = root.querySelectorAll("article")
        articles.forEach(article => {
            if (validArticle(article)) {
                const title = article.querySelector("h3").text
                const blurb = article.querySelector("div").text
                const timeString = article.querySelector("time").attributes.datetime
                const time = new Date(Date.parse(timeString))
                out.push({title, blurb, time})
            }
        })
    }
    return out
}

const validArticle = (article: HTMLElement): boolean => {
    return !(isNull(article) ||
        isNull(article.querySelector("h3")) ||
        isNull(article.querySelector("div")) ||
        isNull(article.querySelector("time")) ||
        isNull(article.querySelector("time").attributes.datetime)
        )
}
