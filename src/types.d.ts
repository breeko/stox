
interface StockNode {
    quarter: string
    time: number
    date: Date | null
    close: number
  }
  
  interface StockChartProps {
    history: StockHistory[],
    predict: StockHistory[][],
    quarterMapping: Map<Date, string>
  }


interface StockMetricsTableProps {
    metrics: StockMetric[]
    metricKeys: {
        colName: string
        accessor: (m: StockMetric) => number | Date | string
    }[]
    quarterMapping: Map<Date, string>
}

export interface News {
    title: string,
    blurb: string,
    time: Date
}

export interface Article {
    source: {
            id?: string,
            name: string,
        }
        author: string
        title: string
        description: string
        url: string
        urlToImage: string
        publishedAt: string
        content: string
}