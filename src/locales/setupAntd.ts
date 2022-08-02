//import 'ant-design-vue/es/style';
import type { App } from 'vue';
import * as Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';
//import ProLayout, { PageContainer } from '@ant-design-vue/pro-layout';
//import '@ant-design-vue/pro-layout/dist/style.less';
const filterList = [
  /* 'AButton', 'AInput', 'ALayout'*/
];
function checkField(obj: object, field: string) {
  return Object.prototype.hasOwnProperty.call(obj, field);
}

let _Init = false;
export function setupAntd(app: App) {
  if (!_Init) {
    // app.use(ProLayout);
    // app.use(PageContainer);
    Object.values(Antd)
      .filter((k) => checkField(k, 'name') && checkField(k, 'install'))
      .filter((k) => !filterList.includes(k?.name))
      .forEach((k) => {
        app.use(k);
      });
    _Init = true;
  }
  return app;
}

export default setupAntd;
