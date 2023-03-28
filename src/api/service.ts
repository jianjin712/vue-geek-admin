import axios from 'axios';
import Adapter from 'axios-mock-adapter';
import { get } from 'lodash-es';
import { getToken, getUserInfo } from '/@/utils/auth';
import { errorLog, errorCreate } from './tools';
import { useGlobSetting } from '../hooks/setting';
//import { useI18n } from '/@/hooks/web/useI18n';
import { mockHttp } from '/@/utils/http/axios/index';

const globSetting = useGlobSetting();
/**
 * @description 创建请求实例
 */
function createService() {
  // 创建一个 axios 实例
  const service = axios.create();
  // 请求拦截
  service.interceptors.request.use(
    (config) => config,
    (error) => {
      // 发送失败
      console.log('service.ts', error);
      return Promise.reject(error);
    }
  );
  // 响应拦截
  service.interceptors.response.use(
    // (response) => {
    //   // dataAxios 是 axios 返回数据中的 data
    //   const dataAxios = response.data;
    //   // 这个状态码是和后端约定的
    //   const { successful } = dataAxios;
    //   if (successful) {
    //     return dataAxios;
    //   } else if (response.config.responseType === 'blob') {
    //     return dataAxios;
    //   } else {
    //     errorCreate(`${dataAxios.message}`);
    //   }
    // },
    (response) => {
      //NProgress.done();
      //const { t } = useI18n();

      const dataAxios = response.data;
      const { code } = dataAxios;
      let message = '';
      if (Reflect.has(dataAxios, 'message')) {
        message = dataAxios.message;
      } else if (Reflect.has(dataAxios, 'msg')) {
        message = dataAxios.msg;
      } else {
        message = '后端错误字段未定义！';
      }

      if (!dataAxios) {
        //throw new Error(t('sys.api.apiRequestFailed'));
        errorCreate(`@${message}@`);
      }

      switch (code) {
        case 0:
        case 200:
        case 1000:
          return dataAxios;
        default:
          return Promise.reject(message);
      }
    },
    (error) => {
      console.log('error', error);
      const message = get(error, 'response.data.message');
      const status = get(error, 'response.status');
      switch (status) {
        case 400:
          error.message = '请求错误';
          break;
        case 401:
          error.message = '未授权，请登录';
          break;
        case 403:
          error.message = '拒绝访问';
          break;
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`;
          break;
        case 408:
          error.message = '请求超时';
          break;
        case 500:
          error.message = '服务器内部错误';
          break;
        case 501:
          error.message = '服务未实现';
          break;
        case 502:
          error.message = '网关错误';
          break;
        case 503:
          error.message = '服务不可用';
          break;
        case 504:
          error.message = '网关超时';
          break;
        case 505:
          error.message = 'HTTP版本不受支持';
          break;
        default:
          break;
      }
      if (error.message === 'Network Error') {
        error.message = '网络连接失败,请稍后再试';
      }
      if (message) {
        error.message = message;
      }
      errorLog(error);
      return Promise.reject(error);
    }
  );
  return service;
}

/**
 * @description 创建请求方法
 * @param {Object} service axios 实例
 */
function createRequestFunction(service) {
  return function (config) {
    const token = getToken();
    const userInfo = getUserInfo();
    let headers = {};
    if (token !== null && token !== undefined) {
      headers = {
        Authorization: token,
        tenantId: userInfo?.tenantId,
      };
    }
    const configDefault = {
      headers: {
        ...headers,
        'Content-Type': get(config, 'headers.Content-Type', 'application/json'),
      },
      // 超时时间 10 秒
      timeout: 1000 * 10,
      baseURL: globSetting.apiUrl,
      //data: {},
    };
    return service(Object.assign(configDefault, config));
  };
}

// 用于真实网络请求的实例和请求方法
export const service = createService();
export const request = createRequestFunction(service);

// 用于模拟网络请求的实例和请求方法
export const serviceForMock = createService();
export const requestForMock = createRequestFunction(serviceForMock);

export const mockService = mockHttp();

// 网络请求数据模拟工具
//export const mock = new Adapter(serviceForMock, {
export const mock = new Adapter(mockService.getAxios(), {
  delayResponse: parseInt(Math.floor(Math.random() * 100)),
});

export const GET = async (url, query) => {
  return await request({ url: url, method: 'GET', params: query });
};

export const POST = async (url, obj) => {
  return await request({ url: url, method: 'POST', data: obj });
};

export const PUT = async (url, obj) => {
  return await request({ url: url, method: 'PUT', data: obj });
};

export const DELETE = async (url, obj) => {
  return await request({ url: url, method: 'DELETE', data: obj });
};
