import { useState, useEffect } from 'react';
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryTooltip,
  VictoryZoomContainer,
  VictoryTheme,
  VictoryGroup,
  VictoryLegend,
} from 'victory';
import { colorScale, DataRow, PlotDataType } from '@/lib/types';
import {
  aggregateDataAverageGroup,
  filterData,
  groupDataBarGrouped,
  splitLabel,
} from '@/lib/dataUtils';

/**
 * Component to render a grouped bar chart based on plot data.
 * This component processes and visualizes the provided file data in grouped bars, with tooltips, zoom, pan, and a legend.
 * It aggregates and groups the data by specified criteria for each group.
 *
 * @param {PlotDataType} plotData - The configuration for the chart, including axes and filter settings.
 * @param {Array<DataRow>} fileData - The raw data to be displayed in the chart.
 * @returns {JSX.Element} The rendered grouped bar chart.
 */

interface Props {
  plotData: PlotDataType;
  fileData: DataRow[];
}

const GroupedBarChart = ({ plotData, fileData }: Props) => {
  const [filteredData, setFilteredData] = useState(fileData);

  // Filter the data based on the plotData filter settings
  useEffect(() => {
    filterData(plotData, fileData, setFilteredData);
  }, [fileData, plotData]);

  // Process data to group by x-axis and calculate average y-axis value for each group
  const processData = () => {
    const groupedData = groupDataBarGrouped(filteredData, plotData);
    const aggregatedData = aggregateDataAverageGroup(groupedData, plotData);
    return aggregatedData;
  };

  const groupedData = processData();

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg">
      <VictoryChart
        width={1000}
        height={450}
        theme={VictoryTheme.material}
        domainPadding={{ x: 50, y: 20 }}
        padding={{
          top: 100,
          left: 70,
          right: 50,
          bottom: 100,
        }}
        containerComponent={
          <VictoryZoomContainer
            allowZoom={true} // Enable zooming on the chart
            allowPan={true} // Enable panning on the chart
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
            tickLabels: { fontSize: 12, padding: 10, textAnchor: 'middle' },
            grid: { stroke: '#d6d6d6', strokeWidth: 1.5 },
          }}
        />

        {/* Y Axis */}
        <VictoryAxis
          dependentAxis
          label={plotData.yAxis}
          style={{
            axisLabel: { padding: 60 },
            tickLabels: { fontSize: 12, padding: 5 },
            grid: { stroke: '#d6d6d6', strokeWidth: 1.5 },
          }}
        />

        {/* Grouped Bars */}
        <VictoryGroup offset={20} colorScale={colorScale}>
          {groupedData.map(({ group, data }) => (
            <VictoryBar
              key={group}
              data={data}
              labels={({ datum }) => datum.label}
              labelComponent={
                <VictoryTooltip
                  flyoutStyle={{ fill: 'darkslategrey', strokeWidth: 1 }} // Tooltip background style
                  style={{ fill: 'white', fontSize: 12 }} // Tooltip text style
                />
              }
            />
          ))}
        </VictoryGroup>

        {/* Legend */}
        <VictoryLegend
          title="Groups"
          itemsPerRow={2} // Set the number of items per row in the legend
          gutter={20} // Spacing between legend items
          style={{
            title: { fontSize: 14 },
            labels: { fontSize: 12 },
          }}
          data={groupedData.map(({ group }, index) => ({
            name: group,
            symbol: { fill: colorScale[index % colorScale.length] }, // Use colorScale for the legend
          }))}
        />
      </VictoryChart>
    </div>
  );
};

export default GroupedBarChart;
