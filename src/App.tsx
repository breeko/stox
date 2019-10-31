import React, { useEffect, useState } from "react"
import { Button, ButtonToolbar, Card, Container, Jumbotron } from "react-bootstrap"
import { Api } from "./api"
import "./App.css"
import "./bootstrap.min.css"
import { Colors } from "./Colors"
import StockChart from "./components/StockChart"
import StockMetricsTable from "./components/StockMetricsTable"
import { CONFIG } from "./Config"
import { Header } from "./Header"
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
        throw Error(`not enough history for ${symbol}`)
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

  const metricKeys = [{
    accessor: (m: StockMetric) => m["Revenue per Share"],
    colName: "Revenue per Share",
    },
    {
      accessor: (m: StockMetric) => m["Net Income per Share"],
      colName: "Net Income per Share",
    },
    {
      accessor: (m: StockMetric) => m["Free Cash Flow per Share"],
      colName: "Free Cash Flow per Share",
    },
    {
      accessor: (m: StockMetric) => m["Debt to Equity"],
      colName: "Debt to Equity",
    },
  ]

  // console.log(metrics)
  // console.log(history)
  // console.log(quarterMapping)

  return (
    <div className="App">
      <Header/>
      <Jumbotron>
        <Container>
          <h1>{profile.companyName} ({symbol})</h1>
          <Card body>{profile.description}</Card>
          <Card body>Number Correct: {numCorrect} Number Incorrect: {numIncorrect} {messageResult}</Card>
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
