import {
  aggregateDataAverage,
  filterData,
  groupDataBar,
  splitLabel,
} from '@/lib/dataUtils';
import { DataRow, PlotDataType } from '@/lib/types';
import { useState, useEffect } from 'react';
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTooltip,
  VictoryTheme,
  VictoryVoronoiContainer,
} from 'victory';

/**
 * Component to render a line chart based on plot data.
 * This component processes the raw data, computes averages, and visualizes the data using a line chart.
 * It includes tooltips and an interactive Voronoi container for better user experience.
 *
 * @param {PlotDataType} plotData - The configuration for the chart, including axis labels and filter settings.
 * @param {Array<DataRow>} fileData - The raw data to be displayed in the chart.
 * @returns {JSX.Element} The rendered line chart.
 */
interface Props {
  plotData: PlotDataType;
  fileData: DataRow[];
}

const LineChart = ({ plotData, fileData }: Props) => {
  const [filteredData, setFilteredData] = useState(fileData);

  // Filter the data based on plotData configuration
  useEffect(() => {
    filterData(plotData, fileData, setFilteredData);
  }, [fileData, plotData]);

  // Process the data by grouping by x-axis and aggregating with average
  const processData = () => {
    const groupedData = groupDataBar(filteredData, plotData);
    const aggregatedData = aggregateDataAverage(groupedData, plotData);
    return aggregatedData;
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg">
      <VictoryChart
        width={1000}
        height={450}
        theme={VictoryTheme.material}
        domainPadding={{ x: 20 }}
        padding={{
          top: 50,
          left: 70,
          right: 50,
          bottom: 100,
        }}
        containerComponent={<VictoryVoronoiContainer voronoiDimension="x" />}
      >
        {/* X Axis with Custom Wrapped Tick Labels */}
        <VictoryAxis
          label={plotData.xAxis}
          tickFormat={(tick) => (isNaN(tick) ? splitLabel(tick, 15) : tick)} // Wrap tick labels if they are too long
          style={{
            axisLabel: { padding: 60 },
            tickLabels: {
              fontSize: 12,
              padding: 10,
              textAnchor: 'middle',
            },
            grid: { stroke: '#d6d6d6', strokeWidth: 1.5 },
          }}
        />

        {/* Y Axis for dependent values */}
        <VictoryAxis
          dependentAxis
          label={plotData.yAxis}
          style={{
            axisLabel: { padding: 60 },
            tickLabels: { fontSize: 12, padding: 5, wordWrap: 'break-all' },
            grid: { stroke: '#d6d6d6', strokeWidth: 1.5 },
          }}
        />

        {/* Line Chart for visualizing the data */}
        <VictoryLine
          data={processData()}
          labels={({ datum }) => datum.label} // Display label in the tooltip
          labelComponent={
            <VictoryTooltip
              flyoutStyle={{
                fill: 'darkslategrey',
                strokeWidth: 1,
              }}
              pointerLength={40}
              style={{
                fill: 'white',
                fontSize: 14,
                fontWeight: 500,
                textAnchor: 'middle',
              }}
            />
          }
        />
      </VictoryChart>
    </div>
  );
};

export default LineChart;
