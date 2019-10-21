import {convertDate} from './utils'
import {Secret} from './secret'

export const URLS = {
    profile: (stock: string) => `https://financialmodelingprep.com/api/v3/company/profile/${stock}`,
    history: (stock: string, from: Date, to: Date) => `https://financialmodelingprep.com/api/v3/historical-price-full/${stock}?from=${convertDate(from)}&to=${convertDate(to)}`,
    metrics: (stock: string) => `https://financialmodelingprep.com/api/v3/company-key-metrics/${stock}?period=quarter`,
    newsRaw: (stock: string, before: Date) => `https://news.google.com/search?q=${stock}+before:${convertDate(before)}&hl=en-US&gl=US&ceid=US:en`,
    news: (stock: string, before: Date) => `https://newsapi.org/v2/everything?q=${stock}&from=${before}&apiKey=${Secret.NEWS_API_KEY}`
}

