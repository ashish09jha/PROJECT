import React, { useState, useEffect } from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, Legend, Category, StackingColumnSeries, Tooltip } from '@syncfusion/ej2-react-charts';
import { useStateContext } from '../../contexts/ContextProvider';

const Stacked = ({ width, height, stackedChartData }) => {
  const { currentMode } = useStateContext();
  const [maxYValue, setMaxYValue] = useState(0);

  useEffect(() => {
    if (stackedChartData.length > 0) {
      const maxVal = Math.max(
        ...stackedChartData.flat().map(item => item.y)
      );
      setMaxYValue(maxVal);
    }
  }, [stackedChartData]);

  console.log('Max Y Value:', maxYValue);

  const stackedPrimaryXAxis = {
    majorGridLines: { width: 0 },
    minorGridLines: { width: 0 },
    majorTickLines: { width: 0 },
    minorTickLines: { width: 0 },
    interval: 1,
    lineStyle: { width: 0 }, 
    labelIntersectAction: 'Rotate45',
    valueType: 'Category',
  }; 

  const stackedPrimaryYAxis = {
    lineStyle: { width: 0 },
    minimum: 0,
    maximum: maxYValue + 100, 
    interval: Math.ceil((maxYValue + 50) / 4) || 10,
    majorTickLines: { width: 0 },
    majorGridLines: { width: 1 },
    minorGridLines: { width: 1 },
    minorTickLines: { width: 0 },
    labelFormat: '{value}',
  };

  const stackedCustomSeries = [
    {
      dataSource: stackedChartData[0] || [],
      xName: 'x',
      yName: 'y',
      name: 'Learners',
      type: 'StackingColumn',
      background: 'blue',
    },
    {
      dataSource: stackedChartData[1] || [],
      xName: 'x',
      yName: 'y',
      name: 'Instructors',
      type: 'StackingColumn',
      background: 'red',
    },
  ];

  return (
    <ChartComponent
      id="charts"
      primaryXAxis={stackedPrimaryXAxis}
      primaryYAxis={stackedPrimaryYAxis}
      width={width}
      height={height}
      chartArea={{ border: { width: 0 } }}
      tooltip={{ enable: true }}
      background={currentMode === 'Dark' ? '#33373E' : '#fff'}
      legendSettings={{ background: 'white', enablePages: true }}
    >
      <Inject services={[StackingColumnSeries, Category, Legend, Tooltip]} />
      <SeriesCollectionDirective>
        {stackedCustomSeries.map((item, index) => (
          <SeriesDirective
            key={index}
            dataSource={item.dataSource}
            xName={item.xName}
            yName={item.yName}
            name={item.name}
            type={item.type}
            background={item.background}
          />
        ))}
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default Stacked;