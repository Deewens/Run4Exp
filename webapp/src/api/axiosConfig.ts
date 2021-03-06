import axios from 'axios'

// Default axios
axios.defaults.baseURL = 'http://localhost:8080/api';
axios.defaults.headers.post['Content-Type'] = 'application/json';
if (localStorage.getItem("AUTH_TOKEN")) axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('AUTH_TOKEN')}`;

export const unauthAxios = axios.create({
  baseURL: `http://localhost:8080/api`
})
unauthAxios.defaults.headers.common['Authorization'] = ''
unauthAxios.defaults.headers.post['Content-Type'] = 'application/json';