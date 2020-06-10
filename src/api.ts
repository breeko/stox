import rp from "request-promise"
import { StockHistoricalResponse,
  StockHistory,
  StockList,
  StockMetric,
  StockMetricsResponse,
  StockProfile,
  StockProfileResponse,
} from "./Response"
import { convertDate, convertNumeric, parseDate } from "./utils"

const Urls = {
    history: (stock: string, from: Date, to: Date) =>
      `https://financialmodelingprep.com/api/v3/historical-price-full/${stock}?from=${convertDate(from)}&to=${convertDate(to)}&apikey=${process.env.REACT_APP_API_KEY}`,
    list: () =>
    `https://financialmodelingprep.com/api/v3/company/stock/list?apikey=${process.env.REACT_APP_API_KEY}`,
    metrics: (stock: string) =>
      `https://financialmodelingprep.com/api/v3/company-key-metrics/${stock}?period=quarter&apikey=${process.env.REACT_APP_API_KEY}`,
    // news: (stock: string, before: Date) =>
    // `https://newsapi.org/v2/everything?q=${stock}&from=${before}&apiKey=${Secret.REACT_APP_NEWS_API_KEY}`,
    newsRaw: (stock: string, before: Date) =>
    `https://news.google.com/search?q=${stock}+before:${convertDate(before)}&hl=en-US&gl=US&ceid=US:en`,
    profile: (stock: string) =>
    `https://financialmodelingprep.com/api/v3/company/profile/${stock}?apikey=${process.env.REACT_APP_API_KEY}`,
}

export const Api = {
    getHistory: async (stock: string, from: Date, to: Date): Promise<StockHistory[]> => {
        const url = Urls.history(stock, from, to)
        return rp(url)
            .then((raw: string) => {
                const data = JSON.parse(raw) as StockHistoricalResponse
                const historical = data.historical.map(n => ({...n, date: parseDate(n.date)}))
                return historical
            })
    },

  getProfile: async (stock: string): Promise<StockProfile> => {
    const url = Urls.profile(stock)
    return rp(url).then((raw: string) => {
        const parsed = (JSON.parse(raw) as StockProfileResponse)
        return parsed.profile
    })
  },

  getMetrics: async (stock: string): Promise<StockMetric[]> => {
    const url = Urls.metrics(stock)
    return rp(url)
      .then((raw: string) => {
        const data = JSON.parse(raw) as StockMetricsResponse
        // TODO: what if no metrics??
        if (data === undefined || data.metrics === undefined) {
          return []
        }
        const metrics = data.metrics
            .map(m => convertNumeric(m))
            // @ts-ignore
            .map(m => ({...m, date: new Date(Date.parse(m.date))})) as StockMetric[]
        return metrics.reverse()
      })
  },
  listStocks: async (): Promise<StockList> => {
    const url = Urls.list()
    return rp(url).then((raw: string) => JSON.parse(raw) as StockList)
  },
}
