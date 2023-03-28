<template>
  <fs-crud ref="crudRef" v-bind="crudBinding" />
</template>

<script>
  import { defineComponent, ref, onMounted } from 'vue';
  import { useExpose, useCrud, dict, compute } from '@fast-crud/fast-crud';
  import { useCode } from '/@/geek/index';
  //import createCrudOptions from './crud';
  //import { shallowRef } from 'vue';

  function createCrudOptions({ expose, service }) {
    const curdApi = service.sys.dict;
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
          code: { title: '编码\r\n一颗树仅仅有一个统一的编码', type: 'text', key: 'code' },
          name: { title: '名称', type: 'text', key: 'name' },
          description: {
            title: '描述',
            key: 'description',
            type: ['textarea', 'rows'],
            form: { rules: [{ required: true, message: '此项必填' }] },
          },
          status: { title: '状态', key: 'status', dict: { data: [] }, type: 'dict-radio' },
          readonly: { title: '内置角色', type: 'text', key: 'readonly' },
          orderNum: {
            title: '排序',
            type: 'text',
            key: 'orderNum',
            form: { component: { name: 'a-input-number', min: 0, vModel: 'modelValue' } },
          },
          userId: { title: '创建人id', type: 'text', key: 'userId' },
          createTime: {
            title: '创建时间',
            key: 'createTime',
            type: 'a-date-picker',
            props: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
          },
          updateTime: {
            title: '更新时间',
            key: 'updateTime',
            type: 'a-date-picker',
            props: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
          },
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
