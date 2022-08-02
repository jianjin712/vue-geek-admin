// @ts-nocheck
import { mock } from './service';
import * as tools from './tools';
import _ from 'lodash-es';
//const commonMocks = import.meta.globEager('./common/mock.*.js');
//const apiMocks = import.meta.globEager('../api/modules/*.mock.ts');
const viewMocks = import.meta.globEager('../views/**/mock.ts');

const list = [];
// _.forEach(commonMocks, (value) => {
//   list.push(value.default);
// });
// _.forEach(apiMocks, (value) => {
//   list.push(value.default);
// });
_.forEach(viewMocks, (value) => {
  list.push(value.default);
});

console.group(' 模拟数据列表');
console.log(viewMocks);
console.groupEnd();

list.forEach((apiFile) => {
  for (const item of apiFile) {
    mock.onAny(new RegExp(item.path)).reply(async (config) => {
      console.group('------------ ' + config.url + ' -------------');
      //console.log('------------fake request start -------------');
      console.log('request:', config);
      const data = config.data ? JSON.parse(config.data) : {};
      const query =
        config.url.indexOf('?') >= 0
          ? config.url.substring(config.url.indexOf('?') + 1)
          : undefined;
      const params = config.params || {};
      if (query) {
        const arr = query.split('&');
        for (const item of arr) {
          const kv = item.split('=');
          params[kv[0]] = kv[1];
        }
      }

      const req = {
        body: data,
        params: params,
      };
      const ret = await item.handle(req);
      console.log('mock:', ret);
      console.log('------------fake request end-------------');
      console.groupEnd();
      if (ret.code === 200) {
        return tools.responseSuccess(ret.data, ret.message);
      } else {
        return tools.responseError(ret.data, ret.message, ret.code);
      }
    });
  }
});
