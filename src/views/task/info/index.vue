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
    const curdApi = service.task.info;
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
          jobId: { title: '任务ID', key: 'jobId', component: { name: 'a-input' } },
          repeatConf: { title: '任务配置', key: 'repeatConf', component: { name: 'a-input' } },
          name: {
            title: '名称',
            key: 'name',
            form: { required: true },
            component: { name: 'a-input' },
          },
          cron: { title: 'cron', key: 'cron', component: { name: 'a-input' } },
          limit: {
            title: '最大执行次数 不传为无限次',
            key: 'limit',
            //component: { name: 'a-input' },
          },
          every: {
            title: '每间隔多少毫秒执行一次 如果cron设置了 这项设置就无效',
            key: 'every',
            //component: { name: 'a-input' },
          },
          remark: {
            title: '备注',
            key: 'remark',
            component: { name: 'el-input', props: { type: 'textarea', rows: 4 } },
          },
          status: {
            title: '状态 0:停止 1：运行',
            key: 'status',
            component: { name: 'dict-switch' },
            form: { required: true },
          },
          startDate: {
            title: '开始时间',
            key: 'startDate',
            component: {
              name: 'a-date-picker',
              props: { type: 'date', valueFormat: 'YYYY-MM-DD' },
            },
          },
          data: { title: '数据', key: 'data', component: { name: 'a-input' } },
          service: { title: '执行的service实例ID', key: 'service', component: { name: 'a-input' } },
          type: {
            title: '状态 0:系统 1：用户',
            key: 'type',
            form: { required: true },
            component: { name: 'a-input' },
          },
          nextRunTime: {
            title: '下一次执行时间',
            key: 'nextRunTime',
            component: {
              name: 'el-date-picker',
              props: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
            },
          },
          taskType: {
            title: '状态 0:cron 1：时间间隔',
            key: 'taskType',
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
