import { mockService } from '/@/api/service';
//import { mockHttp } from '/@/utils/http/axios';
//const mock = mockHttp();
const apiPrefix = '/user';
export function GetList(query) {
  return mockService.post({
    url: apiPrefix + '/page',
    data: query,
  });
}

export function AddObj(obj) {
  return mockService.post({
    url: apiPrefix + '/add',
    data: obj,
  });
}

export function UpdateObj(obj) {
  return mockService.post({
    url: apiPrefix + '/update',
    data: obj,
  });
}

export function DelObj(id) {
  return mockService.post({
    url: apiPrefix + '/delete',
    params: { id },
  });
}

export function GetObj(id) {
  return mockService.get({
    url: apiPrefix + '/info',
    params: { id },
  });
}
