import rp from 'request-promise'
import fs from 'fs'
import { StockHistoricalResponse } from './Response'


const rundownload = (stocks: string[]) => {
    stocks.forEach((stock, idx) => {
        setTimeout(() => {
            const url = `https://financialmodelingprep.com/api/v3/historical-price-full/${stock}?serietype=line`
            rp(url).then( (body) => {
                const jsonBody: StockHistoricalResponse = JSON.parse(body)
                fs.writeFile(`./stocks/${jsonBody.symbol}.json`, JSON.stringify(jsonBody), (err: NodeJS.ErrnoException | null) => console.log(err))    
            })
        }, 10000 * idx * Math.random())
    })
}
