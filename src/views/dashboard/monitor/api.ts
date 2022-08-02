import { mockService } from '/@/api/service';
//import { mockHttp } from '/@/utils/http/axios';
//const mock = mockHttp();
const apiPrefix = '/monitor';
export function GetList() {
  return mockService.post({
    url: apiPrefix + '/list',
    //data: query,
  });
}
