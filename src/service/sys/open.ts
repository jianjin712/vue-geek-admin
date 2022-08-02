import { isObject } from 'lodash-es';
import { RequestOptions } from '/#/axios';
//import { BaseService, Service } from '/@/hooks/core/service';
import { BaseService, Service } from '/@/geek/service/base';

@Service('sys/open')
class SysOpen extends BaseService {
  /**
   * 用户登录
   *
   * @param {*} { username, password, captchaId, verifyCode }
   * @returns
   * @memberof CommonService
   */
  userLogin({ username, password, captchaId, verifyCode }: any, options?: RequestOptions) {
    return this.request(
      {
        url: '/login',
        method: 'POST',
        data: {
          username,
          password,
          captchaId,
          verifyCode,
        },
      },
      options
    );
  }

  /**
   * 图片验证码 svg
   *
   * @param {*} { height, width }
   * @returns
   * @memberof CommonService
   */
  captcha({ height, width }: any, options?: RequestOptions) {
    return this.request(
      {
        url: '/captcha',
        method: 'get',
        params: {
          height,
          width,
        },
      },
      options
    );
  }

  /**
   * 刷新 token
   * @param {string} token
   */
  refreshToken(token: string, options?: RequestOptions) {
    return this.request(
      {
        url: '/refreshToken',
        method: 'get',
        params: {
          refreshToken: token,
        },
      },
      options
    );
  }

  getDictCode(str: any, options?: RequestOptions) {
    const data = isObject(str) ? str : { code: str };
    return this.request(
      {
        url: '/getDictCode',
        method: 'get',
        params: data,
      },
      options
    );
  }

  /**
   * 接口
   */
  eps() {
    return this.request({
      url: '/eps',
    });
  }
}

export default SysOpen;
