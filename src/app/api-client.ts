import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1',
});

// Candidate endpoints
export const validateCandidate = async (candidateJson: any) => {
  const { data } = await api.post('/candidates/validate', candidateJson);
  return data;
};

// Experiment endpoints
export const createExperiment = async (payload: any, idempotencyKey: string) => {
  const { data } = await api.post('/experiments', payload, {
    headers: { 'Idempotency-Key': idempotencyKey },
  });
  return data;
};

export const listExperiments = async (params: { limit?: number; offset?: number; status?: string } = {}) => {
  const { data } = await api.get('/experiments', { params });
  return data;
};

export const getExperiment = async (id: string) => {
  const { data } = await api.get(`/experiments/${id}`);
  return data;
};

export const getExperimentResults = async (id: string) => {
  const { data } = await api.get(`/experiments/${id}/results`);
  return data;
};

export const cancelExperiment = async (id: string) => {
  const { data } = await api.post(`/experiments/${id}/cancel`);
  return data;
};

// Config endpoints
export const listArchitectures = async () => {
  const { data } = await api.get('/architectures');
  return data;
};

export const listWorkloads = async () => {
  const { data } = await api.get('/workloads');
  return data;
};

export const listCostCatalogs = async () => {
  const { data } = await api.get('/cost-catalogs');
  return data;
};

export const getHealth = async () => {
  const { data } = await api.get('/health');
  return data;
};

export const getReady = async () => {
  const { data } = await api.get('/ready');
  return data;
};

export default api;
