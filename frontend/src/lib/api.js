import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  localStorage.setItem('token', data.token);
  return data;
};

export const login = async (payload) => {
  const { data } = await api.post('/auth/login', payload);
  localStorage.setItem('token', data.token);
  return data;
};

export const fetchPages = async (query) => {
  const params = query ? { q: query } : undefined;
  const { data } = await api.get('/pages', { params });
  return data;
};

export const fetchPage = async (id) => {
  const { data } = await api.get(`/pages/${id}`);
  return data;
};

export const createPage = async (payload) => {
  const { data } = await api.post('/pages', payload);
  return data;
};

export const updatePage = async (id, payload) => {
  const { data } = await api.put(`/pages/${id}`, payload);
  return data;
};

export const deletePage = async (id) => {
  const { data } = await api.delete(`/pages/${id}`);
  return data;
};

export const fetchBlocks = async (pageId) => {
  const { data } = await api.get(`/blocks/${pageId}`);
  return data;
};

export const saveBlocks = async (pageId, blocks) => {
  const { data } = await api.put(`/blocks/${pageId}`, { blocks });
  return data;
};

export default api;
