import axios from 'axios'

// Default axios
axios.defaults.baseURL = process.env.REACT_APP_API_URL
axios.defaults.headers.post['Content-Type'] = 'application/json';
if (localStorage.getItem("AUTH_TOKEN")) axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('AUTH_TOKEN')}`;

export const unauthAxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL
})
unauthAxios.defaults.headers.common['Authorization'] = ''
unauthAxios.defaults.headers.post['Content-Type'] = 'application/json';