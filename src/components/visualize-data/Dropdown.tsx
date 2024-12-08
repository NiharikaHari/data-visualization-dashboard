import { PlotDataType } from '@/lib/types';
import { Menu } from '@headlessui/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

/**
 * Dropdown component to allow users to select an option from a list.
 * The selected option updates the `plotData` based on the dropdown name.
 * The component dynamically adjusts based on the specific plot data field to update.
 *
 * @param {string} name - The name of the dropdown, which determines the corresponding field in `plotData`.
 * @param {Array<string>} items - The list of items to be displayed in the dropdown menu.
 * @param {PlotDataType} plotData - The configuration for the chart, including various properties such as chart type, axes, filters, etc.
 * @param {Function} setPlotData - Function to update the `plotData` state.
 * @returns {JSX.Element} - The rendered dropdown menu.
 */

interface Props {
  name: string;
  items: string[];
  plotData: PlotDataType;
  setPlotData: Dispatch<SetStateAction<PlotDataType>>;
}

const Dropdown = ({ name, items, plotData, setPlotData }: Props) => {
  const [selectedItem, setSelectedItem] = useState<string>();

  /**
   * Handles item selection from the dropdown.
   * Updates the relevant field in `plotData` based on the selected item.
   *
   * @param {string} item - The selected item from the dropdown.
   */
  const handleItemClick = (item: string) => {
    setSelectedItem(item);

    // Update the `plotData` based on the dropdown that is clicked
    if (name === 'Select Chart Type') {
      setPlotData((prevData) => ({
        ...prevData,
        chartType: item,
        xAxis: '',
        yAxis: '',
        filterBy: '',
        filterValue: '',
      }));
    } else if (name === 'Select Aggregated Data') {
      setPlotData((prevData) => ({
        ...prevData,
        xAxis: '',
        yAxis: '',
        filterBy: '',
        filterValue: '',
        aggData: item,
      }));
    } else if (name === 'Select X-Axis' || name === 'Select Category') {
      setPlotData((prevData) => ({
        ...prevData,
        xAxis: item,
      }));
    } else if (name === 'Select Y-Axis' || name === 'Select Values') {
      setPlotData((prevData) => ({
        ...prevData,
        yAxis: item,
      }));
    } else if (name === 'Filter By') {
      setPlotData((prevData) => ({
        ...prevData,
        filterBy: item,
        filterValue: '',
      }));
    } else if (name === 'Select Filter Value') {
      setPlotData((prevData) => ({
        ...prevData,
        filterValue: item,
      }));
    } else if (name === 'Stack/Group By') {
      setPlotData((prevData) => ({
        ...prevData,
        stackGroupBy: item,
      }));
    }
  };

  // Update selected dropdown item based on current plotData values
  useEffect(() => {
    if (name === 'Select X-Axis') {
      if (plotData.xAxis.length === 0) setSelectedItem('Select X-Axis');
    } else if (name === 'Select Y-Axis') {
      if (plotData.yAxis.length === 0) setSelectedItem('Select Y-Axis');
    } else if (name === 'Filter By') {
      if (plotData.filterBy.length === 0) setSelectedItem('Filter By');
    } else if (name === 'Select Filter Value') {
      if (plotData.filterValue.length === 0)
        setSelectedItem('Select Filter Value');
    } else if (name === 'Stack/Group By') {
      if (plotData.stackGroupBy.length === 0) setSelectedItem('Stack/Group By');
    } else if (name === 'Select Category') {
      if (plotData.xAxis.length === 0) setSelectedItem('Select Category');
    } else if (name === 'Select Values') {
      if (plotData.yAxis.length === 0) setSelectedItem('Select Values');
    }
  }, [name, plotData]);

  return (
    <Menu as="div" className="relative">
      {/* Button for dropdown, displaying selected item or default name */}
      {items.length > 0 && items[0].length > 0 ? (
        <Menu.Button className="truncate justify-center max-w-min min-w-48 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2 m-1 text-center inline-flex items-center ">
          {selectedItem ? selectedItem : name}
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path stroke="currentColor" d="m1 1 4 4 4-4" />
          </svg>
        </Menu.Button>
      ) : (
        // Disabled button when no items are available in the dropdown
        <Menu.Button
          disabled
          className="break-words cursor-not-allowed justify-center max-w-60 min-w-44 text-white bg-blue-400 font-medium rounded-lg text-sm px-5 py-2 m-1 text-center inline-flex items-center break-all"
        >
          {name}
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path stroke="currentColor" d="m1 1 4 4 4-4" />
          </svg>
        </Menu.Button>
      )}

      {/* Dropdown menu items */}
      <Menu.Items className="absolute z-10 mt-2 bg-white divide-y divide-gray-200 rounded-lg border-solid border-2 border-gray-200 min-w-44">
        {items.map((item) => (
          <Menu.Item key={item}>
            {/* Render item in menu with active state highlighting */}
            {({ active }) => (
              <a
                href="#"
                className={`break-words block px-4 py-2 ${
                  active ? 'bg-blue-100' : 'text-gray-700'
                }`}
                onClick={() => handleItemClick(item)}
              >
                {item}
              </a>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
};

export default Dropdown;
