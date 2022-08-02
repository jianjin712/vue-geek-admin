// import 'virtual:windi-base.css';
// import 'virtual:windi-components.css';
import '/@/design/index.less';
import 'virtual:windi-utilities.css';

// Register icon sprite
import 'virtual:svg-icons-register';
import App from './App.vue';
// import Antd from 'ant-design-vue';
//import 'ant-design-vue/dist/antd.less';
import { createApp } from 'vue';
import { initAppConfigStore } from '/@/logics/initAppConfig';
import { setupErrorHandle } from '/@/logics/error-handle';
import { router, setupRouter } from '/@/router';
import { setupRouterGuard } from '/@/router/guard';
import { setupStore } from '/@/store';
import { setupGlobDirectives } from '/@/directives';
import { setupI18n } from '/@/locales/setupI18n';
import { setupAntd } from '/@/locales/setupAntd';
//import { registerGlobComp } from '/@/components/registerGlobComp';

if (import.meta.env.MODE === 'development') {
  import('./api/index');
}

import setupFastCrud from './setup-fast-crud';
import './setup-fast-crud.less';

async function bootstrap() {
  const app = createApp(App);

  // Configure store
  setupStore(app);

  // Initialize internal system configuration
  initAppConfigStore(app);

  // Register global components
  // registerGlobComp(app);

  // Multilingual configuration
  // Asynchronous case: language files may be obtained from the server side
  const i18n = await setupI18n(app);

  //----------- 安装fast-crud--------------
  setupFastCrud(app, i18n);

  setupAntd(app);

  //--------------------------------------
  // Configure routing
  setupRouter(app);

  // router-guard
  setupRouterGuard(router);

  // Register global directive
  setupGlobDirectives(app);

  // Configure global error handling
  setupErrorHandle(app);

  // https://next.router.vuejs.org/api/#isready
  await router.isReady();

  app.mount('#app');
}

void bootstrap();
