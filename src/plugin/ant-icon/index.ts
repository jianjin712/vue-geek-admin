import * as Icons from '@ant-design/icons-vue';
import type { App } from 'vue';
import type { IconType } from '@ant-design/icons-vue/es/components/Icon';

type AllIcon = {
  [key: string]: IconType;
};

export const filterIcons = [
  'default',
  'createFromIconfontCN',
  'getTwoToneColor',
  'setTwoToneColor',
];

export function setupIcon(app: App) {
  const allIcon: AllIcon = Icons as any;
  const IconKey = Object.keys(app._context.components);
  const filterList = Object.assign(IconKey, filterIcons);
  Object.keys(Icons)
    .filter((k) => !filterList.includes(k) && typeof app.component(k) !== 'function')
    .forEach((k) => {
      app.component(k, allIcon[k]);
    });
}

export default {
  install(app) {
    setupIcon(app);
  },
};

// export default setupIcon;
