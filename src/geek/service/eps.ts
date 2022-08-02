import { isDev, config } from '../config';
import { BaseService } from './base';
import { storage /* , deepFiles, toCamel, deepMerge */ } from '../utils';
import { isArray, isEmpty } from 'lodash-es';
import { Service } from 'build/geek/temp/service';

// 获取标签名
function getNames(v: any) {
  return [...Object.getOwnPropertyNames(v.constructor.prototype), ...Object.keys(v)].filter(
    (e) => !['namespace', 'constructor', 'request', 'permission'].includes(e)
  );
}

// 标签名
const names = getNames(new BaseService());

export function useEps(service: Service) {
  // 创建描述文件
  function createDts(list: any[]) {
    function deep(v: any) {
      for (const i in v) {
        if (v[i].namespace) {
          v[i].namespace = v[i].namespace;

          // 模块
          const item: any = list.find((e: any) => e.prefix.includes(v[i].namespace));

          // 接口
          const api: any[] = item ? item.api : [];

          // 获取方法集合
          [...names, ...getNames(v[i])].forEach((e) => {
            if (!api.find((a) => a.path.includes(e))) {
              api.push({
                path: `/${e}`,
              });
            }
          });

          if (item) {
            item.api = api;
          } else {
            list.push({
              prefix: `/${v[i].namespace}`,
              api,
            });
          }
        } else {
          deep(v[i]);
        }
      }
    }

    deep(service);

    //本地服务
    return service.request(
      {
        url: '/__cool_eps',
        method: 'POST',
        proxy: false,
        data: {
          service,
          list,
        },
      },
      { errorMessageMode: 'none' }
    );
  }

  // 获取 eps
  function getEps() {
    if (isDev && config.test.eps) {
      service
        .request({
          url: '/sys/open/eps',
        })
        .then(async (res) => {
          if (!isEmpty(res)) {
            const isLoaded: boolean = storage.get('eps');
            storage.set('eps', res);

            if (!isLoaded) {
              location.reload();
            } else {
              set(res, true);
              console.log('[Eps] 初始化成功。');
            }
          }
        })
        .catch((err) => {
          console.error('[Eps] 获取失败！', err.message);
          createDts([]);
        });
    }
  }

  // 设置
  async function set(d: any, c?: boolean) {
    const list: any[] = [];

    if (!d) {
      return false;
    }

    if (isArray(d)) {
      d = { d };
    }
    const res = d;
    for (const i in res) {
      res[i].forEach((e: any) => {
        // 分隔路径
        const arr = e.prefix.replace(/\//, '').replace('admin', '').split('/').filter(Boolean);
        e.prefix = e.prefix.replace('/admin/', '');
        function deep(d: any, i: number) {
          const k = arr[i];

          //if (k.indexOf('Action') != -1) console.log(k);
          if (k) {
            // 是否最后一个
            if (arr[i + 1]) {
              if (!d[k]) {
                d[k] = {};
              }

              deep(d[k], i + 1);
            } else {
              // 本地不存在则创建实例
              if (!d[k]) {
                d[k] = new BaseService({
                  namespace: e.prefix.replace('/admin/', ''),
                });

                // d[k].entity = e.name;
                // d[k].module = e.module;
              }

              // 创建方法
              //console.log('e.api', e.api);
              /* e.api.forEach((a: any) => {
                const n = a.path.replace('/', '');

                const permission = ((d[k].namespace ? d[k].namespace + '/' : '') + n).replace(
                  /\//g,
                  ':'
                );
                d[k].action[n] = {
                  label: a.summary,
                  value: permission,
                  key: permission,
                };

                if (!['add', 'info', 'update', 'page', 'list', 'delete'].includes(n)) {
                  console.log('---a ', a);
                  console.log('---n ', n);
                  // 设置权限
                  d[k].permission[n] = ((d[k].namespace ? d[k].namespace + '/' : '') + n).replace(
                    /\//g,
                    ':'
                  );

                  // 本地不存在则创建
                  if (!d[k][n]) {
                    d[k][n] = function (data: any, opts?: any) {
                      return this.request(
                        {
                          url: a.path,
                          method: a.method,
                          [a.method.toLocaleLowerCase() == 'post' ? 'data' : 'params']: data,
                        },
                        opts || {}
                      );
                    };
                    //console.log(d[k].namespace, k);
                  }
                }
              }); */

              // 创建方法
              e.api.forEach((a: any) => {
                // 方法名
                const n = (a.name || a.path).replace('/', '');

                const permission = ((d[k].namespace ? d[k].namespace + '/' : '') + n).replace(
                  /\//g,
                  ':'
                );
                d[k].action[n] = {
                  label: a.summary,
                  value: permission,
                  key: permission,
                };
                d[k].permission[n] = permission;

                // 过滤
                if (!names.includes(n)) {
                  // 本地不存在则创建
                  if (!d[k][n]) {
                    if (n && !/[-:]/g.test(n)) {
                      d[k][n] = function (data: any, opts?: any) {
                        return this.request(
                          {
                            url: a.path,
                            method: a.method,
                            [a.method.toLocaleLowerCase() == 'post' ? 'data' : 'params']: data,
                          },
                          opts || {}
                        );
                      };
                    }
                  }
                }
              });

              // 创建权限
              //console.log('d[' + k + '].permission', d[k]);
              if (!d[k].permission) {
                d[k].permission = {};

                const ks = Array.from(new Set([...names, ...getNames(d[k])]));

                ks.forEach((e) => {
                  // d[k].permission[e] = `${d[k].namespace.replace('admin/', '')}/${e}`.replace(
                  //   /\//g,
                  //   ':'
                  // );
                  d[k].permission[e] = ((d[k].namespace ? d[k].namespace + '/' : '') + e).replace(
                    /\//g,
                    ':'
                  );
                });
              }
              // console.log(d);
              list.push(e);
            }
          }
        }

        deep(service, 0);
      });
    }
    /* for (const i in d) {
      if (isArray(d[i])) {
        d[i].forEach((e: any) => {
          // 分隔路径
          // const arr = e.prefix
          //   .replace(/\//, '')
          //   .replace('admin', '')
          //   .split('/')
          //   .filter(Boolean)
          //   .map(toCamel);
          const arr = e.prefix.replace(/\//, '').replace('admin', '').split('/').filter(Boolean);

          // 遍历
          function deep(d: any, i: number) {
            const k = arr[i];

            if (k) {
              // 是否最后一个
              if (arr[i + 1]) {
                if (!d[k]) {
                  d[k] = {};
                }

                deep(d[k], i + 1);
              } else {
                // 本地不存在则创建实例
                if (!d[k]) {
                  d[k] = new BaseService({
                    //namespace: e.prefix.substr(1, e.prefix.length - 1),
                    namespace: e.prefix.replace('/admin/', ''),
                  });
                }

                // 创建方法
                e.api.forEach((a: any) => {
                  // 方法名
                  const n = (a.name || a.path).replace('/', '');

                  // 过滤
                  if (!names.includes(n)) {
                    // 本地不存在则创建
                    if (!d[k][n]) {
                      if (n && !/[-:]/g.test(n)) {
                        d[k][n] = function (data: any, opts?: any) {
                          //d[k][n] = function (data: any) {
                          // return this.request({
                          //   url: a.path,
                          //   method: a.method,
                          //   [a.method.toLocaleLowerCase() == 'post' ? 'data' : 'params']: data,
                          // });
                          return this.request(
                            {
                              url: a.path,
                              method: a.method,
                              [a.method.toLocaleLowerCase() == 'post' ? 'data' : 'params']: data,
                            },
                            opts || {}
                          );
                        };
                      }
                    }
                  }
                });

                // 创建权限
                if (!d[k].permission) {
                  d[k].permission = {};

                  const ks = Array.from(new Set([...names, ...getNames(d[k])]));

                  ks.forEach((e) => {
                    // d[k].permission[e] = `${d[k].namespace.replace('admin/', '')}/${e}`.replace(
                    //   /\//g,
                    //   ':'
                    // );
                    d[k].permission[e] = ((d[k].namespace ? d[k].namespace + '/' : '') + e).replace(
                      /\//g,
                      ':'
                    );
                  });
                }

                list.push(e);
              }
            }
          }

          deep(service, 0);
        });
      }
    } */
    // console.log('list', list);
    if (isDev && c) {
      createDts(list);
    }
  }

  // 解析
  try {
    const eps =
      storage.get('eps') ||
      JSON.parse(__EPS__ || '[]').map(([prefix, api]: any[]) => {
        return {
          prefix,
          api: api.map(([method, path, name]: string[]) => {
            return {
              method,
              path,
              name,
            };
          }),
        };
      });

    set(eps);
  } catch (err) {
    console.error('[Eps] 解析失败！', err);
  }

  // 获取
  getEps();
}
