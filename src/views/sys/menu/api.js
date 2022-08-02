//import { request } from '/src/api/service';
import { defHttp } from '/@/utils/http/axios';

const request = (obj) => {
  return defHttp.request(obj, {
    isTransformResponse: false,
    //apiUrl: '/mock',
    errorMessageMode: 'notice',
  });
};
export function GetResourceList(params) {
  return defHttp.post(
    {
      url: '/cool/admin/base/sys/resource/page',
      //method: 'post',
      data: params,
    },
    { isTransformResponse: false }
  );
}
export function SaveOrUpdate(obj) {
  if (obj.id) {
    return UpdateObj(obj);
  } else {
    return AddObj(obj);
  }
}
export function AddObj(obj) {
  return request({
    url: '/authority/resources',
    method: 'post',
    data: obj,
  });
}

export function UpdateObj(obj) {
  return request({
    url: `/authority/resources/${obj.id}`,
    method: 'put',
    data: obj,
  });
}

export function DelObj(id) {
  return request({
    url: `/authority/resources/${id}`,
    method: 'delete',
    data: { id },
  });
}

export function GetBuildStandardList(query) {
  return request({
    url: '/tools/dynamic_release_drag',
    method: 'get',
    params: query,
  });
}
