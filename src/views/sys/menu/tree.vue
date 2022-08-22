<template>
  <fs-page>
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_label="scope">
        <Icon :icon="scope.row.icon" v-if="scope.row.icon" />
        <Icon icon="ant-design:function-outlined" v-else />
        {{ scope.row.label }}
      </template>
      <template #actionbar-left>
        <a-tooltip title="批量删除">
          <fs-button icon="DeleteOutlined" @click="handleBatchDelete" />
        </a-tooltip>
      </template>

      <template #actionbar-right>
        <a-tooltip title="创建功能模块">
          <fs-button icon="ant-design:appstore-add-outlined" @click="openFormModule" />
          <fs-form-wrapper title="快速创建模块" ref="moduleRef" v-bind="moduleFormOptions" />
        </a-tooltip>
      </template>
    </fs-crud>
  </fs-page>
</template>

<script>
  import { defineComponent, ref, onMounted } from 'vue';
  import createCrudOptions from './tree';
  import { useExpose, useCrud } from '@fast-crud/fast-crud';
  import { message, Modal } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  //import { useAppStore } from '/@/store/modules/app';
  import * as _ from 'lodash-es';
  import { useCode } from '/@/geek/index';
  import { useModuleForm } from './module';
  import storage from '/@/utils/storage';

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
      const { crudOptions, selectedRowKeys } = createCrudOptions({
        expose,
        service,
      });

      // 初始化crud配置
      // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
      const { resetCrudOptions } = useCrud({ expose, crudOptions });

      // 你可以调用此方法，重新初始化crud配置
      // resetCrudOptions(options)
      const { moduleRef, openFormModule, moduleFormOptions } = useModuleForm(service, expose._eps);

      // 页面打开后获取列表数据
      onMounted(() => {
        expose.doRefresh();
      });

      const handleBatchDelete = () => {
        if (selectedRowKeys.value?.length > 0) {
          Modal.confirm({
            title: '确认',
            content: `确定要批量删除这${selectedRowKeys.value.length}条记录吗`,
            async onOk() {
              await service.sys.menu.delete({ ids: selectedRowKeys.value }).then((res) => {
                if (res.code == 1000) {
                  message.info('删除成功');
                  expose.doRefresh();
                  selectedRowKeys.value = [];
                }
              });
            },
          });
        } else {
          message.error('请先勾选记录');
        }
      };

      return {
        crudBinding,
        crudRef,
        handleBatchDelete,
        moduleRef,
        openFormModule,
        moduleFormOptions,
      };
    },
  });
</script>