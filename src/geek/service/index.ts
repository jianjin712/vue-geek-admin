import { Service } from 'build/geek/temp/service';
import { deepFiles, deepMerge, module } from '../utils';
import { BaseService } from './base';
import { useEps } from './eps';

// 基础服务
// export const _service: any /* Service */ = {
//   request: new BaseService().request,
// };

function getService() {
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

export const service: Service = getService();

export function useService() {
  // 接口内容
  useEps(service);
  // 模块内容
  module.list.forEach((e) => {
    deepMerge(service, deepFiles(e.service || []));
  });

  return service;
}

export * from './base';
export * from './request';
