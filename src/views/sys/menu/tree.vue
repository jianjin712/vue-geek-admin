<template>
  <fs-page>
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_label="scope">
        <a-space>
          <Icon :icon="scope.row.icon" v-if="scope.row.icon" />
          <Icon icon="ant-design:function-outlined" v-else />
          <span :class="!scope.row.status ? 'text-gray-500' : ''">{{ scope.row.label }}</span>
        </a-space>
      </template>

      <!-- <template #actionbar-left>
        <fs-button type="danger">actionbar-left插槽</fs-button>
      </template>
      <template #actionbar-right>
        <fs-button type="danger">actionbar-right插槽</fs-button>
      </template>

      <template #actionbar--left>
        <a-tooltip title="批量删除">
          <fs-button type="danger" icon="DeleteOutlined" @click="handleBatchDelete" />
        </a-tooltip>
      </template> -->

      <!-- <template #actionbar--right>
        <a-tooltip title="创建功能模块">
          <fs-button icon="ant-design:appstore-add-outlined" @click="openFormModule" />
          <fs-form-wrapper title="快速创建模块" ref="moduleRef" v-bind="moduleFormOptions" />
        </a-tooltip>
      </template> -->
      <fs-form-wrapper title="快速创建模块" ref="moduleRef" v-bind="moduleFormOptions" />
    </fs-crud>
  </fs-page>
</template>

<script>
  import { defineComponent, ref, onMounted } from 'vue';
  import { useExpose, useCrud } from '@fast-crud/fast-crud';
  import { Icon } from '/@/components/Icon';
  //import { useAppStore } from '/@/store/modules/app';
  import * as _ from 'lodash-es';
  import { useCode } from '/@/geek/index';
  import storage from '/@/utils/storage';
  import createCrudOptions from './tree';

  export default defineComponent({
    name: 'MenuTree',
    components: {
      Icon,
    },
    setup() {
      // crud组件的ref
      const crudRef = ref();
      // crud 配置的ref
      const crudBinding = ref();
      const { service } = useCode();
      const { expose } = useExpose({ crudRef, crudBinding });
      expose._eps = storage.get('eps');
      expose.eps = {
        entities: [],
        api: [],
        path: [],
      };

      for (const i in expose._eps) {
        expose._eps[i].forEach((e) => {
          if (e.columns.length == 0 || i == undefined || _.isEmpty(e.name)) {
            return;
          }

          expose.eps.entities.push({
            label: e.name,
            value: e.name,
            key: e.name,
          });

          const permission = e.prefix.replace('/admin/', '').split('/');
          expose.eps.path[e.name] = e.prefix.replace('/admin/', '/');
          expose.eps.api[e.name] = e.api.map((k) => {
            return {
              label: k.summary,
              value: k.summary + '|' + permission.join(':') + k.path.replace('/', ':'),
              key: e.prefix,
            };
          });
          //}
        });
      }
      //console.log(expose.eps.api);

      // 你的crud配置
      const { crudOptions, selectedRowKeys, moduleRef, openFormModule, moduleFormOptions } =
        createCrudOptions({
          expose,
          service,
        });

      // 初始化crud配置
      // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
      //const { resetCrudOptions } = useCrud({ expose, crudOptions });
      // 初始化crud配置
      useCrud({ expose, crudOptions, permission: 'sys:menu' });
      // 你可以调用此方法，重新初始化crud配置
      //resetCrudOptions(crudOptions);

      //const { moduleRef, openFormModule, moduleFormOptions } = useModuleForm(service, expose._eps);

      // 页面打开后获取列表数据
      onMounted(() => {
        expose.doRefresh();
        //console.log('expose', expose);
        //console.log('crudOptions');
      });

      //console.log(rules);

      return {
        crudBinding,
        crudRef,
        moduleRef,
        openFormModule,
        moduleFormOptions,
      };
    },
  });
</script>
