import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080', // ajustar conforme backend
  headers: {
    'Content-Type': 'application/json',
  },
});
