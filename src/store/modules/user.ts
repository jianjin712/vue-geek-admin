import type { UserInfo } from '/#/store';
import type { ErrorMessageMode } from '/#/axios';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { RoleEnum } from '/@/enums/roleEnum';
import { PageEnum } from '/@/enums/pageEnum';
import { REFRESH_TOKEN, ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { GetUserInfoModel, LoginParams } from '/@/api/sys/model/userModel';
//import { doLogout, getUserInfo, loginApi } from '/@/api/sys/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';
import { usePermissionStore } from '/@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { isArray } from '/@/utils/is';
import { h } from 'vue';
//import { useEps } from '/@/hooks/core/useService';
//import { useAppStoreWithOut } from '/@/store/modules/app';
import storage from '/@/utils/storage';
import { config } from '/@/geek/config';
import { useCode } from '/@/geek/index';

// 本地缓存
const data = storage.info();
interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

//const appStore = useAppStoreWithOut();
const { service } = useCode();

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: config.test.token || data.token || undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
  },
  actions: {
    // 设置授权标识
    SET_TOKEN(res: any) {
      const { token, refreshToken, refreshExpire, expire } = res;
      // 请求的唯一标识
      this.token = token;
      setAuthCache(TOKEN_KEY, token);
      storage.set('token', token, expire);

      // 刷新 token 的唯一标识
      setAuthCache(REFRESH_TOKEN, refreshToken);
      // 刷新 token 的唯一标识
      storage.set('refreshToken', refreshToken, refreshExpire);
    },
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
      storage.remove('userInfo');
      storage.remove('token');
    },
    /**
     * @description: login
     */

    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      }
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, ...loginParams } = params;
        //const data = await loginApi(loginParams, mode);
        const res = await service.sys.open.userLogin(loginParams);
        // save token
        // console.log(res);
        this.SET_TOKEN(res);

        // get user info
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null;
      // get system curd
      //await useEps();
      // get user info
      const userInfo = await this.getUserInfoAction();
      console.log('afterLoginAction', userInfo);

      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          routes.forEach((route) => {
            //console.log(route.name, route.path, route?.redirect, route?.children);
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
        }
        goHome && (await router.push(userInfo?.homePath || PageEnum.BASE_HOME));
      }
      return userInfo;
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      const userInfo = await service.sys.comm.getUserInfo();
      const { roles = [] } = userInfo;
      if (isArray(roles)) {
        //const roleList = roles.map((item) => item.value) as RoleEnum[];
        this.setRoleList(roles);
      } else {
        userInfo.roles = [];
        this.setRoleList([]);
      }
      this.setUserInfo(userInfo);
      return userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await service.sys.comm.logout();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      this.setRoleList([]);
      this.resetState();
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },

    // 刷新标识
    async refreshToken(): Promise<string> {
      return new Promise((resolve, reject) => {
        //appStore.service.base.open
        service.sys.open
          .refreshToken(storage.get('refreshToken'))
          .then((res) => {
            this.SET_TOKEN(res);
            resolve(res.token);
          })
          .catch((err) => {
            this.logout(true);
            reject(err);
          });
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
