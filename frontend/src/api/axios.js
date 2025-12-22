import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});

// export const IMAGE_BASE_URL = 'http://localhost:8080/uploads/medicines/';
export const IMAGE_BASE_URL = 'http://localhost:8080/uploads/';

export default api;