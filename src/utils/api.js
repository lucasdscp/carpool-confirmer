import axios from 'axios';

const api = axios.create({
  baseURL: 'https://42pdzdivm6.execute-api.us-east-2.amazonaws.com/public/',
});

export default api;