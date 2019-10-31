import React, { useEffect } from 'react'
import * as d3 from 'd3'

const BarChart: React.FC = () => {
    const canvas = React.createRef<HTMLDivElement>()
    const data = [2,4,2,6,8]

    useEffect(() => {
        drawBarChart(data)
    }, [])

    const drawBarChart = (data: number[]) => {
        d3.select(canvas.current)
            .append('svg')
            .attr('width', 600)
            .attr('height', 400)
            .style('border', '1px solid black')

    }
    
    return(<div ref={canvas}></div>)
}

export default BarChart