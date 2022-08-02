import { RequestOptions } from '/#/axios';
//import { BaseService, Service } from '/@/hooks/core/service';
import { BaseService, Service } from '/@/geek/service/base';

@Service('base/open')
class BaseOpen extends BaseService {
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
        params: {
          refreshToken: token,
        },
      },
      options
    );
  }
}

export default BaseOpen;
