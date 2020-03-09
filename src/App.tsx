import React, { useEffect, useState } from "react"
import { Button, ButtonToolbar, Card, Container, Jumbotron } from "react-bootstrap"
import { Api } from "./api"
import "./App.css"
import "./bootstrap.min.css"
import { Colors } from "./Colors"
import { Header } from "./components/Header"
import StockChart from "./components/StockChart"
import StockMetricsTable from "./components/StockMetricsTable"
import { CONFIG } from "./Config"
import { StockHistory, StockMetric, StockProfile } from "./Response"
import { sp500 } from "./sp500"
import "./style.css"
import { addDays, choose, convertQuarterMapping, createOpposite, randomInt } from "./utils"

const App: React.FC = () => {
  const [profile, setProfile] = useState<StockProfile>()
  const [history, setHistory] = useState<StockHistory[]>()
  const [predict, setPredict] = useState<StockHistory[][]>()
  const [metrics, setMetrics] = useState<StockMetric[]>()
  const [quarterMapping, setQuarterMapping] = useState<Map<Date, string>>()
  const [symbol, setSymbol] = useState<string>()
  const [correctAnswer, setCorrectAnswer] = useState<0|1>()
  const [numCorrect, setNumCorrect] = useState<number>(0)
  const [numIncorrect, setNumIncorrect] = useState<number>(0)
  const [playable, setPlayable] = useState<boolean>(true)
  const [messageResult, setMessageResult] = useState<string>("")

  const loadAll = () => {
    const s = choose(sp500)

    Api.getMetrics(s).then(m => {
      if (m === undefined) { throw Error(`unable to get metrics for ${symbol}`) }
      if (m.length < CONFIG.quartersHistory + CONFIG.quartersPredict) {
        return loadAll()
      }

      const startIdx = randomInt(0, m.length - CONFIG.quartersHistory - CONFIG.quartersPredict)
      const endIdx = startIdx + CONFIG.quartersHistory

      const priorQuarterDate = m[startIdx].date
      const startDate = addDays(priorQuarterDate, 1)
      const endDate = m[endIdx].date
      const endPredictDate = m[endIdx + CONFIG.quartersPredict].date

      const filteredMetrics = m.filter(sm => sm.date >= startDate && sm.date <= endPredictDate)
      const qm = convertQuarterMapping(m.map(sm => sm.date))

      Api.getHistory(s, startDate, endPredictDate).then(data => {
        const given = data.filter(d => d.date &&  d.date < endDate)
        const predictActual = data.filter(d => d.date && d.date >= endDate)
        const predictFake = createOpposite(predictActual)
        const correctIdx = Math.random() < 0.5 ? 0 : 1
        const predictChoices = correctIdx === 0 ? [predictActual, predictFake] : [predictFake, predictActual]

        setSymbol(s)
        setMetrics(filteredMetrics)
        setQuarterMapping(qm)
        setHistory(given)
        setPredict(predictChoices)
        setCorrectAnswer(correctIdx)
        Api.getProfile(s).then(p => setProfile(p))
        setPlayable(true)
      })
    })
  }

  useEffect(() => {
    loadAll()
    }, [])

  const checkResult = (answer: 0 | 1) => {
    const correct = answer === correctAnswer
    if (correct) {
      setMessageResult("... Correct!")
      setNumCorrect(numCorrect + 1)
    } else {
      setMessageResult("... Incorrect :-(")
      setNumIncorrect(numIncorrect + 1)
    }

    if (predict !== undefined && correctAnswer !== undefined) {
      const updated = correctAnswer === 0 ? [predict[correctAnswer], []] : [[], predict[correctAnswer]]
      setPredict(updated)
    }
    setPlayable(false)
  }

  if (
    symbol === undefined ||
    profile === undefined ||
    history === undefined ||
    metrics === undefined ||
    quarterMapping === undefined ||
    predict === undefined
  ) { return <div>Loading...</div> }

  const metricKeys = [

    {
        accessor: (m: StockMetric) => m["Revenue per Share"],
        colName: "Revenue per Share",
    },
    {
        accessor: (m: StockMetric) => m["Net Income per Share"],
        colName: "Net Income per Share",
    },
    {
        accessor: (m: StockMetric) => m["Operating Cash Flow per Share"],
        colName: "Operating Cash Flow per Share",
    },
    {
        accessor: (m: StockMetric) => m["Free Cash Flow per Share"],
        colName: "Free Cash Flow per Share",
    },
    {
        accessor: (m: StockMetric) => m["Cash per Share"],
        colName: "Cash per Share",
    },
    {
        accessor: (m: StockMetric) => m["Book Value per Share"],
        colName: "Book Value per Share",
    },
    {
        accessor: (m: StockMetric) => m["Tangible Book Value per Share"],
        colName: "Tangible Book Value per Share",
    },
    {
        accessor: (m: StockMetric) => m["Shareholders Equity per Share"],
        colName: "Shareholders Equity per Share",
    },
    {
        accessor: (m: StockMetric) => m["Interest Debt per Share"],
        colName: "Interest Debt per Share",
    },
    {
        accessor: (m: StockMetric) => m["Market Cap"],
        colName: "Market Cap",
    },
    {
        accessor: (m: StockMetric) => m["Enterprise Value"],
        colName: "Enterprise Value",
    },
    {
        accessor: (m: StockMetric) => m["PE ratio"],
        colName: "PE ratio",
    },
    {
        accessor: (m: StockMetric) => m["Price to Sales Ratio"],
        colName: "Price to Sales Ratio",
    },
    {
        accessor: (m: StockMetric) => m["POCF ratio"],
        colName: "POCF ratio",
    },
    {
        accessor: (m: StockMetric) => m["PFCF ratio"],
        colName: "PFCF ratio",
    },
    {
        accessor: (m: StockMetric) => m["PB ratio"],
        colName: "PB ratio",
    },
    {
        accessor: (m: StockMetric) => m["PTB ratio"],
        colName: "PTB ratio",
    },
    {
        accessor: (m: StockMetric) => m["EV to Sales"],
        colName: "EV to Sales",
    },
    {
        accessor: (m: StockMetric) => m["Enterprise Value over EBITDA"],
        colName: "Enterprise Value over EBITDA",
    },
    {
        accessor: (m: StockMetric) => m["EV to Operating cash flow"],
        colName: "EV to Operating cash flow",
    },
    {
        accessor: (m: StockMetric) => m["EV to Free cash flow"],
        colName: "EV to Free cash flow",
    },
    {
        accessor: (m: StockMetric) => m["Earnings Yield"],
        colName: "Earnings Yield",
    },
    {
        accessor: (m: StockMetric) => m["Free Cash Flow Yield"],
        colName: "Free Cash Flow Yield",
    },
    {
        accessor: (m: StockMetric) => m["Debt to Equity"],
        colName: "Debt to Equity",
    },
    {
        accessor: (m: StockMetric) => m["Debt to Assets"],
        colName: "Debt to Assets",
    },
    {
        accessor: (m: StockMetric) => m["Net Debt to EBITDA"],
        colName: "Net Debt to EBITDA",
    },
    {
        accessor: (m: StockMetric) => m["Current ratio"],
        colName: "Current ratio",
    },
    {
        accessor: (m: StockMetric) => m["Interest Coverage"],
        colName: "Interest Coverage",
    },
    {
        accessor: (m: StockMetric) => m["Income Quality"],
        colName: "Income Quality",
    },
    {
        accessor: (m: StockMetric) => m["Dividend Yield"],
        colName: "Dividend Yield",
    },
    {
        accessor: (m: StockMetric) => m["Payout Ratio"],
        colName: "Payout Ratio",
    },
    {
        accessor: (m: StockMetric) => m["SG&A to Revenue"],
        colName: "SG&A to Revenue",
    },
    {
        accessor: (m: StockMetric) => m["R&D to Revenue"],
        colName: "R&D to Revenue",
    },
    {
        accessor: (m: StockMetric) => m["Intangibles to Total Assets"],
        colName: "Intangibles to Total Assets",
    },
    {
        accessor: (m: StockMetric) => m["Capex to Operating Cash Flow"],
        colName: "Capex to Operating Cash Flow",
    },
    {
        accessor: (m: StockMetric) => m["Capex to Revenue"],
        colName: "Capex to Revenue",
    },
    {
        accessor: (m: StockMetric) => m["Capex to Depreciation"],
        colName: "Capex to Depreciation",
    },
    {
        accessor: (m: StockMetric) => m["Stock-based compensation to Revenue"],
        colName: "Stock-based compensation to Revenue",
    },
    {
        accessor: (m: StockMetric) => m["Graham Number"],
        colName: "Graham Number",
    },
    {
        accessor: (m: StockMetric) => m["Graham Net-Net"],
        colName: "Graham Net-Net",
    },
    {
        accessor: (m: StockMetric) => m["Working Capital"],
        colName: "Working Capital",
    },
    {
        accessor: (m: StockMetric) => m["Tangible Asset Value"],
        colName: "Tangible Asset Value",
    },
    {
        accessor: (m: StockMetric) => m["Net Current Asset Value"],
        colName: "Net Current Asset Value",
    },
    {
        accessor: (m: StockMetric) => m["Invested Capital"],
        colName: "Invested Capital",
    },
    {
        accessor: (m: StockMetric) => m["Average Receivables"],
        colName: "Average Receivables",
    },
    {
        accessor: (m: StockMetric) => m["Average Payables"],
        colName: "Average Payables",
    },
    {
        accessor: (m: StockMetric) => m["Average Inventory"],
        colName: "Average Inventory",
    },
    {
        accessor: (m: StockMetric) => m["Capex per Share"],
        colName: "Capex per Share",
    },
  ]

  // console.log(metrics)
  // console.log(history)
  // console.log(quarterMapping)
  return (
    <div className="App">
      <Header/>
      <Jumbotron>
        <Container fluid>
          <h1>Matt Levine's Insider Trading Game</h1>
          <Card body>Suppose you had access to a companies earnings report prior to anyone else.
          Surely you could predict the performance of the stock, or could you? Inspired by Matt
          Levine's <a
            href="https://www.bloomberg.com/opinion/articles/2019-11-26/knowing-the-future-isn-t-that-helpful">
          Knowing the Future Isn't That Helpful</a>. Check me out on <a href="https://www.github.com/breeko/stox">
              github</a>
          </Card>
          <h1>{profile.companyName} ({symbol})</h1>
          <Card body>{profile.description}</Card>
          <Card body>
            <p>Try and guess performance for stock {symbol} in the final quarter</p>

            <p>Number Correct: {numCorrect} Number Incorrect: {numIncorrect} {messageResult}</p>
          </Card>
          <ButtonToolbar>
            <Button disabled={!playable} style={{backgroundColor: Colors.orange}} onClick={() => checkResult(0)}>
              Option 1
            </Button>
            <Button disabled={!playable} style={{backgroundColor: Colors.teal}} onClick={() => checkResult(1)}>
              Option 2
            </Button>
            <Button variant="light" onClick={loadAll}>Play Again</Button>
            </ButtonToolbar>
          <StockChart history={history} predict={predict} quarterMapping={quarterMapping} />
          <StockMetricsTable metrics={metrics} metricKeys={metricKeys} quarterMapping={quarterMapping}/>
        </Container>
      </Jumbotron>
    </div>
  )
}

export default App
