import { useEffect, useState } from 'react';
import Dropdown from '@/components/visualize-data/Dropdown';
import Chart from '@/components/visualize-data/Chart';
import { DataRow, PlotDataType, OptionsType } from '@/lib/types';
import { getNumericColumns, getUniqueFieldValues } from '@/lib/dataUtils';
import { fetchAggregatedList, fetchFileData } from '@/lib/apiUtils';
import Modal from '../run-pipeline/Modal';

/**
 * Component for the "Visualize" tab in the dashboard.
 * Allows users to select chart types, aggregated datasets, and customize axes, filters, and groupings for dynamic data visualization.
 * Handles the fetching of data, updating dropdown options, and rendering of charts based on user selections.
 *
 * @returns {JSX.Element} The rendered "Visualize" tab with dropdowns for configuration and a chart visualization.
 */

type Status = 'idle' | 'loading' | 'success' | 'error';

const VisualizeTab = () => {
  // State to store the loaded data from files
  const [fileData, setFileData] = useState<DataRow[]>([]);

  const [status, setStatus] = useState<Status>('idle');

  // State to store the current plot configuration (chart type, axes, filters, etc.)
  const [plotData, setPlotData] = useState<PlotDataType>({
    chartType: '',
    aggData: '',
    xAxis: '',
    yAxis: '',
    filterBy: '',
    filterValue: '',
    stackGroupBy: '',
  });

  // State to manage available dropdown options for user selections
  const [dropdownOptions, setDropdownOptions] = useState<OptionsType>({
    chartType: [],
    aggData: [],
    xAxis: [],
    yAxis: [],
    filterBy: [],
    filterValue: [],
    stackGroupBy: [],
  });

  // Initial load: Fetch the list of aggregated datasets available
  useEffect(() => {
    loadAggregatedList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update dropdown options whenever plot data changes
  useEffect(() => {
    updateDropdownOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plotData]);

  /**
   * Updates dropdown options based on the selected aggregated dataset.
   * Fetches the data file and dynamically computes available options
   * (e.g., valid columns for x/y axes, filters, etc.).
   */
  const updateDropdownOptions = async () => {
    const fileName = plotData.aggData;
    if (fileName && fileName.length > 0) {
      const fileData = await loadFileData(fileName);
      if (fileData) {
        const headers = Object.keys(fileData[0]);
        const optionsObj: OptionsType = {
          xAxis: headers,
          yAxis: getNumericColumns(fileData),
          filterBy: headers,
          filterValue: [''],
          chartType: dropdownOptions.chartType,
          aggData: dropdownOptions.aggData,
          stackGroupBy: headers,
        };

        // Update filter values if a filter-by field is already selected
        if (plotData.filterBy && plotData.filterBy.length > 0) {
          optionsObj['filterValue'] = getUniqueFieldValues(
            fileData,
            plotData.filterBy
          );
        }

        setDropdownOptions(optionsObj);
      }
    }
  };

  /**
   * Fetches the list of available aggregated datasets from the backend.
   * Updates the options for the "Select Aggregated Data" dropdown.
   */
  const loadAggregatedList = async () => {
    try {
      const dataList = await fetchAggregatedList();
      setDropdownOptions({ ...dropdownOptions, aggData: dataList.slice(1) });
    } catch (error) {
      console.error('Error retrieving data:', error);
      setStatus('error');
    }
  };

  /**
   * Fetches data from a specific file based on its name.
   * Updates the `fileData` state with the retrieved data.
   * @param fileName - Name of the file to fetch.
   */
  const loadFileData = async (fileName: string) => {
    try {
      const data = await fetchFileData(fileName);
      setFileData(data);
      return data;
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  /**
   * Dynamically renders dropdowns based on the selected chart type.
   * Determines the required dropdowns and their respective options.
   */
  const renderDropdowns = () => {
    let dropdownNames: string[] = [];
    let options: string[][] = [];

    // Configure dropdowns based on the selected chart type
    if (plotData.chartType === 'Bar Chart') {
      dropdownNames = [
        'Select X-Axis',
        'Select Y-Axis',
        'Filter By',
        'Select Filter Value',
      ];
      options = [
        dropdownOptions.xAxis,
        dropdownOptions.yAxis,
        dropdownOptions.filterBy,
        dropdownOptions.filterValue,
      ];
    } else if (
      plotData.chartType === 'Grouped Bar Chart' ||
      plotData.chartType === 'Stacked Bar Chart'
    ) {
      dropdownNames = [
        'Select X-Axis',
        'Select Y-Axis',
        'Stack/Group By',
        'Filter By',
        'Select Filter Value',
      ];
      options = [
        dropdownOptions.xAxis,
        dropdownOptions.yAxis,
        dropdownOptions.stackGroupBy,
        dropdownOptions.filterBy,
        dropdownOptions.filterValue,
      ];
    } else if (plotData.chartType === 'Pie Chart') {
      dropdownNames = [
        'Select Category',
        'Select Values',
        'Filter By',
        'Select Filter Value',
      ];
      options = [
        dropdownOptions.xAxis,
        dropdownOptions.yAxis,
        dropdownOptions.filterBy,
        dropdownOptions.filterValue,
      ];
    } else if (plotData.chartType === 'Histogram') {
      dropdownNames = ['Select X-Axis', 'Filter By', 'Select Filter Value'];
      options = [
        dropdownOptions.yAxis,
        dropdownOptions.filterBy,
        dropdownOptions.filterValue,
      ];
    } else if (plotData.chartType === 'Line Chart') {
      dropdownNames = [
        'Select X-Axis',
        'Select Y-Axis',
        'Filter By',
        'Select Filter Value',
      ];
      options = [
        dropdownOptions.yAxis,
        dropdownOptions.yAxis,
        dropdownOptions.filterBy,
        dropdownOptions.filterValue,
      ];
    }

    // Render dropdowns dynamically based on configuration
    return (
      <>
        {dropdownNames.map((name, ind) => (
          <Dropdown
            key={name}
            plotData={plotData}
            setPlotData={setPlotData}
            name={name}
            items={options[ind]}
          ></Dropdown>
        ))}
      </>
    );
  };

  // Render the main component structure
  return (
    <>
      <div className="flex flex-wrap justify-start">
        {/* Dropdown for selecting chart type */}
        <Dropdown
          plotData={plotData}
          setPlotData={setPlotData}
          name="Select Chart Type"
          items={[
            'Bar Chart',
            'Grouped Bar Chart',
            'Stacked Bar Chart',
            'Histogram',
            'Pie Chart',
            'Line Chart',
          ]}
        ></Dropdown>
        {/* Dropdown for selecting aggregated data */}
        <Dropdown
          plotData={plotData}
          setPlotData={setPlotData}
          name="Select Aggregated Data"
          items={dropdownOptions.aggData}
        ></Dropdown>
        {/* Render additional dropdowns based on selected chart type */}
        {renderDropdowns()}
      </div>

      {status === 'error' && (
        <Modal
          title={'Error'}
          message={'An error occured while retrieving the data.'}
          onClose={() => setStatus('idle')}
        ></Modal>
      )}

      {/* Render chart visualization */}
      <div className="flex justify-center h-4/5 pt-10">
        <Chart plotData={plotData} fileData={fileData}></Chart>
      </div>
    </>
  );
};

export default VisualizeTab;
