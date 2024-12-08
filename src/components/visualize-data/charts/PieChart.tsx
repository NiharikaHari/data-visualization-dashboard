import { filterData } from '@/lib/dataUtils';
import { colorScale, DataRow, PlotDataType } from '@/lib/types';
import { useState, useEffect } from 'react';
import { VictoryPie, VictoryTooltip, VictoryTheme } from 'victory';

/**
 * Component to render a pie chart based on plot data.
 * This component aggregates the data, processes it into a format suitable for VictoryPie,
 * and visualizes the data using a pie chart with tooltips and a custom color scale.
 *
 * @param {PlotDataType} plotData - The configuration for the chart, including axis labels and filter settings.
 * @param {Array<DataRow>} fileData - The raw data to be displayed in the pie chart.
 * @returns {JSX.Element} The rendered pie chart.
 */
interface Props {
  plotData: PlotDataType;
  fileData: DataRow[];
}

const PieChart = ({ plotData, fileData }: Props) => {
  const [filteredData, setFilteredData] = useState(fileData);

  // Filter the data based on plotData configuration
  useEffect(() => {
    filterData(plotData, fileData, setFilteredData);
  }, [fileData, plotData]);

  // Process the data to aggregate by labels and sum values
  const processData = () => {
    const aggregatedData = {} as Record<string, number>;

    // Aggregate the values by label
    filteredData.forEach((dataRow) => {
      const label = dataRow[plotData.xAxis] as string;
      const value = parseFloat(dataRow[plotData.yAxis] as string) || 0;
      if (!aggregatedData[label]) {
        aggregatedData[label] = 0;
      }
      aggregatedData[label] += value;
    });

    // Convert the aggregated data into the format required for VictoryPie
    return Object.entries(aggregatedData).map(([label, value]) => ({
      x: label,
      y: value,
      label: `${label}: ${value.toFixed(2)}`, // Display formatted value in tooltip
    }));
  };

  const pieData = processData();

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg">
      <VictoryPie
        width={1000}
        data={pieData} // Data to be displayed in the pie chart
        colorScale={colorScale} // Apply custom color scale
        labelComponent={
          <VictoryTooltip
            flyoutStyle={{ fill: 'darkslategrey', strokeWidth: 1 }} // Style for tooltip
            style={{ fill: 'white', fontSize: 12, fontWeight: 500 }} // Tooltip text style
          />
        }
        theme={VictoryTheme.material} // Use the material theme
        style={{
          labels: { fill: 'black', fontSize: 14, fontWeight: 600 }, // Label style
        }}
      />
    </div>
  );
};

export default PieChart;
