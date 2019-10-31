import { flatten } from "lodash"
import { Colors } from "../../Colors"
import { StockNode } from "../../types"
import { seqArray, unique } from "../../utils"

export const getChartData = (g: typeof google, data: StockNode[], predict: StockNode[][]) => {
    const actualData = new g.visualization.DataTable()
    actualData.addColumn({type: "date", label: "Date"})
    actualData.addColumn({type: "number", label: "Historic"})
    data.forEach(n => actualData.addRow(n.date ? [n.date, n.close] : undefined))

    const predictDatas = predict.map((p, idx) => {
      const predictData = new g.visualization.DataTable()
      predictData.addColumn({type: "date", label: "Date"})
      predictData.addColumn({type: "number", label: `Option ${idx + 1}`})
      p.forEach(n => predictData.addRow(n.date ? [n.date, n.close] : undefined))
      return predictData
    })

    let allDatas = actualData
    predictDatas.forEach( (p, idx) => {
      const colsToInclude = seqArray(1, idx + 1)
      // @ts-ignore
      allDatas = g.visualization.data.join(allDatas, p, "full", [[0, 0]], colsToInclude, [1])
    })
    return allDatas
}

export const getChartOptions = (data: StockNode[], predict: StockNode[][]) => {
    const combinedData = flatten([data, ...predict])

    const quarters = unique(combinedData.map(n => n.quarter))
    const referenceTimes = quarters.flatMap(q =>
    combinedData.find(n => n.quarter === q) || []).map(n => ({f: n.quarter, v: n.date}))

    const options: google.visualization.LineChartOptions = {
        colors: [Colors.dark, Colors.orange, Colors.teal],
        hAxis: {
            gridlines: {
            color: Colors.grey,
            count: referenceTimes.length,
            },
            ticks: referenceTimes,
        },
        height: 300,
        legend: {position: "bottom"},
    }
    return options
}
