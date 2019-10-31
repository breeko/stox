import _ from "lodash"
import React, { Fragment, useEffect, useState } from "react"
import { GoogleChartLoader } from "../../ReactGoogleChartsLoader"
import { StockHistory } from "../../Response"
import { StockChartProps, StockNode } from "../../types"
import { getQuarter } from "../../utils"
import { getChartData, getChartOptions } from "./utils"

const StockChart: React.FC<StockChartProps> = (props) => {

  const [g, setG] = useState<typeof google>()

  // TODO: chart ref.current is always null
  const chartRef = React.createRef<HTMLDivElement>()

  useEffect(() => {
    draw()
  }, [g, props.predict])

  const convertHistory = (history: StockHistory[]): StockNode[] =>
    history.map(h => ({
      close: h.close,
      date: h.date,
      quarter: h.date ? getQuarter(h.date, props.quarterMapping) : "NA",
      time: h.date ? h.date.getTime() : 0}))

  const data = convertHistory(props.history)
  const predict = props.predict.map(p => convertHistory(p))

  const chartData = g && getChartData(g, data, predict)
  const chartOptions = getChartOptions(data, predict)

  const draw = () => {
    if (chartRef.current && g && chartData) {
      const chart = new g.visualization.LineChart(chartRef.current)
      chart.draw(chartData, chartOptions)
    }
  }

  window.onload = draw
  window.onresize = draw

  return(
    <Fragment>
    <GoogleChartLoader
      onLoad={setG}
      onError={() => alert(`something went wrong`)}
    />
      <div ref={chartRef}></div>
    </Fragment>

  )
}

export default StockChart
