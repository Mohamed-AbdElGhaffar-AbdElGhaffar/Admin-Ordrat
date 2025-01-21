import { API_BASE_URL } from '@/config/base-url';
import axios from 'axios';
import { useGuardContext } from './GuardContext';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
 
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          window.location.href = '/signin';
          throw new Error('Refresh token not found.');
        }

        const refreshResponse = await axios.post(
          '/api/Auth/RefreshAccessToken',
          { refreshToken },
          { baseURL: API_BASE_URL }
        );
        if (refreshResponse.status === 401) {
          localStorage.clear();
          window.location.href = '/signin';
        }
        console.log("refreshResponse.data.token: ",refreshResponse);
        const { setGuard } = useGuardContext();
        setGuard(true);
        localStorage.setItem('accessToken', refreshResponse.data.accessToken);
        localStorage.setItem('userData',  refreshResponse.data);
        localStorage.setItem('role', refreshResponse.data.roles[0]);
        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.clear();
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
