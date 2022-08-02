<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="分配权限"
    width="1000px"
    @ok="handleSubmit"
  >
    <a-row class="row-res">
      <a-col :span="8">
        <BasicTree
          title="权限菜单"
          search
          checkable
          checkStrictly
          :checkedKeys="checkedKeys"
          @check="onTreeNodeCheck"
          ref="permissionTreeRef"
          :treeData="permissionTreeData"
          :fieldNames="{ key: 'id', title: 'label', children: 'children' }"
          @select="handleSelect"
        />
      </a-col>
      <a-col :span="14">
        <BasicTable @register="registerTable" @selection-change="onTableSelectChange" />
      </a-col>
    </a-row>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref, unref, inject } from 'vue';
  import { BasicTree, TreeActionType } from '/@/components/Tree';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getBasicColumns } from './tableData';
  // import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'DistributionUser',
    components: { BasicModal, BasicTree, BasicTable },
    setup() {
      // const { notification } = useMessage();
      const tableButtons = ref();
      const menuIds = ref([...new Set()] as unknown as any[]);
      const modelRef = ref({});
      const permissionTreeRef = ref<Nullable<TreeActionType>>(null);
      const roleIdRef = ref();
      const permissionTreeData = ref();
      const checkedKeys = ref();
      const dataSource = ref();
      const service: any = inject('service');
      const [register, { closeModal }] = useModalInner(async (roleId) => {
        checkedKeys.value = [];
        roleIdRef.value = roleId;

        await service.sys.comm.getMenuPermis().then((ret: any) => {
          permissionTreeData.value = ret.menuTreeList;
          console.log(permissionTreeData.value);
          setTimeout(() => {
            getTree().filterByLevel(2);
          }, 0);
        });
        await service.sys.comm.permissions({ roleId }).then((res) => {
          const data = res;
          menuIds.value = data.resIdList;
          tableButtons.value = data.buttons;
          setSelectedRowKeys(menuIds.value);
          checkedKeys.value = data.buttons
            ?.filter((item) => !(item.type == 2))
            .filter((item) => menuIds.value.includes(item.id))
            .map((item) => item.id);
        });
      });

      // 选中名称高亮的事件
      function handleSelect(keys, event) {
        console.log(event);
        console.log(tableButtons.value);
        if (!event.selected) {
          return;
        }
        let filterTable = tableButtons.value.filter(
          (item) => item.type == 2 && item.parentId == keys[0]
        );
        if (filterTable && filterTable.length > 0) {
          dataSource.value = filterTable;
        } else {
          dataSource.value = [];
        }
      }

      function onTreeNodeCheck(keys, event) {
        //console.log(keys, event, checkedKeys.value);
        if (!event.checked) {
          setSelectedRowKeys([]);
          checkedKeys.value = checkedKeys.value.filter((item) => item != event.node.eventKey);
          const tableRowIds = getDataSource().map((item) => item.id);
          menuIds.value = menuIds.value.filter(
            (item) => item != event.node.eventKey && !tableRowIds.includes(item)
          );
        } else {
          checkedKeys.value = [
            ...new Set(
              checkedKeys.value.filter((item) => item != event.node.eventKey).concat(keys.checked)
            ),
          ];
        }
      }
      async function handleSubmit() {
        const data = [...new Set(menuIds.value.concat(checkedKeys.value))];
        //api.DistributionRoleAuthority({ roleId: roleIdRef.value, resIds: data }).then(() => {
        service.sys.role.update({ id: roleIdRef.value, menuIdsList: data }).then(() => {
          // console.log(res);
          // notification.success({
          //   message: '权限分配成功',
          //   duration: 3,
          // });
          closeModal();
        });
      }
      const [registerTable, { getDataSource, /* getSelectRows, */ setSelectedRowKeys }] = useTable({
        canResize: false,
        size: 'small',
        showIndexColumn: false,
        dataSource: dataSource,
        columns: getBasicColumns(),
        rowKey: 'id',
        showTableSetting: true,
        rowSelection: {
          type: 'checkbox',
        },
        onColumnsChange: (data) => {
          console.log('ColumnsChanged', data);
        },
      });

      function onTableSelectChange({ keys, rows }) {
        const tableRowIds = getDataSource().map((item) => item.id);
        if (rows && rows.length > 0) {
          checkedKeys.value = checkedKeys.value.concat(
            ...new Set(rows.map((item) => item.parentId))
          );
          menuIds.value = menuIds.value.filter((item) => !tableRowIds.includes(item)).concat(keys);
        } else {
          menuIds.value = menuIds.value.filter((item) => !tableRowIds.includes(item));
        }
        menuIds.value = [...new Set(menuIds.value)];
        checkedKeys.value = [...new Set(checkedKeys.value)];
      }

      function getTree() {
        const tree = unref(permissionTreeRef);
        if (!tree) {
          throw new Error('tree is null!');
        }
        return tree;
      }

      return {
        onTableSelectChange,
        permissionTreeRef,
        permissionTreeData,
        columns: getBasicColumns(),
        tableButtons,
        checkedKeys,
        onTreeNodeCheck,
        handleSelect,
        handleSubmit,
        register,
        closeModal,
        model: modelRef,
        registerTable,
      };
    },
  });
</script>

<style lang="less">
  .row-res {
    min-height: 500px;
  }
</style>
