import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', // change to deployed backend later
});

export default API;
