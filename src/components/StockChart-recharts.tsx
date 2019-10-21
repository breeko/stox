
import React, { useState, useEffect } from "react";
import { StockHistory } from "../Response";
import {
	LineChart, Line, XAxis, YAxis, ReferenceLine, CartesianGrid, Label, Tooltip
  } from 'recharts';
import { unique, convertDate, getQuarter } from "../utils";
  
const StockChart: React.FC<{history: StockHistory[], quarterMapping: Map<Date, string>}> = (props) => {
	const data = props.history.map(h => {return {quarter: getQuarter(h.date, props.quarterMapping), time: h.date.getTime(), date: h.date, close: h.close}})
	const [width, setWidth] = useState(0)

	const updateWidth = () => {
		setWidth(window.innerWidth - 100)
	}
	useEffect(() => { 
		updateWidth()
	}, [])
	window.addEventListener('resize', updateWidth)

	const closes = data.map(n => n.close)
	const [domainMin, domainMax] = [Math.floor(Math.min(...closes) * 0.95), Math.ceil(Math.max(...closes) / 0.95)]
	const [xDomainMin, xDomainMax] = [data[0].time, data[data.length - 1].time]
	const quarters = unique(data.map(n => n.quarter))
	const referenceTimes = quarters.splice(0, quarters.length).flatMap(q => data.find(n => n.quarter === q) || [])
	console.log(data)

	return(
		<LineChart
			width={width}
			height={300}
			data={data}
			margin={{
				top: 50, right: 0, left: 0, bottom: 50,
			}}
		>
		<CartesianGrid strokeDasharray="4 4" />
		<XAxis
			type={'number'}
			dataKey="time"
			domain={[xDomainMin, xDomainMax]}
			tickFormatter={(n: number) => ''}
			ticks={[]}
			/>
		<YAxis domain={[domainMin, domainMax]} tickCount={5}/>
		<Line type="monotone" dataKey="close" stroke="#8884d8" dot={false} />
		
		{referenceTimes.map(n => 
			<ReferenceLine
				key={n.time}
				dy={150}
				x={n.time}
				stroke="gray"
				strokeDasharray='4 4'>
			<Label fontWeight='lighter' opacity={0.5} stroke='black' value={n.quarter} position='insideTopLeft'/>
			</ReferenceLine>)}
			<Tooltip isAnimationActive={false} labelFormatter={(n) => convertDate(new Date(n))} />
		</LineChart>
	)
}

export default StockChart;
