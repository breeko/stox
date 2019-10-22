import React, { useState, useEffect } from 'react';

import './App.css';
import StockChart from './components/StockChart-recharts'
import { getHistory, getProfile, choose, randomInt, getMetrics, addDays, convertQuarterMapping, getQuarter, absoluteMean, createFake } from './utils';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Header } from './Header';
import { Container, Jumbotron, Card, Table } from 'react-bootstrap';
import { sp500 } from './sp500';
import { CONFIG } from './Config';
import { StockMetric, StockProfile, StockHistory } from './Response';
import StockMetricsTable from './components/StockMetricsTable';

const App: React.FC = () => {
  const [profile, setProfile] = useState<StockProfile>()
  const [history, setHistory] = useState<StockHistory[]>()
  const [predict, setPredict] = useState<StockHistory[][]>()
  const [metrics, setMetrics] = useState<StockMetric[]>()
  const [quarterMapping, setQuarterMapping] = useState<Map<Date, string>>()
  const [symbol, setSymbol] = useState<string>()
  
  useEffect(() => {
    const symbol = choose(sp500)
    
    getMetrics(symbol).then(m => {
      const startIdx = randomInt(0, m.length - CONFIG.quartersHistory - CONFIG.quartersPredict)
      const endIdx = startIdx + CONFIG.quartersHistory

      const priorQuarterDate = m[startIdx].date
      const startDate = addDays(priorQuarterDate, 1)
      const endDate = m[endIdx].date
      const endPredictDate = m[endIdx + CONFIG.quartersPredict].date

      const filteredMetrics = m.filter(m => m.date >= startDate && m.date <= endDate)
      const qm = convertQuarterMapping(m.map(m => m.date))

      setSymbol(symbol)
      getHistory(symbol, startDate, endPredictDate).then(data => {
        const given = data.filter(d => d.date < endDate)
        const predictActual = data.filter(d => d.date >= endDate)
        const predictDates = predictActual.map(p => p.date)
        const meanAbsDev = absoluteMean(given.map(n => n.close))
        const predictFake = createFake(predictDates, given[given.length - 1].close, meanAbsDev)
        setHistory(given)
        setPredict(predict)
      })
      getProfile(symbol, startDate, endPredictDate).then(data => setProfile(data))
      setQuarterMapping(qm)
      setMetrics(filteredMetrics)
    })

    
  }, [])


  if (symbol === undefined || profile === undefined || history === undefined || metrics === undefined || quarterMapping === undefined) return <div>Loading...</div>
  const metricKeys = [{
      colName: 'Revenue per Share',
      accessor: (m: StockMetric) => m["Revenue per Share"]
    }, 
    {
      colName: 'Net Income per Share',
      accessor: (m: StockMetric) => m["Net Income per Share"]
    },
    {
      colName: "Free Cash Flow per Share",
      accessor: (m: StockMetric) => m["Free Cash Flow per Share"]
    },
    {
      colName: "Debt to Equity",
      accessor: (m: StockMetric) => m["Debt to Equity"]
    }
  ]

  // console.log(metrics)
    
  return (
    <div className="App">
      <Header/>
      <Jumbotron>
        <Container>
          <h1>{profile.companyName} ({symbol})</h1>
          <Card body>{profile.description}</Card>
          <StockMetricsTable metrics={metrics} metricKeys={metricKeys} quarterMapping={quarterMapping}/>
        </Container>
        <StockChart history={history} quarterMapping={quarterMapping} />
      </Jumbotron>
    </div>
  );
}

export default App;
