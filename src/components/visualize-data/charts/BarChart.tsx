import { useState, useEffect } from 'react';
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryTooltip,
  VictoryZoomContainer,
  VictoryTheme,
} from 'victory';
import { DataRow, PlotDataType } from '@/lib/types';
import {
  aggregateDataAverage,
  filterData,
  groupDataBar,
  splitLabel,
} from '@/lib/dataUtils';

/**
 * Component to render a bar chart based on plot data.
 * It processes the provided file data and displays the data as a bar chart, allowing zoom and pan interactions.
 * The chart displays aggregated values for each group in the data, with interactive tooltips and hover effects.
 *
 * @param {PlotDataType} plotData - The configuration for the chart, including axes and filter settings.
 * @param {Array<DataRow>} fileData - The raw data to be displayed in the chart.
 * @returns {JSX.Element} The rendered bar chart.
 */
interface Props {
  plotData: PlotDataType;
  fileData: DataRow[];
}

const BarChart = ({ plotData, fileData }: Props) => {
  const [filteredData, setFilteredData] = useState<DataRow[]>(fileData);

  // Filter the data based on the plotData filter settings
  useEffect(() => {
    filterData(plotData, fileData, setFilteredData);
  }, [fileData, plotData]);

  // Process data to group by x-axis and calculate average y-axis value
  const processData = () => {
    const groupedData = groupDataBar(filteredData, plotData);
    return aggregateDataAverage(groupedData, plotData);
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
        containerComponent={
          <VictoryZoomContainer
            allowZoom={true}
            allowPan={true}
            zoomDimension="x"
          />
        }
      >
        {/* X Axis with Custom Wrapped Tick Labels */}
        <VictoryAxis
          label={plotData.xAxis}
          tickFormat={(tick) => (isNaN(tick) ? splitLabel(tick, 15) : tick)} // Wrap long labels
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

        {/* Y Axis */}
        <VictoryAxis
          dependentAxis
          label={plotData.yAxis}
          style={{
            axisLabel: { padding: 60 },
            tickLabels: { fontSize: 12, padding: 5, wordWrap: 'break-all' },
            grid: { stroke: '#d6d6d6', strokeWidth: 1.5 },
          }}
        />

        {/* Bar Chart with Tooltips and Hover Effects */}
        <VictoryBar
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
          data={processData()}
          labels={({ datum }) => datum.label}
          events={[
            {
              target: 'data',
              eventHandlers: {
                // Handle hover effect for the bars and labels
                onMouseOver: () => [
                  {
                    target: 'data',
                    mutation: () => ({
                      style: { fill: 'cornflowerblue' }, // Change bar color on hover
                    }),
                  },
                  {
                    target: 'labels',
                    mutation: () => ({
                      active: true, // Activate label on hover
                    }),
                  },
                ],
                onMouseOut: () => [
                  {
                    target: 'data',
                    mutation: () => ({}), // Reset bar style when hover ends
                  },
                  {
                    target: 'labels',
                    mutation: () => ({
                      active: false, // Deactivate label on hover out
                    }),
                  },
                ],
              },
            },
          ]}
        />
      </VictoryChart>
    </div>
  );
};

export default BarChart;
