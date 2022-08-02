<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="绑定用户"
    width="1000px"
    @ok="handleSubmit"
  >
    <a-transfer
      :titles="[', 未授权账户', ', 待授权账户']"
      :dataSource="userRoleDetails"
      :targetKeys="targetKeys"
      :showSearch="showSearch"
      :filterOption="
        (inputValue, item) =>
          item.nickName.indexOf(inputValue) != -1 || item.username.indexOf(inputValue) != -1
      "
      :showSelectAll="false"
      @change="onChange"
    >
      <template
        #children="{ direction, filteredItems, selectedKeys, onItemSelectAll, onItemSelect }"
      >
        <a-table
          :row-selection="getRowSelection({ selectedKeys, onItemSelectAll, onItemSelect })"
          :columns="direction === 'left' ? leftColumns : rightColumns"
          :data-source="filteredItems"
          size="small"
        />
      </template>
    </a-transfer>
  </BasicModal>
</template>

<script>
  import { difference } from 'lodash-es';
  import { defineComponent, ref, inject } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  const tableColumns = [
    { dataIndex: 'id', title: 'ID' },
    { dataIndex: 'nickName', title: '名称' },
    { dataIndex: 'username', title: '账号' },
  ];

  export default defineComponent({
    name: 'DistributionUser',
    components: { BasicModal },
    setup() {
      const modelRef = ref({});
      const showSearch = ref(true);
      const leftColumns = ref(tableColumns);
      const rightColumns = ref(tableColumns);
      const userRoleDetails = ref([]);
      const targetKeys = ref([]);
      const service = inject('service');

      const [register, { closeModal }] = useModalInner((data) => {
        /*
        "data": {
          "userRoleDetails": [
              {
                  "id": 1,
                  "nickName": "长风一梦8888",
                  "username": "admin"
              },
              {
                  "id": 10,
                  "nickName": "测试账号",
                  "username": "test001"
              }
          ],
          "originTargetKeys": [
              2,
              10
          ]
        }
      */
        modelRef.value = {
          roleId: data.roleId,
          userRoleDetails: data.userRoleDetails,
          originTargetKeys: data.originTargetKeys,
        };
        userRoleDetails.value = data.userRoleDetails?.map((item) => {
          return { key: String(item.id), title: item.nickName, ...item };
        });
        targetKeys.value = data.originTargetKeys?.map((key) => key.toString());
      });

      const onChange = (nextTargetKeys) => {
        console.log(nextTargetKeys);
        targetKeys.value = nextTargetKeys;
      };

      const getRowSelection = ({ selectedKeys, onItemSelectAll, onItemSelect }) => {
        return {
          onSelectAll(selected, selectedRows) {
            const treeSelectedKeys = selectedRows.map(({ key }) => key);
            const diffKeys = selected
              ? difference(treeSelectedKeys, selectedKeys)
              : difference(selectedKeys, treeSelectedKeys);
            onItemSelectAll(diffKeys, selected);
          },
          onSelect({ key }, selected) {
            onItemSelect(key, selected);
          },
          selectedRowKeys: selectedKeys,
        };
      };
      async function handleSubmit() {
        service.sys.role.saveUserRole({
          roleId: modelRef.value.roleId,
          userIdList: targetKeys.value,
        });
        closeModal();
      }

      return {
        userRoleDetails,
        targetKeys,
        showSearch,
        leftColumns,
        rightColumns,
        handleSubmit,
        onChange,
        getRowSelection,
        register,
        closeModal,
        model: modelRef,
      };
    },
  });
</script>
