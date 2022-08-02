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
    const curdApi = service.demo.goods;
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
          title: {
            title: '标题',
            key: 'title',
            form: { required: true },
            component: { name: 'a-input' },
          },
          pic: {
            title: '图片',
            key: 'pic',
            component: { name: 'cl-upload' },
            form: { required: true },
          },
          price: {
            title: '价格',
            key: 'price',
            component: { name: 'el-input-number', props: { min: 0 } },
            form: { required: true },
          },
          type: {
            title: '分类',
            key: 'type',
            form: { required: true },
            component: { name: 'a-input' },
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
