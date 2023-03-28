<template>
  <fs-page>
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_nickName="scope">
        <a-tooltip placement="top" :title="scope.row.nickName">
          {{ scope.row.nickName }}
        </a-tooltip>
      </template>
    </fs-crud>
  </fs-page>
</template>

<script>
  import { defineComponent, ref, onMounted, inject } from 'vue';
  import createCrudOptions from './crud';
  import { useExpose, useCrud } from '@fast-crud/fast-crud';
  export default defineComponent({
    name: 'BaseAuthAdmin',
    setup() {
      const crudRef = ref();
      const crudBinding = ref();
      const { expose } = useExpose({ crudRef, crudBinding });
      const service = inject('service');
      const curdApi = service;
      const { crudOptions } = createCrudOptions({ expose, curdApi });
      useCrud({ expose, crudOptions, permission: 'sys:admin' });

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
