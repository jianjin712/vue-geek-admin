<template>
  <PageWrapper>
    <a-row :gutter="[16, { xs: 16, sm: 16, md: 24, lg: 32 }]" justify="space-between">
      <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
        <a-card :bordered="false" title="组织架构">
          <BasicTree
            search
            checkStrictly
            showLine
            toolbar
            @check="onTreeNodeCheck"
            :clickRowToExpand="false"
            ref="terrDataRef"
            :treeData="terrData"
            :fieldNames="{ key: 'id', title: 'name' }"
            @select="handleSelect"
          />
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="24" :md="12" :lg="18" :xl="18">
        <a-card :bordered="false" title="岗位列表">
          <fs-crud ref="crudRef" v-bind="crudBinding" />
        </a-card>
      </a-col>
    </a-row>
  </PageWrapper>
</template>

<script>
  import { defineComponent, ref, onMounted, unref, inject } from 'vue';
  import createCrudOptions from './crud';
  import { useExpose, useCrud } from '@fast-crud/fast-crud';
  import { BasicTree } from '/@/components/Tree';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    name: 'StationForm',
    components: { BasicTree, PageWrapper },
    setup() {
      const terrDataRef = ref({});
      const terrData = ref();
      const nodeRef = ref();

      const crudRef = ref();
      const crudBinding = ref();
      const service = inject('service');
      const { expose } = useExpose({ crudRef, crudBinding });
      const curdApi = service.sys.station;
      const { crudOptions } = createCrudOptions({ expose, nodeRef, curdApi });
      useCrud({ expose, crudOptions, permission: 'sys:station' });

      // 页面打开后获取列表数据
      onMounted(() => {
        loadOrgList();
        expose.doRefresh();
      });

      async function loadOrgList() {
        await service.sys.org.tree().then((ret) => {
          terrData.value = ret;
          setTimeout(() => {
            getTree().filterByLevel(2);
          }, 0);
        });
      }

      function handleSelect(checkedKeys, event) {
        if (!event.selected) {
          return;
        }
        nodeRef.value = event.selectedNodes[0];
        expose.doRefresh();
      }
      function onTreeNodeCheck(keys, event) {
        console.log('keys event', keys, event);
        if (!event.checked) {
        } else {
        }
      }
      function getTree() {
        const tree = unref(terrDataRef);
        if (!tree) {
          throw new Error('tree is null!');
        }
        return tree;
      }
      return {
        terrDataRef,
        terrData,
        crudBinding,
        crudRef,
        handleSelect,
        onTreeNodeCheck,
      };
    },
  });
</script>

<style lang="less">
  .station {
    margin-left: 10px;
    min-height: 1020px;

    .footer {
      .fs-crud-footer {
        padding: 20px 0;
      }
    }

    .fs-toolbar {
      margin-right: 10px;
    }

    .ant-card-body {
      margin-top: -12px;
    }
  }
</style>
