// @ts-nocheck
import { isDev, config /* , proxy */ } from '../config';
import type { RequestOptions } from '/#/axios';
import type { AxiosRequestConfig } from 'axios';
import { isObject } from 'lodash-es';
import request from './request';

//const baseUrl = '';

/* export function _Service(
  value:
    | string
    | {
        namespace?: string;
        url?: string;
        mock?: boolean;
      }
) {
  return function (target: any) {
    // 命名
    if (typeof value == 'string') {
      target.prototype.namespace = value;
    }

    // 复杂项
    if (isObject(value)) {
      target.prototype.namespace = value.namespace;
      target.prototype.mock = value.mock;

      // 代理
      if (value.proxy) {
        target.prototype.url = proxy[value.proxy].target;
      } else {
        if (value.url) {
          target.prototype.url = value.url;
        }
      }
    }
  };
} */

export function Service(value: any) {
  return function (target: any) {
    // 命名
    if (typeof value == 'string') {
      target.prototype.namespace = value;
    }

    // 复杂项
    if (isObject(value)) {
      const { proxy, namespace, url, mock } = value;
      const item = __PROXY_LIST__[proxy];

      if (proxy && !item) {
        console.error(`${proxy} 指向的地址不存在！`);
      }

      target.prototype.namespace = namespace;
      target.prototype.mock = mock;

      if (proxy) {
        target.prototype.proxy = proxy;
        target.prototype.url = url || item ? item.target : null;
      }
    }
  };
}

/* export class __BaseService {
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
      if (!isDev) {
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
} */

export class BaseService {
  constructor(
    options = {} as {
      namespace?: string;
    }
  ) {
    if (options?.namespace) {
      this.namespace = options.namespace;
    }
    if (!this.permission) this.permission = {};
    if (!this.action) this.action = {};
  }

  // request(
  //   options = {} as {
  //     params?: any;
  //     data?: any;
  //     url: string;
  //     method?: 'GET' | 'get' | 'POST' | 'post' | string;
  //     [key: string]: any;
  //   }
  // ) {
  //   if (!options.params) options.params = {};

  //   let ns = '';

  //   // 是否 mock 模式
  //   if (this.mock || config.test.mock) {
  //     // 测试
  //   } else {
  //     if (isDev) {
  //       ns = this.proxy || config.baseUrl;
  //     } else {
  //       ns = this.proxy ? this.url : config.baseUrl;
  //     }
  //   }

  //   // 拼接前缀
  //   if (this.namespace) {
  //     ns += '/' + this.namespace;
  //   }

  //   // 处理地址
  //   if (options.proxy === undefined || options.proxy) {
  //     options.url = ns + options.url;
  //   }

  //   return request(options);
  // }

  request(conf: AxiosRequestConfig, options?: RequestOptions) {
    if (!conf.params) conf.params = {};

    let ns = '';

    // 是否 mock 模式
    if (this.mock || config.test.mock) {
      if (!isDev) {
        ns = this.proxy || config.baseUrl;
      } else {
        ns = this.proxy ? this.url : config.baseUrl;
      }
    }

    // 拼接前缀
    if (this.namespace) {
      ns += '/' + this.namespace;
    }

    // 处理 http
    if (conf.url.indexOf('http') !== 0) {
      conf.url = ns + conf.url;
    }
    // console.log('config', config);
    // console.log('options', options);
    return request(conf, options);
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

  // page(data: { page?: number; size?: number; [key: string]: any }) {
  //   return this.request({
  //     url: '/page',
  //     method: 'POST',
  //     data,
  //   });
  // }

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

  info(params: { id?: number | string; [key: string]: any }, options?: RequestOptions) {
    return this.request(
      {
        url: '/info',
        params,
      },
      options
    );
  }

  update(data: { id?: number | string; [key: string]: any }, options?: RequestOptions) {
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
