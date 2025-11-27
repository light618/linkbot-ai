import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { message } from 'antd';
import { ApiResponse } from '../types';

// 开发环境走 CRA 代理 → 后端路由为 /auth/...
// 生产环境走 nginx 反代 → 统一以 /api 作为前缀
const API_PREFIX = process.env.NODE_ENV === 'development' ? '' : '/api';

const api: AxiosInstance = axios.create({
  baseURL: API_PREFIX,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    const tenantId = localStorage.getItem('tenantId');
    if (tenantId) {
      (config.headers as any)['X-Tenant-ID'] = tenantId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response as any;
    if (data && Object.prototype.hasOwnProperty.call(data, 'success') && data.success === false) {
      const msg = data.message || '请求失败';
      message.error(msg);
      return Promise.reject(new Error(msg));
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response as any;
      switch (status) {
        case 401:
          message.error('登录已过期，请重新登录');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          message.error('权限不足');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器内部错误');
          break;
        default:
          message.error((data && data.message) || '请求失败');
      }
    } else if (error.request) {
      message.error('网络连接失败，请检查网络');
    } else {
      message.error('请求配置错误');
    }
    return Promise.reject(error);
  }
);

export default api;
