import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router';
import type { App, Plugin } from 'vue';

import { unref } from 'vue';
import { isArray, isObject } from '/@/utils/is';

export const noop = () => {};

/**
 * @description:  Set ui mount node
 */
export function getPopupContainer(node?: HTMLElement): HTMLElement {
  return (node?.parentNode as HTMLElement) ?? document.body;
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = '';
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
  }
  parameters = parameters.replace(/&$/, '');
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}

export function openWindow(
  url: string,
  opt?: { target?: TargetContext | string; noopener?: boolean; noreferrer?: boolean }
) {
  const { target = '__blank', noopener = true, noreferrer = true } = opt || {};
  const feature: string[] = [];

  noopener && feature.push('noopener=yes');
  noreferrer && feature.push('noreferrer=yes');

  window.open(url, target, feature.join(','));
}

// dynamic use hook props
export function getDynamicProps<T, U>(props: T): Partial<U> {
  const ret: Recordable = {};

  Object.keys(props).map((key) => {
    ret[key] = unref((props as Recordable)[key]);
  });

  return ret as Partial<U>;
}

export function getRawRoute(route: RouteLocationNormalized): RouteLocationNormalized {
  if (!route) return route;
  const { matched, ...opt } = route;
  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }))
      : undefined) as RouteRecordNormalized[],
  };
}

export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any;
  comp.install = (app: App) => {
    app.component(comp.name || comp.displayName, component);
    if (alias) {
      app.config.globalProperties[alias] = component;
    }
  };
  return component as T & Plugin;
};

export function orderBy(list: Array<any>, key: any) {
  return list.sort((a, b) => a[key] - b[key]);
}

export function deepTree(list: Array<any>) {
  const newList: Array<any> = [];
  const map: any = {};

  //list.forEach((e) => (map[e.id] = e));
  list.forEach((e) => {
    map[e.id] = e;
    if (e.parentId == null || e.parentId <= 0) {
      newList.push(e);
    }
  });

  list.forEach((e) => {
    //const parent = map[e.parentId];

    // if (parent) {
    //   (parent.children || (parent.children = [])).push(e);
    // } else {
    //   newList.push(e);
    // }
    if (e.parentId > 0) {
      const parent = map[e.parentId];
      if (parent) {
        if (parent.children == null) {
          parent.children = [];
        }
        parent.children.push(e);
      }
      /*  else {
        newList.push(e);
      } */
    }
  });

  const fn = (list: Array<any>) => {
    list.map((e) => {
      if (e.children instanceof Array) {
        e.children = orderBy(e.children, 'orderNum');

        fn(e.children);
      }
    });
  };

  fn(newList);

  return newList;
  //orderBy(newList, 'orderNum');
}

export function revDeepTree(list: Array<any> = []) {
  const d: Array<any> = [];
  let id = 0;

  const deep = (list: Array<any>, parentId: any) => {
    list.forEach((e) => {
      if (!e.id) {
        e.id = id++;
      }

      e.parentId = parentId;

      d.push(e);

      if (e.children && isArray(e.children)) {
        deep(e.children, e.id);
      }
    });
  };

  deep(list || [], null);

  return d;
}

/**
 * 筛选排序字段数据
 * @treeList 树形数据列表
 * @filter 排除的字段
 * */
export function filterData(treeList: Array<any> = [], filter: string) {
  return treeList
    .filter((item) => {
      return item[filter] == 1;
    })
    .map((item) => {
      item = Object.assign({}, item);
      if (item?.children) {
        item.children = filterData(item.children, filter);
      }
      return item;
    });
}
