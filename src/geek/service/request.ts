// @ts-nocheck
import { defHttp } from '/@/utils/http/axios';
import { deepMerge } from '../utils';
import type { RequestOptions } from '/#/axios';
import type { AxiosRequestConfig } from 'axios';

const requestOptions = {
  isTransformResponse: true,
  // 是否返回原生响应头 比如：需要获取响应头时使用该属性
  //isReturnNativeResponse: true,
  //apiUrl: globSetting.apiUrl + '/admin',
  //apiUrl: '/cool/admin',
  errorMessageMode: 'notice',
};

export default (config: AxiosRequestConfig, options?: RequestOptions): Promise<T> => {
  return defHttp.request(config, deepMerge(requestOptions, options));
};
