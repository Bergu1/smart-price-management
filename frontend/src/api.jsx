import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/user/',
});

export const register = (data) => API.post('create/', data);
export const login = (data) => API.post('token/', data);
export const getProfile = (token) =>
  API.get('me/', { headers: { Authorization: `Token ${token}` } });
export const updateProfile = (data, token) =>
  API.put('me/', data, { headers: { Authorization: `Token ${token}` } });
