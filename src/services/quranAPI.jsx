// src/services/quranAPI.js
import axios from 'axios';
let config = {
    headers: {
      "Content-Type": "application/json",
      'Access-Control-Allow-Origin': '*',
      }
    }
const quranAPI = axios.create({
    baseURL: 'https://api.alquran.cloud/v1/',
    config
});

export default quranAPI;
