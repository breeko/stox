import { timeParse } from "d3-time-format";
import rp from 'request-promise'
import { URLS } from "./Urls";
import { StockHistoricalResponse, StockProfileResponse, StockMetricsResponse, StockHistory, StockProfile, StockMetric } from "./Response";

export const fromEntries = (arr: [string, any][]): object => Object.assign({}, ...Array.from(arr, ([k, v]) => ({[k]: v}) ));

export const convertNumeric = (obj: { [s: string]: any }) => fromEntries(Object.entries(obj).map(([k, v]) => { return [k, isNaN(Number(v)) ? v : Number(v)]}))

export const choose = <T>(choices: T[]): T => {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

export const randomInt = (from: number, to: number): number => Math.floor(Math.random() * (to - from) + from)

export const addDays = (date: Date, numberOfDays: number): Date => {
  const newDate = new Date(date.getTime())
  newDate.setDate(date.getDate() + numberOfDays)
  return newDate
};

const parseHistory = (d: any): StockHistoricalResponse => {
  const parsed = JSON.parse(d)
  const historical = parsed.historical.map((h: {date: string}) => {return {...h, date: parseDate(h.date)}})
  return {...parsed, historical}
}

const parseMetrics = (d: any): StockMetricsResponse => {
  const parsed = JSON.parse(d)
  // TODO: what if no metrics??
  const metrics = parsed.metrics.map((m: any) => convertNumeric(m)).map((m: {date: string}) => {return {...m, date: new Date(Date.parse(m.date))}})
  const out = {...parsed, metrics} as StockMetricsResponse
  return out
}

const parseProfile = (d: any): StockProfileResponse => {
  const parsed = JSON.parse(d)
  const range = parsed && parsed.profile && parsed.profile.range ? parsed.profile.range.split('-').map(parseFloat) : [0,0]
  if (parsed.profile) parsed.profile.range = range
  return parsed as StockProfileResponse
}

export const partition = <T>(arr: Array<T>, cmp: (item: T) => Boolean): [Array<T>, Array<T>] => {
  const initialState: [T[], T[]] = [[], []];
  return arr
    .reduce((result, element) => {
      result[cmp(element) ? 0 : 1].push(element);
      return result;
    },      initialState);
}

export const getHistory = async (stock: string, from: Date, to: Date): Promise<StockHistory[]> => {
  const url = URLS.history(stock, from, to)
  const history = rp(url)
    .then(data => parseHistory(data).historical)
  return history
}

export const getProfile = async (stock: string, from: Date, to: Date): Promise<StockProfile> => {
  const url = URLS.profile(stock)
  const profile = rp(url)
    .then(data => parseProfile(data).profile)
  return profile
}

export const getMetrics = async (stock: string): Promise<StockMetric[]> => {
  const url = URLS.metrics(stock)
  const metrics = rp(url)
    .then(data => parseMetrics(data).metrics)
    .then(m => m.reverse())
  return metrics
}

export const unique = <T>(arr: T[]): T[] => {
  let seen = new Set();
  return arr.filter(item => {
      return seen.has(item) ? false : seen.add(item);
  });
}

export const absoluteMean = (vals: number[]) => {
  if (vals.length < 1) return 0
  return vals.reduce((acc, val) => acc + Math.abs(val)) / vals.length
}

export const createFake = (dates: Date[], start: number, meanAbsDev: number) => {
  // TODO: implement
  // var prior = start
  // return dates.map(d => {
  //   const x = Math.random() * Math.
  // })
}

export const getQuarter = (date: Date, quarterMapping: Map<Date, string>): string | undefined => {
  const quarterStartDate = Array.from(quarterMapping.keys()).find(d => d >= date)
  return quarterStartDate && quarterMapping.get(quarterStartDate)
}

export const convertQuarterMapping = (dates: Date[]): Map<Date, string> => {
  const x: [Date, string][] = dates.map(d =>
    {
      const month = d.getMonth() + 1
      const monthQuarter =
       (month <= 3) ? 'Q1' :
       (month <= 6) ? 'Q2' :
       (month <= 9) ? 'Q3' :
       (month <= 12) ? 'Q4' :
       'NA'
      const quarter = `${monthQuarter}-${d.getFullYear()}`
      return [d, quarter]
    })
  return new Map(x)
}

const parseDate = timeParse("%Y-%m-%d");

export const convertDate = (date: Date): string => date.toISOString().slice(0,10)
export const convertMonthYear = (date: Date): string => `${date.getFullYear()}-${date.getMonth() + 1}`