import { useEffect, useState } from 'react';
import { fetchAggregatedList, fetchFileData } from '@/lib/apiUtils';
import FileList from '@/components/view-aggregated-data/FileList';
import FileDataTable from '@/components/view-aggregated-data/FileDataTable';
import Modal from '../run-pipeline/Modal';

/**
 * Component for managing and displaying aggregated data files.
 * It fetches a list of available files, allows selection of a file, and displays its content in a tabular format.
 * Handles loading and error states for fetching file data and lists.
 *
 * @returns {JSX.Element} The rendered component containing the file list, file data table, and a loading state.
 */

const AggregatedTab = () => {
  const [availableDataList, setAvailableDataList] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [selectedFileData, setSelectedFileData] = useState([]);
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  /**
   * Fetches the list of aggregated files from the server.
   * Updates `availableDataList` and handles loading/error states.
   */
  const loadAggregatedList = async () => {
    try {
      setStatus('loading');
      const list = await fetchAggregatedList();
      setAvailableDataList(list);
      setStatus('success');
    } catch (error) {
      console.error('Error fetching aggregated list:', error);
      setStatus('error');
    }
  };

  /**
   * Fetches the content of a specific file from the server.
   * Updates `selectedFileData` with the retrieved data.
   *
   * @param fileName - The name of the file to fetch data for
   */
  const loadFileData = async (fileName: string) => {
    try {
      const data = await fetchFileData(fileName);
      setSelectedFileData(data);
    } catch (error) {
      console.error('Error fetching file data:', error);
      setStatus('error');
    }
  };

  /**
   * Effect to load the aggregated file list on component mount.
   */
  useEffect(() => {
    loadAggregatedList(); // Load file list on mount
  }, []);

  /**
   * Handles file selection. Updates the selected file and fetches its data.
   *
   * @param fileName - The name of the selected file
   */
  const handleFileClick = (fileName: string) => {
    setSelectedFile(fileName);
    loadFileData(fileName);
  };

  return (
    <>
      <div className="p-10">
        {/* Loading Overlay */}
        {status === 'loading' && (
          <div className="load-bg">
            <div className="loader loader-style"></div>
          </div>
        )}

        {status === 'error' && (
          <Modal
            title={'Error'}
            message={'An error occured while retrieving the data.'}
            onClose={() => setStatus('idle')}
          ></Modal>
        )}

        {/* Reload Button */}
        <button onClick={loadAggregatedList} className="button-1">
          Reload Data
        </button>

        {/* List of Files */}
        <p className="font-medium mt-4">List of Aggregated Data Tables:</p>
        {availableDataList.length > 0 ? (
          <FileList files={availableDataList} onFileClick={handleFileClick} />
        ) : (
          <p>No data available.</p>
        )}

        {/* File Data Table */}
        {selectedFile && (
          <FileDataTable fileName={selectedFile} data={selectedFileData} />
        )}
      </div>
    </>
  );
};

export default AggregatedTab;
