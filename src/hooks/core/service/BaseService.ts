// @ts-nocheck
import { defHttp } from '/@/utils/http/axios';
import { isDevMode } from '/@/utils/env';
import { deepMerge } from '/@/utils';
import type { RequestOptions } from '/#/axios';
import type { AxiosRequestConfig } from 'axios';
import { isObject } from 'lodash-es';
//import { useGlobSetting } from '/@/hooks/setting';
//const globSetting = useGlobSetting();
const baseUrl = ''; //globSetting.apiUrl;

const requestOptions = {
  isTransformResponse: true,
  // 是否返回原生响应头 比如：需要获取响应头时使用该属性
  //isReturnNativeResponse: true,
  //apiUrl: globSetting.apiUrl + '/admin',
  //apiUrl: '/cool/admin',
  errorMessageMode: 'notice',
};

const request = (config: AxiosRequestConfig, options?: RequestOptions): Promise<T> => {
  return defHttp.request(config, deepMerge(requestOptions, options));
};

export default class BaseService {
  constructor(opt: any = {}) {
    const crud: any = {
      page: 'page',
      list: 'list',
      info: 'info',
      add: 'add',
      delete: 'delete',
      update: 'update',
    };

    if (opt?.namespace) {
      this.namespace = opt?.namespace;
    }

    if (!this.permission) this.permission = {};
    if (!this.action) this.action = {};

    for (const i in crud) {
      if (this.namespace) {
        this.permission[i] = this.namespace.replace(/\//g, ':') + ':' + crud[i];
        this.action[i] = {};
      } else {
        this.permission[i] = crud[i];
        this.action[i] = {};
      }
    }
  }

  request(config: AxiosRequestConfig, options?: RequestOptions) {
    if (!config.params) config.params = {};

    let ns = '';

    // 是否 mock 模式
    if (!this.mock) {
      if (!isDevMode) {
        ns = this.proxy || baseUrl;
      } else {
        ns = this.proxy ? this.url : baseUrl;
      }
    }

    // 拼接前缀
    if (this.namespace) {
      ns += '/' + this.namespace;
    }

    // 处理 http
    if (config.url.indexOf('http') !== 0) {
      config.url = ns + config.url;
    }
    // console.log('config', config);
    // console.log('options', options);
    return request(config, options);
  }

  list(data: any, options?: RequestOptions) {
    return this.request(
      {
        url: '/list',
        method: 'POST',
        data,
      },
      options
    );
  }

  page(data: any, options?: RequestOptions) {
    return this.request(
      {
        url: '/page',
        method: 'POST',
        data,
      },
      options
    );
  }

  info(params: any, options?: RequestOptions) {
    return this.request(
      {
        url: '/info',
        params,
      },
      options
    );
  }

  update(data: any, options?: RequestOptions) {
    return this.request(
      {
        url: '/update',
        method: 'POST',
        data,
      },
      options
    );
  }

  delete(data: any, options?: RequestOptions) {
    const params = !isObject(data) ? { ids: [data] } : data;
    return this.request(
      {
        url: '/delete',
        method: 'POST',
        data: params,
      },
      options
    );
  }

  add(data: any, options?: RequestOptions) {
    return this.request(
      {
        url: '/add',
        method: 'POST',
        data,
      },
      options
    );
  }
}
