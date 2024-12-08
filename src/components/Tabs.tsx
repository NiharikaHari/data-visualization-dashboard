import { useState } from 'react';
import VisualizeTab from '@/components/visualize-data/VisualizeTab';
import RunPipelineTab from '@/components/run-pipeline/RunPipelineTab';
import AggregatedTab from '@/components/view-aggregated-data/AggregatedTab';

/**
 * Component to render a tabbed interface for navigating between different sections of the dashboard.
 * Handles switching between tabs for running a pipeline, viewing aggregated data, and visualizing data.
 * Displays the appropriate content based on the active tab.
 *
 * @returns {JSX.Element} The rendered tabbed interface with buttons for navigation and dynamic tab content.
 */

const Tabs = () => {
  const [activeTab, setActiveTab] = useState('Run Pipeline');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Run Pipeline':
        return <RunPipelineTab />;
      case 'Retrieve Aggregated Data':
        return <AggregatedTab />;
      case 'Visualize Data':
        return <VisualizeTab />;
      default:
        return <div>Select a tab to see content.</div>;
    }
  };
  return (
    <>
      {/* Tab navigation bar */}
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 ">
        {/* Tab button for "Run Pipeline" */}
        <li className="me-2">
          <button
            onClick={() => setActiveTab('Run Pipeline')} // Sets the active tab to "Run Pipeline"
            aria-current="page"
            className={`inline-block p-4 rounded-t-lg ${
              activeTab === 'Run Pipeline' // Highlights the active tab
                ? 'text-blue-600 bg-gray-100 active'
                : 'hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            Run Pipeline
          </button>
        </li>

        {/* Tab button for "Retrieve Aggregated Data" */}
        <li className="me-2">
          <button
            onClick={() => setActiveTab('Retrieve Aggregated Data')} // Sets the active tab to "Retrieve Aggregated Data"
            className={`inline-block p-4 rounded-t-lg ${
              activeTab === 'Retrieve Aggregated Data' // Highlights the active tab
                ? 'text-blue-600 bg-gray-100 active'
                : 'hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            View Aggregated Data
          </button>
        </li>

        {/* Tab button for "Visualize Data" */}
        <li className="me-2">
          <button
            onClick={() => setActiveTab('Visualize Data')} // Sets the active tab to "Visualize Data"
            className={`inline-block p-4 rounded-t-lg ${
              activeTab === 'Visualize Data' // Highlights the active tab
                ? 'text-blue-600 bg-gray-100 active'
                : 'hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            Visualize Data
          </button>
        </li>
      </ul>

      {/* Render content based on the active tab */}
      <div className="p-4">{renderTabContent()}</div>
    </>
  );
};

export default Tabs;
