import React, { useState, useEffect } from 'react';

import './App.css';
import StockChart from './components/StockChart-recharts'
import { getHistory, getProfile, choose, randomInt, getMetrics, addDays, convertQuarterMapping, getQuarter } from './utils';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Header } from './Header';
import { Container, Jumbotron, Card, Table } from 'react-bootstrap';
import { sp500 } from './sp500';
import { CONFIG } from './Config';
import { StockMetric, StockProfile, StockHistory } from './Response';

const App: React.FC = () => {
  const [profile, setProfile] = useState<StockProfile>()
  const [history, setHistory] = useState<StockHistory[]>()
  const [metrics, setMetrics] = useState<StockMetric[]>()
  const [quarterMapping, setQuarterMapping] = useState<Map<Date, string>>()
  const [symbol, setSymbol] = useState<string>()
  
  useEffect(() => {
    const symbol = choose(sp500)
    
    getMetrics(symbol).then(m => {
      const startIdx = randomInt(0, m.length - CONFIG.quartersHistory - 1)
      const endIdx = startIdx + CONFIG.quartersHistory + CONFIG.quartersPredict

      const priorQuarterDate = m[startIdx].date
      const startDate = addDays(priorQuarterDate, 1)
      const endDate = m[endIdx].date
      
      const filteredMetrics = m.filter(m => m.date >= startDate && m.date <= endDate)
      const qm = convertQuarterMapping(m.map(m => m.date))

      setSymbol(symbol)
      getHistory(symbol, startDate, endDate).then(data => setHistory(data))
      getProfile(symbol, startDate, endDate).then(data => setProfile(data))
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
      colName: "Price Earnings ratio",
      accessor: (m: StockMetric) => m["PE ratio"]
    }]

  console.log(metrics)

    
  return (
    <div className="App">
      <Header/>
      <Jumbotron>
        <Container>
          <h1>{profile.companyName} ({symbol})</h1>
          <Card body>{profile.description}</Card>
          <Table striped bordered hover>
          <thead>
            <tr>
              <th>Metric</th>
                {metrics.map(q => <th>{getQuarter(q.date, quarterMapping)}</th>
              )}
            </tr>
          </thead>
          <tbody>
          {
            metricKeys.map(m => {
              return <tr key={m.colName}>
                <td>{m.colName}</td>
                <td>{m.accessor(metrics[0])}</td>
                {/* {metrics.metrics.splice(0.4).map(met => <td>{m.accessor(met)}</td>)} */}
              </tr>
          })}
          </tbody>
          </Table>
        </Container>
        <StockChart history={history} quarterMapping={quarterMapping} />
      </Jumbotron>
    </div>
  );
}

export default App;
