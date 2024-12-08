import { filterData, splitLabel } from '@/lib/dataUtils';
import { DataRow, PlotDataType } from '@/lib/types';
import { useState, useEffect } from 'react';
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryTooltip,
  VictoryZoomContainer,
  VictoryTheme,
} from 'victory';

/**
 * Component to render a histogram based on plot data.
 * This component processes the raw data, creates histogram bins, and visualizes the frequency distribution of the data.
 * It includes zoom, pan, and tooltips for an interactive experience.
 *
 * @param {PlotDataType} plotData - The configuration for the chart, including axis labels and filter settings.
 * @param {Array<DataRow>} fileData - The raw data to be displayed in the chart.
 * @returns {JSX.Element} The rendered histogram.
 */
interface Props {
  plotData: PlotDataType;
  fileData: DataRow[];
}

const Histogram = ({ plotData, fileData }: Props) => {
  const [filteredData, setFilteredData] = useState(fileData);

  // Filter the data based on plotData configuration
  useEffect(() => {
    filterData(plotData, fileData, setFilteredData);
  }, [fileData, plotData]);

  // Process data to calculate histogram bins and frequencies
  const processData = () => {
    const xValues = filteredData.map(
      (item) => parseFloat(item[plotData.xAxis] as string) || 0
    );
    const minX = Math.min(...xValues); // Get minimum value for x-axis
    const maxX = Math.max(...xValues); // Get maximum value for x-axis
    const binSize = (maxX - minX) / 10; // Define bin size

    // Generate bins based on the range of x-values
    const bins = Array.from(
      { length: Math.ceil((maxX - minX) / binSize) },
      (_, i) => minX + i * binSize
    );

    // Calculate frequencies for each bin
    const histogramData = bins.map((bin, index) => {
      const nextBin = bins[index + 1] || maxX + binSize; // Define the next bin's upper limit
      const count = xValues.filter(
        (value) => value >= bin && value < nextBin
      ).length;

      return {
        x: `${bin.toFixed(2)} - ${nextBin.toFixed(2)}`, // Bin label showing the range
        y: count, // Frequency for this bin
        label: `Range: ${bin.toFixed(2)} - ${nextBin.toFixed(
          2
        )}\nCount: ${count}`, // Tooltip label
      };
    });

    return histogramData; // Return processed histogram data
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
            allowZoom={true} // Enable zoom
            allowPan={true} // Enable panning
            zoomDimension="x"
          />
        }
      >
        {/* X Axis with Custom Wrapped Tick Labels */}
        <VictoryAxis
          label={plotData.xAxis}
          tickFormat={(tick) => (isNaN(tick) ? splitLabel(tick, 15) : tick)} // Wrap tick labels if too long
          style={{
            axisLabel: { padding: 60 },
            tickLabels: { fontSize: 12, padding: 10, textAnchor: 'middle' },
            grid: { stroke: '#d6d6d6', strokeWidth: 1.5 },
          }}
        />

        {/* Y Axis for Frequency */}
        <VictoryAxis
          dependentAxis
          label="Frequency"
          style={{
            axisLabel: { padding: 60 },
            tickLabels: { fontSize: 12, padding: 5, wordWrap: 'break-all' },
            grid: { stroke: '#d6d6d6', strokeWidth: 1.5 },
          }}
        />

        {/* Bar Chart for Histogram */}
        <VictoryBar
          labelComponent={
            <VictoryTooltip
              flyoutStyle={{ fill: 'darkslategrey', strokeWidth: 1 }} // Tooltip style
              pointerLength={40}
              style={{
                fill: 'white',
                fontSize: 14,
                fontWeight: 500,
                textAnchor: 'middle',
              }}
            />
          }
          data={processData()} // Use processed histogram data
          labels={({ datum }) => datum.label} // Display tooltip label
          events={[
            {
              target: 'data',
              eventHandlers: {
                onMouseOver: () => [
                  {
                    target: 'data',
                    mutation: () => ({
                      style: { fill: 'cornflowerblue' }, // Change color on hover
                    }),
                  },
                  {
                    target: 'labels',
                    mutation: () => ({
                      active: true, // Activate tooltip label on hover
                    }),
                  },
                ],
                onMouseOut: () => [
                  {
                    target: 'data',
                    mutation: () => ({}), // Reset style on mouse out
                  },
                  {
                    target: 'labels',
                    mutation: () => ({
                      active: false, // Deactivate tooltip label
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

export default Histogram;
