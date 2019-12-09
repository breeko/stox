import {Secret} from "./secret"
import {convertDate} from "./utils"

export const URLS = {
    history: (stock: string, from: Date, to: Date) => `https://financialmodelingprep.com/api/v3/historical-price-full/${stock}?from=${convertDate(from)}&to=${convertDate(to)}`,
    metrics: (stock: string) => `https://financialmodelingprep.com/api/v3/company-key-metrics/${stock}?period=quarter`,
    news: (stock: string, before: Date) => `https://newsapi.org/v2/everything?q=${stock}&from=${before}&apiKey=${Secret.NEWS_API_KEY}`,
    newsRaw: (stock: string, before: Date) => `https://news.google.com/search?q=${stock}+before:${convertDate(before)}&hl=en-US&gl=US&ceid=US:en`,
    profile: (stock: string) => `https://financialmodelingprep.com/api/v3/company/profile/${stock}`,
}
