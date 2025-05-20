import axios from 'axios';

const token = localStorage.getItem('esurat_login_token');

const Api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export default Api;