import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { message } from 'antd';
import { ApiResponse } from '../types';

// 创建 axios 实例
const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://linkbot-ai-production.up.railway.app/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 添加认证 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 添加租户 ID
    const tenantId = localStorage.getItem('tenantId');
    if (tenantId) {
      config.headers['X-Tenant-ID'] = tenantId;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response;
    
    // 如果 API 返回失败，显示错误消息
    if (!data.success) {
      message.error(data.message || '请求失败');
      return Promise.reject(new Error(data.message || '请求失败'));
    }
    
    return response;
  },
  (error) => {
    // 处理 HTTP 错误
    if (error.response) {
      const { status, data } = error.response;
      
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
          message.error(data?.message || '请求失败');
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
