import BarChart from '@/components/visualize-data/charts/BarChart';
import GroupedBarChart from '@/components/visualize-data/charts/GroupedBarChart';
import Histogram from '@/components/visualize-data/charts/Histogram';
import LineChart from '@/components/visualize-data/charts/LineChart';
import PieChart from '@/components/visualize-data/charts/PieChart';
import StackedBarChart from '@/components/visualize-data/charts/StackedBarChart';
import { DataRow, PlotDataType } from '@/lib/types';

/**
 * Component to render the appropriate chart based on plotData.
 * The chart type is determined by the `chartType` field in `plotData`.
 * This component validates the input data and renders the correct chart.
 *
 * @param {PlotDataType} plotData - The configuration for the chart, including the type of chart, axis labels, and data.
 * @param {Array<DataRow>} fileData - The raw data to be visualized in the chart.
 * @returns {JSX.Element | null} - The rendered chart component or null if the data is invalid.
 */
interface Props {
  plotData: PlotDataType;
  fileData: DataRow[];
}

const Chart = ({ plotData, fileData }: Props) => {
  /**
   * Validates if the necessary plot data is provided.
   * Checks that the required data fields are populated depending on the chart type.
   *
   * @returns {boolean} - Returns true if the plot data is valid, otherwise false.
   */
  const validatePlotData = (): boolean => {
    const { chartType, aggData, xAxis, yAxis } = plotData;
    if (chartType === 'Histogram') {
      return aggData.length > 0 && xAxis.length > 0;
    }
    return aggData.length > 0 && xAxis.length > 0 && yAxis.length > 0;
  };

  /**
   * A mapping of chart types to their corresponding components.
   * Each chart type is associated with a specific chart component to render.
   */
  const chartComponents: Record<string, JSX.Element> = {
    'Bar Chart': <BarChart plotData={plotData} fileData={fileData} />,
    'Grouped Bar Chart': (
      <GroupedBarChart plotData={plotData} fileData={fileData} />
    ),
    'Stacked Bar Chart': (
      <StackedBarChart plotData={plotData} fileData={fileData} />
    ),
    Histogram: <Histogram plotData={plotData} fileData={fileData} />,
    'Pie Chart': <PieChart plotData={plotData} fileData={fileData} />,
    'Line Chart': <LineChart plotData={plotData} fileData={fileData} />,
  };

  // Return the corresponding chart component if the data is valid, otherwise return null
  return validatePlotData()
    ? chartComponents[plotData.chartType] || null
    : null;
};

export default Chart;
