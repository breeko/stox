
import React, { useState, useEffect, useLayoutEffect } from "react";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-financial-charts";
import {  AreaSeries } from "react-financial-charts/lib/series";

import { XAxis, YAxis } from "react-financial-charts/lib/axes";
import {
	CrossHairCursor,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-financial-charts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-financial-charts/lib/scale";
import {
	OHLCTooltip,
} from "react-financial-charts/lib/tooltip";
import { last } from "react-financial-charts/lib/utils";
import { Colors } from "./Colors";
import { StockData, StockHistoricalResponse } from "../Response";


  
const StockChart: React.FC<StockHistoricalResponse> = (props) => {
	const chartWidthMult = 0.9
	const height = 400;

	const initialData = props;
	const margin = { left: 100, right: 70, top: 20, bottom: 30 };
	
	const chartWidth = window.innerWidth * chartWidthMult
	const gridWidth = chartWidth - margin.left - margin.right	

	const gridHeight = height - margin.top - margin.bottom;
	
	const showGrid = true;
	const yGrid = showGrid ? { innerTickSize: -1 * gridWidth } : {};
	const xGrid = showGrid ? { innerTickSize: -1 * gridHeight } : {};

	const xScaleProvider = discontinuousTimeScaleProvider
		.inputDateAccessor((d: {date: Date}) => d.date);

	const {
		data,
		xScale,
		xAccessor,
		displayXAccessor,
	} = xScaleProvider(initialData.historical);

	const start = xAccessor(last(data));
	const end = xAccessor(data[Math.max(0, data.length - 150)]);
	const xExtents = [start, end];
	
	return (
		<ChartCanvas 
			height={height}
			disableInteraction={true}
			ratio={1.0}
			width={chartWidth}
			margin={{ left: 80, right: 80, top: 10, bottom: 30 }}
			type='svg'
			seriesName={props.symbol}
			data={data}
			xScale={xScale}
			xAccessor={xAccessor}
			displayXAccessor={displayXAccessor}
			xExtents={xExtents}
		>
			<Chart id={1}yExtents={d => [d.high, d.low]}>
				<XAxis
					axisAt="bottom"
					orient="bottom"
					{...xGrid}
				/>
				<YAxis
					axisAt="right"
					orient="right"
					ticks={5}
					{...yGrid}
				/>
				<MouseCoordinateX
					at="bottom"
					orient="bottom"
					displayFormat={timeFormat("%Y-%m-%d")} />
				<MouseCoordinateY
					at="right"
					orient="right"
					displayFormat={format(".2f")} />
				<AreaSeries
					yAccessor={(d: {close: number}) => d.close}
					stroke={Colors.orange}
				/>
				<OHLCTooltip origin={[-40, 0]}/>
			</Chart>

			<CrossHairCursor />
		</ChartCanvas>

	);
}

export default StockChart;
