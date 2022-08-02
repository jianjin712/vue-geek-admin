<template>
  <fs-crud ref="crudRef" v-bind="crudBinding" class="min-h-36">
    <!-- <template #form_orgIdsList="scope">
        <BasicTree
          v-model:value="scope.form.orgIdsList"
          :treeData="treeData"
          :fieldNames="{ title: 'name', key: 'id' }"
          :checkedKeys="checkedKeys"
          checkable
          toolbar
          v-if="scope.form.scopeType === 20"
          title="组织架构"
          @check="onTreeNodeCheck"
        />
      </template> -->
    <template #cell_description="scope">
      <a-tooltip placement="top" :title="scope.row.description">
        {{ scope.row.description }}
      </a-tooltip>
    </template>
    <distribution-user @register="registerBindUser" />
    <distribution-resource @register="registerBindResource" />
  </fs-crud>
</template>

<script>
  import { defineComponent, ref, onMounted, inject } from 'vue';
  //import { PageWrapper } from '/@/components/Page';
  import createCrudOptions from './crud';
  import { useExpose, useCrud } from '@fast-crud/fast-crud';

  //import { BasicTree } from '/@/components/Tree';
  import { useModal } from '/@/components/Modal';
  import DistributionUser from './DistributionUser.vue';
  import DistributionResource from './DistributionResource.vue';
  // import * as api from './api';

  function useDistribution() {
    const checkedKeys = ref();
    const service = inject('service');
    function userModal(roleId) {
      //api.GetUserByRoleId(roleId)
      service.sys.role.getUserByRoleId({ roleId }).then((data) => {
        openBindUser(true, { roleId, ...data });
      });
    }
    const [registerBindUser, { openModal: openBindUser }] = useModal();

    function resourceModal(roleId) {
      openBindResource(true, roleId);
    }
    const [registerBindResource, { openModal: openBindResource }] = useModal();

    return {
      checkedKeys,
      userModal,
      registerBindUser,
      resourceModal,
      registerBindResource,
    };
  }

  export default defineComponent({
    name: 'SlotsForm',
    components: { DistributionUser, DistributionResource /*PageWrapper  , BasicTree */ },
    setup() {
      // crud组件的服务
      const service = inject('service');

      // crud组件的ref
      const crudRef = ref();
      // crud 配置的ref
      const crudBinding = ref();

      const distribution = useDistribution();
      // 暴露的方法
      const { expose } = useExpose({ crudRef, crudBinding });

      // const go = useGo();
      // 你的crud配置
      const { crudOptions } = createCrudOptions({ expose, distribution, service });
      // 初始化crud配置
      useCrud({ expose, crudOptions, permission: 'sys:role' });

      //const treeData = ref([]);
      // function initOrgList() {
      //   service.base.auth.org.tree().then((response) => {
      //     treeData.value = response.data;
      //   });
      // }

      //function onTreeNodeCheck(keys, event) {
      //if (!event.checked) {
      //setSelectedRowKeys([]);
      //console.log('勾选的组织', keys);
      //console.log('event', event);
      //}
      //   checkedKeys.value = checkedKeys.value.filter((item) => item != event.node.eventKey);
      //   const tableRowIds = getDataSource().map((item) => item.id);
      //   menuIds.value = menuIds.value.filter(
      //     (item) => item != event.node.eventKey && !tableRowIds.includes(item)
      //   );
      // } else {
      //   checkedKeys.value = [
      //     ...new Set(
      //       checkedKeys.value.filter((item) => item != event.node.eventKey).concat(keys.checked)
      //     ),
      //   ];
      // }
      //}

      // 页面打开后获取列表数据
      onMounted(() => {
        //initOrgList();
        expose.doRefresh();
      });

      return {
        //onTreeNodeCheck,
        //treeData,
        crudBinding,
        crudRef,
        ...distribution,
      };
    },
  });
</script>
