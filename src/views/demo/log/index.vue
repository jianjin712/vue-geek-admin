<template>
  <fs-crud ref="crudRef" v-bind="crudBinding" />
</template>

<script>
  import { defineComponent, ref, onMounted } from 'vue';
  import { useExpose, useCrud } from '@fast-crud/fast-crud';
  import { useCode } from '/@/geek/index';
  //import createCrudOptions from './crud';
  //import { shallowRef } from 'vue';
  //import { dict, compute } from '@fast-crud/fast-crud';

  function createCrudOptions({ expose, service }) {
    const curdApi = service.base.sys.log;
    return {
      expose,
      crudOptions: {
        request: {
          pageRequest: async (query) => await curdApi.page(query),
          addRequest: async ({ form }) => await curdApi.add(form),
          editRequest: async ({ form }) => await curdApi.update(form),
          delRequest: async ({ row }) => await curdApi.delete({ ids: [row.id] }),
        },
        columns: {
          userId: { title: '用户ID', key: 'userId', component: { name: 'a-input' } },
          action: {
            title: '行为',
            key: 'action',
            form: { required: true },
            component: { name: 'a-input' },
          },
          ip: { title: 'ip', key: 'ip', component: { name: 'a-input' } },
          ipAddr: { title: 'ip地址', key: 'ipAddr', component: { name: 'a-input' } },
          params: { title: '参数', key: 'params', component: { name: 'a-input' } },
        },
      },
    };
  }

  export default defineComponent({
    setup() {
      // crud 配置的ref
      const crudRef = ref();
      const crudBinding = ref();
      const { service } = useCode();
      const { expose } = useExpose({ crudRef, crudBinding });
      // 你的crud配置
      const { crudOptions } = createCrudOptions({ expose, service });
      useCrud({ expose, crudOptions });

      // 页面打开后获取列表数据
      onMounted(() => {
        expose.doRefresh();
      });

      return {
        crudBinding,
        crudRef,
      };
    },
  });
</script>
