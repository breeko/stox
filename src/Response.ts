
export interface StockData extends StockProfileResponse, StockHistoricalResponse {}

export interface StockHistoricalResponse {
  symbol: string
  historical: Array<{
    quarter: string
    date: string,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number,
    unadjustedVolume: number,
    change: number,
    changePercent: number
    vwap: number
    label: string,
    changeOverTime: number,
  }>
}

export interface StockHistory {
  quarter: string
  date: Date | null,
  open: number,
  high: number,
  low: number,
  close: number,
  volume: number,
  unadjustedVolume: number,
  change: number,
  changePercent: number
  vwap: number
  label: string,
  changeOverTime: number
}

export interface StockProfileResponse {
  symbol: string,
  profile: StockProfile
}

export interface StockProfile {
  price: number,
  beta: number,
  volAvg: number,
  mktCap: number,
  lastDiv: number,
  range: string,
  changes: number,
  changesPercentage: string,
  companyName: string,
  exchange: string,
  industry: string,
  website: string,
  description: string,
  ceo: string,
  sector: string,
  image: string
}

export interface StockMetric {
  "date": Date,
  "Revenue per Share": number,
  "Net Income per Share": number,
  "Operating Cash Flow per Share": number,
  "Free Cash Flow per Share": number,
  "Cash per Share": number,
  "Book Value per Share": number,
  "Tangible Book Value per Share": number,
  "Shareholders Equity per Share": number,
  "Interest Debt per Share": number,
  "Market Cap": number,
  "Enterprise Value": number,
  "PE ratio": number,
  "Price to Sales Ratio": number,
  "POCF ratio": number,
  "PFCF ratio": number,
  "PB ratio": number,
  "PTB ratio": number,
  "EV to Sales": number,
  "Enterprise Value over EBITDA": number,
  "EV to Operating cash flow": number,
  "EV to Free cash flow": number,
  "Earnings Yield": number,
  "Free Cash Flow Yield": number,
  "Debt to Equity": number,
  "Debt to Assets": number,
  "Net Debt to EBITDA": number,
  "Current ratio": number,
  "Interest Coverage": number,
  "Income Quality": number,
  "Dividend Yield": number,
  "Payout Ratio": number,
  "SG&A to Revenue": number,
  "R&D to Revenue": number,
  "Intangibles to Total Assets": number,
  "Capex to Operating Cash Flow": number,
  "Capex to Revenue": number,
  "Capex to Depreciation": number
  "Stock-based compensation to Revenue": number,
  "Graham Number": number,
  "Graham Net-Net": number,
  "Working Capital": number,
  "Tangible Asset Value": number,
  "Net Current Asset Value": number,
  "Invested Capital": number,
  "Average Receivables": number,
  "Average Payables": number,
  "Average Inventory": number,
  "Capex per Share": number
}

export interface StockMetricsResponse {
  symbol: string,
  metrics: Array<{
    "date": string,
    "Revenue per Share": string,
    "Net Income per Share": string,
    "Operating Cash Flow per Share": string,
    "Free Cash Flow per Share": string,
    "Cash per Share": string,
    "Book Value per Share": string,
    "Tangible Book Value per Share": string,
    "Shareholders Equity per Share": string,
    "Interest Debt per Share": string,
    "Market Cap": string,
    "Enterprise Value": string,
    "PE ratio": string,
    "Price to Sales Ratio": string,
    "POCF ratio": string,
    "PFCF ratio": string,
    "PB ratio": string,
    "PTB ratio": string,
    "EV to Sales": string,
    "Enterprise Value over EBITDA": string,
    "EV to Operating cash flow": string,
    "EV to Free cash flow": string,
    "Earnings Yield": string,
    "Free Cash Flow Yield": string,
    "Debt to Equity": string,
    "Debt to Assets": string,
    "Net Debt to EBITDA": string,
    "Current ratio": string,
    "Interest Coverage": string,
    "Income Quality": string,
    "Dividend Yield": string,
    "Payout Ratio": string,
    "SG&A to Revenue": string,
    "R&D to Revenue": string,
    "Intangibles to Total Assets": string,
    "Capex to Operating Cash Flow": string,
    "Capex to Revenue": string,
    "Capex to Depreciation": string,
    "Stock-based compensation to Revenue": string,
    "Graham Number": string,
    "Graham Net-Net": string,
    "Working Capital": string,
    "Tangible Asset Value": string,
    "Net Current Asset Value": string,
    "Invested Capital": string,
    "Average Receivables": string,
    "Average Payables": string,
    "Average Inventory": string,
    "Capex per Share": number,
  }>
}

export interface StockList {
  symbolsList: Array<{
    symbol: string
    name: string
    price: number
    exchange: string
  }>
}
