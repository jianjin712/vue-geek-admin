<template>
  <fs-page>
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_$expand="{ scope }"> row: {{ scope.row }} </template>
    </fs-crud>
  </fs-page>
</template>

<script>
  import { defineComponent, onMounted, ref, inject } from 'vue';
  import { useExpose, useCrud } from '@fast-crud/fast-crud';
  import createCrudOptions from './task';

  export default defineComponent({
    name: 'Task',
    setup() {
      const crudRef = ref();
      const crudBinding = ref();
      const service = inject('service');

      const { expose } = useExpose({ crudRef, crudBinding });
      // 你的crud配置
      const { crudOptions } = createCrudOptions({ expose, service });
      useCrud({ expose, crudOptions });

      onMounted(() => {
        expose.doRefresh();
      });

      return {
        crudRef,
        crudBinding,
      };
    },
  });
</script>
