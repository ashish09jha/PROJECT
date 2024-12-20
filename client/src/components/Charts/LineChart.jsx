import React from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, LineSeries, DateTime, Legend, Tooltip } from '@syncfusion/ej2-react-charts';
import { useStateContext } from '../../contexts/ContextProvider';

const LineChart = () => {
  const { currentMode } = useStateContext();
  const LinePrimaryXAxis = {
    valueType: 'DateTime',
    labelFormat: 'y',
    intervalType: 'Years',
    edgeLabelPlacement: 'Shift',
    majorGridLines: { width: 0 },
    background: 'white',
  };
  
const LinePrimaryYAxis = {
  labelFormat: '{value}%',
  rangePadding: 'None',
  minimum: 0,
  maximum: 100,
  interval: 20,
  lineStyle: { width: 0 },
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 },
};

const lineChartData = [
  [
    { x: new Date(2005, 0, 1), y: 21 },
    { x: new Date(2006, 0, 1), y: 24 },
    { x: new Date(2007, 0, 1), y: 36 },
    { x: new Date(2008, 0, 1), y: 38 },
    { x: new Date(2009, 0, 1), y: 54 },
    { x: new Date(2010, 0, 1), y: 57 },
    { x: new Date(2011, 0, 1), y: 70 },
  ],
  // [
  //   { x: new Date(2005, 0, 1), y: 28 },
  //   { x: new Date(2006, 0, 1), y: 44 },
  //   { x: new Date(2007, 0, 1), y: 48 },
  //   { x: new Date(2008, 0, 1), y: 50 },
  //   { x: new Date(2009, 0, 1), y: 66 },
  //   { x: new Date(2010, 0, 1), y: 78 },
  //   { x: new Date(2011, 0, 1), y: 84 },
  // ],

  // [
  //   { x: new Date(2005, 0, 1), y: 10 },
  //   { x: new Date(2006, 0, 1), y: 20 },
  //   { x: new Date(2007, 0, 1), y: 30 },
  //   { x: new Date(2008, 0, 1), y: 39 },
  //   { x: new Date(2009, 0, 1), y: 50 },
  //   { x: new Date(2010, 0, 1), y: 70 },
  //   { x: new Date(2011, 0, 1), y: 100 },
  // ],
]; 
 
const lineCustomSeries = [
  { dataSource: lineChartData[0],
    xName: 'x',
    yName: 'y',  
    name: 'Germany',
    width: '2',
    marker: { visible: true, width: 10, height: 10 },
    type: 'Line' },

  { dataSource: lineChartData[1],
    xName: 'x',
    yName: 'y',
    name: 'England',
    width: '2',
    marker: { visible: true, width: 10, height: 10 },
    type: 'Line' },

  { dataSource: lineChartData[2],
    xName: 'x',
    yName: 'y',
    name: 'India',
    width: '2',
    marker: { visible: true, width: 10, height: 10 },
    type: 'Line' },

];

  return (
    <ChartComponent
      id="line-chart"
      height="420px"
      primaryXAxis={LinePrimaryXAxis}
      primaryYAxis={LinePrimaryYAxis}
      chartArea={{ border: { width: 0 } }}
      tooltip={{ enable: true }}
      background={currentMode === 'Dark' ? '#33373E' : '#fff'}
      legendSettings={{ background: 'white' }}
    >
      <Inject services={[LineSeries, DateTime, Legend, Tooltip]} />
      <SeriesCollectionDirective>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {lineCustomSeries.map((item, index) => <SeriesDirective key={index} {...item} />)}
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default LineChart;
