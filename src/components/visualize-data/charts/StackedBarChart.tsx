import {
  aggregateDataAverageGroup,
  filterData,
  groupDataBarGrouped,
  splitLabel,
} from '@/lib/dataUtils';
import { colorScale, DataRow, PlotDataType } from '@/lib/types';
import { useState, useEffect } from 'react';
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryTooltip,
  VictoryZoomContainer,
  VictoryTheme,
  VictoryStack,
  VictoryLegend,
} from 'victory';

/**
 * Component to render a stacked bar chart based on plot data.
 * Groups, aggregates, and formats the data for a stacked bar chart with zoom, pan, and legend.
 *
 * @param {PlotDataType} plotData - Configuration for the chart including axis labels and groupings.
 * @param {Array<DataRow>} fileData - Raw data for the chart.
 * @returns {JSX.Element} The rendered stacked bar chart.
 */
interface Props {
  plotData: PlotDataType;
  fileData: DataRow[];
}

const StackedBarChart = ({ plotData, fileData }: Props) => {
  const [filteredData, setFilteredData] = useState(fileData);

  // Filter data based on plotData configuration
  useEffect(() => {
    filterData(plotData, fileData, setFilteredData);
  }, [fileData, plotData]);

  // Group and aggregate data for stacked bars
  const processData = () => {
    const groupedData = groupDataBarGrouped(filteredData, plotData);
    return aggregateDataAverageGroup(groupedData, plotData);
  };

  const stackedData = processData();

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg">
      <VictoryChart
        width={1000} // Set chart size
        height={450}
        theme={VictoryTheme.material} // Material theme for styling
        domainPadding={{ x: 50, y: 20 }} // Padding around the chart domain
        padding={{ top: 100, left: 70, right: 50, bottom: 100 }} // Padding for labels
        containerComponent={
          <VictoryZoomContainer
            allowZoom={true} // Enable zooming
            allowPan={true} // Enable panning
            zoomDimension="x" // Zoom along the x-axis only
          />
        }
      >
        {/* X Axis: Displays categories or time points */}
        <VictoryAxis
          label={plotData.xAxis} // X-axis label
          tickFormat={(tick) => (isNaN(tick) ? splitLabel(tick, 15) : tick)} // Format long labels
          style={{
            axisLabel: { padding: 60 },
            tickLabels: { fontSize: 12, padding: 10, textAnchor: 'middle' },
            grid: { stroke: '#d6d6d6', strokeWidth: 1.5 },
          }}
        />

        {/* Y Axis: Displays values */}
        <VictoryAxis
          dependentAxis
          label={plotData.yAxis} // Y-axis label
          style={{
            axisLabel: { padding: 60 },
            tickLabels: { fontSize: 12, padding: 5 },
            grid: { stroke: '#d6d6d6', strokeWidth: 1.5 },
          }}
        />

        {/* Stacked Bars: Render stacked bars */}
        <VictoryStack colorScale={colorScale}>
          {stackedData.map(({ group, data }) => (
            <VictoryBar
              key={group} // Key for each stacked bar
              data={data} // Data for the stacked bars
              labels={({ datum }) => datum.label} // Display labels for each datum
              labelComponent={
                <VictoryTooltip
                  flyoutStyle={{ fill: 'darkslategrey', strokeWidth: 1 }} // Tooltip style
                  style={{ fill: 'white', fontSize: 12 }} // Tooltip text style
                />
              }
            />
          ))}
        </VictoryStack>

        {/* Legend: Displays chart legend */}
        <VictoryLegend
          title="Groups" // Legend title
          itemsPerRow={2} // Items per row in the legend
          gutter={20} // Space between legend items
          style={{
            title: { fontSize: 14 },
            labels: { fontSize: 12 },
          }}
          data={stackedData.map(({ group }, index) => ({
            name: group, // Legend name for each group
            symbol: { fill: colorScale[index % colorScale.length] }, // Symbol color for each group
          }))}
        />
      </VictoryChart>
    </div>
  );
};

export default StackedBarChart;
