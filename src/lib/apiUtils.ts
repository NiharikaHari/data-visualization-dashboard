import axios from 'axios';
import { FormData } from './types';

export const runPipeline = (inputData: FormData) => {
  return axios.post('/api/run-pipeline', JSON.stringify(inputData), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const fetchAggregatedList = async () => {
  const response = await axios.get('/api/data/aggregated');
  return response.data['aggregated-data-links'];
};

export const fetchFileData = async (fileName: string) => {
  const response = await axios.get(`/api/data/aggregated/${fileName}`);
  return response.data;
};
