import axios from 'axios'
import { URLS } from './Urls'
import { parse } from 'node-html-parser';
import { HTMLElement } from 'node-html-parser';
import { isNull } from 'util';

export interface News {
    title: string,
    blurb: string,
    time: Date
}

export const getNews = async (stock: string, before: Date) => {
    const url = URLS.news(stock.replace(/ /g, '%20'), before)
    console.log(url)
    try {
        const response = await axios({
            "method": "GET",
            "url": url,
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
            }
        });
        return parseNews((response.data as string));
    }
    catch (error) {
        console.log(error);
        const empty: News[] = [];
        return empty;
    }
}

const parseNews = (html: string): News[] => {
    console.log(html)
    const out: News[] = []
    const root = parse(html)
    
    if (root instanceof HTMLElement) {
        const articles = root.querySelectorAll('article')
        articles.forEach(article => {
            if (validArticle(article)) {
                const title = article.querySelector('h3').text
                const blurb = article.querySelector('div').text
                const timeString = article.querySelector('time').attributes['datetime']
                const time = new Date(Date.parse(timeString))
                out.push({title, blurb, time})
            }
        })
    }
    return out
}

const validArticle = (article: HTMLElement): boolean => {
    return !(isNull(article) || 
        isNull(article.querySelector('h3')) || 
        isNull(article.querySelector('div')) || 
        isNull(article.querySelector('time')) ||
        isNull(article.querySelector('time').attributes['datetime'])
        )
}
