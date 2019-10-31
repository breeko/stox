
import React from "react"
import { Table } from "react-bootstrap"
import { StockMetric } from "src/Response"
import { getQuarter } from "../utils"

interface StockMetricsTableProps {
  metrics: StockMetric[]
  metricKeys: Array<{
    accessor: (m: StockMetric) => number,
    colName: string,
  }>
  quarterMapping: Map<Date, string>
}

const StockMetricsTable: React.FC<StockMetricsTableProps> = (props) => {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Metric</th>
              {props.metrics.map(q =>
                <th key={`header-${q.date.toDateString()}`}>{getQuarter(q.date, props.quarterMapping)}</th>,
            )}
          </tr>
        </thead>
        <tbody>
        {
            props.metricKeys.map(mKey =>
              <tr key={mKey.colName}>
                <td>{mKey.colName}</td>
                {props.metrics.map(m => <td key={`${mKey.colName}-${m.date.toISOString()}`}>{mKey.accessor(m)}</td>)}
              </tr>,
          )}
        </tbody>
      </Table>
    )
}

export default StockMetricsTable
