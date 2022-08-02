import type { RouteMeta } from 'vue-router';
import { AppRouteRecordRaw } from '/@/router/types';

export interface RouteItem {
  path: string;
  component: any;
  meta: RouteMeta;
  name?: string;
  alias?: string | string[];
  redirect?: string;
  caseSensitive?: boolean;
  children?: RouteItem[];
}

export interface RoutePermis {
  permCodeList: string[];
  menuTreeList: AppRouteRecordRaw[];
}
/**
 * @description: Get menu return value
 */
export type getMenuListResultModel = RouteItem[];

/**
 * @description: 返回权限编码与菜单树形列表
 * @return permCodeList: 权限标识列表
 * @return menuTreeList: type=1 的树形菜单列表
 */
export type getRoutePermisResultModel = RoutePermis;
