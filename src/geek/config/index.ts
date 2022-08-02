// 是否开发模式
export const isDev = import.meta.env.MODE === 'development';

// 配置
export const config = {
  baseUrl: '',
  // 项目信息
  app: {
    name: 'Geek-Admin',

    // 菜单
    menu: {
      // 是否分组显示
      isGroup: false,
      // 自定义菜单列表
      list: [],
    },

    // 路由
    router: {
      // 模式
      mode: 'history',
      // 页面
      pages: [],
      // 视图 / 路由下的 children
      views: [],
    },

    // 字体图标库
    iconfont: [],
  },

  // 忽略规则
  ignore: {
    // 不显示请求进度条
    NProgress: ['/sys/info/record'],
    // 页面不需要登录验证
    token: ['/login', '/401', '/403', '/404', '/500', '/502'],
  },

  // 调试
  test: {
    token: '',
    mock: false,
    eps: true,
  },

  // 当前环境
  //...(isDev ? dev : prod),
};

export * from './proxy';
