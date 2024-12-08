import axios from 'axios';
import { FormData } from '@/lib/types';

/**
 * Function to run the pipeline with the provided input data.
 *
 * @param inputData - The data used to run the pipeline.
 * @returns The response from the server.
 */
export const runPipeline = (inputData: FormData) => {
  return axios.post('/api/run-pipeline', JSON.stringify(inputData), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Function to fetch the aggregated data links.
 *
 * @returns A promise that resolves to the list of aggregated data links.
 */
export const fetchAggregatedList = async () => {
  const response = await axios.get('/api/data/aggregated');
  return response.data['aggregated-data-links'];
};

/**
 * Function to fetch the data of a specific file based on the provided file name.
 *
 * @param fileName - The name of the file to fetch data for.
 * @returns The data of the requested file.
 */
export const fetchFileData = async (fileName: string) => {
  const response = await axios.get(`/api/data/aggregated/${fileName}`);
  return response.data;
};
