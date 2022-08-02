import { BaseService, Service, Permission, basename } from '/@/hooks/core/service';
import { useAppStoreWithOut } from '/@/store/modules/app';
function deepFiles(list: any[]) {
  const modules: any = {};

  list.forEach((e) => {
    const arr: any[] = e.path.split('/');
    const parents: any[] = arr.slice(0, arr.length - 1);
    const name: string = basename(e.path).replace('.ts', '');

    let curr: any = modules;
    let prev: any = null;
    let key: any = null;

    parents.forEach((k) => {
      if (!curr[k]) {
        curr[k] = {};
      }

      prev = curr;
      curr = curr[k];
      key = k;
    });

    if (name == 'index') {
      prev[key] = e.value;
    } else {
      curr[name] = e.value;
    }
  });
  return modules;
}

function useService() {
  const files = import.meta.globEager('/src/service/**/*.ts');
  const d: any = [];
  for (const i in files) {
    if (!i.includes('request.ts')) {
      const value = files[i].default;
      const paths = i.split('/').slice(3).join('/');
      //console.log(paths);
      d.push({
        path: paths, //i.replace('/src/service/', ''),
        value: new value(),
      });
    }
  }

  const s = deepFiles(d);
  s.request = new BaseService().request;

  return s;
}

const service = useService();
function useEps() {
  return service.sys.open.eps().then((res: any) => {
    //const res = resdata.data;
    for (const i in res) {
      //console.log(res[i]);
      res[i].forEach((e: any) => {
        // 分隔路径
        const arr = e.prefix.replace(/\//, '').replace('admin', '').split('/').filter(Boolean);

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

                d[k].entity = e.name;
                d[k].module = e.module;
              }

              // 创建方法
              e.api.forEach((a: any) => {
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
              });
            }
          }
        }

        deep(service, 0);
      });
    }
    const useAppStore = useAppStoreWithOut();
    useAppStore.setEps(res);
    return res;
  });
  // .catch((err: string) => {
  //   console.error('后端模块服务异常：', err);
  // });
}

export { BaseService, Service, Permission, service, deepFiles, useService, useEps };
