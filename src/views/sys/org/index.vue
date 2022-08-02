<template>
  <PageWrapper contentClass="flex">
    <a-row>
      <a-col span="6" class="lg:mr-5">
        <a-card>
          <BasicTree
            title="组织架构"
            search
            toolbar
            checkStrictly
            ref="treeRef"
            :clickRowToExpand="false"
            :treeData="treeData"
            :showLine="true"
            :fieldNames="{ key: 'id', title: 'label' }"
            @select="handleSelect"
            :actionList="actionList"
          />
        </a-card>
      </a-col>

      <!-- :bordered="false"
    :tabList="tabListNoTitle"
      :activeTabKey="noTitleKey"
      @tabChange="(key) => onTabChange(key)"
    -->
      <a-col span="17">
        <a-card
          :activeTabKey="noTitleKey"
          :tabList="tabListNoTitle"
          tabType="editable-card"
          @tabChange="(key) => onTabChange(key)"
        >
          <template #customTab="item">
            <span v-if="item.key === 'add'">{{ item.tab }} <plus-outlined /></span>
            <span v-else-if="item.key === noTitleKey">{{ item.tab }} <edit-outlined /></span>
          </template>
          <BasicForm @register="register" ref="formRef" />
        </a-card>
      </a-col>
    </a-row>
  </PageWrapper>
</template>

<script>
  import { defineComponent, onMounted, ref, unref, h, inject } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicTree } from '/@/components/Tree/index';
  import { PageWrapper } from '/@/components/Page';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { schemas } from './data';
  import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    name: 'OrgForm',
    components: { BasicForm, BasicTree, PageWrapper },
    setup() {
      const { /*  notification, */ createConfirm } = useMessage();
      const actionList = ref([]);
      const treeRef = ref({});
      const formRef = ref({});
      const treeData = ref();
      const formTitle = ref('新增根节点');
      // 当前节点
      const CurrentNode = ref({});
      const service = inject('service');
      const curdApi = service.sys.org;
      const [register, { getFieldsValue, setFieldsValue, resetFields, validate, setProps }] =
        useForm({
          // labelCol: {
          //   span: 4,
          // },
          // wrapperCol: {
          //   span: 20,
          // },
          labelWidth: 100,
          baseColProps: { lg: 12, md: 24 },
          schemas: schemas,
          actionColOptions: {
            offset: 20,
          },
          showResetButton: false,
          submitButtonOptions: {
            style: { width: '120px' },
            text: ' 提 交 ',
          },
          submitFunc: customSubmitFunc,
        });

      async function customSubmitFunc() {
        try {
          await validate();
          await setProps({ submitButtonOptions: { loading: true } });
          await SaveOrUpdate(getFieldsValue()).then(() => {
            //notification.success({ message: '操作成功', duration: 3 });
            loadOrgList();
            setProps({ submitButtonOptions: { loading: false } });
            if (!getFieldsValue().id) {
              resetFields();
            } else {
            }
            //loadOrgList();
          });
        } catch (error) {
          setProps({ submitButtonOptions: { loading: false } });
        }
      }

      async function SaveOrUpdate(form) {
        if (form.id) {
          return await curdApi.update({ ...form });
        } else {
          return await curdApi.add(form);
        }
      }

      onMounted(() => {
        loadOrgList();
      });

      function handlePlus(node) {
        resetFields();
        setFieldsValue({ parentId: node.id });
      }
      function handleDelete(node) {
        console.log(node);
        createConfirm({
          iconType: 'warning',
          title: '确认',
          content: `确定删除 ${node.name} ？ 同时会级联删除子节点以及相关资源数据`,
          onOk: async () => {
            await curdApi.delete({ ids: [node.id] }).then(() => {
              // notification.success({
              //   message: ret.message,
              //   duration: 3,
              // });
              loadOrgList();
            });
          },
        });
      }

      function loadOrgList() {
        curdApi.tree().then((ret) => {
          treeData.value = ret;
          setTimeout(() => {
            getTree().filterByLevel(2);
            actionList.value = [
              {
                render: (node) => {
                  return h(PlusOutlined, {
                    class: 'ml-2',
                    onClick: (e) => {
                      handlePlus(node);
                      e.stopPropagation();
                    },
                  });
                },
              },
              {
                render: (node) => {
                  return h(DeleteOutlined, {
                    class: 'ml-2',
                    onClick: (e) => {
                      handleDelete(node);
                      e.stopPropagation();
                    },
                  });
                },
              },
            ];
          }, 0);
        });
      }

      function handleSelect(checkedKeys, event) {
        console.log(checkedKeys, event);
        if (!event.selected) {
          return;
        }
        CurrentNode.value = event.selectedNodes[0];
        CurrentNode.value.label = formTitle.value = CurrentNode.value.name;
        onTabChange('edit', CurrentNode.value);
        // setFieldsValue({
        //   ...CurrentNode.value,
        // });
      }
      function getTree() {
        const tree = unref(treeRef);
        if (!tree) {
          throw new Error('tree is null!');
        }
        return tree;
      }

      const tabListNoTitle = ref([
        {
          key: 'add',
          tab: '新增根节点',
          //closable: false,
        },
      ]);
      const noTitleKey = ref('add');
      const editNode = ref([]);
      const onTabChange = (tab, node = {}) => {
        //console.log(tab);
        if (tab == 'add') {
          //tabListNoTitle.value = unref(tabListNoTitle).filter((item) => item.key == 'add');
          resetFields();
          setFieldsValue({ parentId: 0 });
          noTitleKey.value = 'add';
        } else if (tab === 'edit') {
          const index = `${node.id}`;
          // const tablsit = unref(tabListNoTitle).filter((row) => row.key !== index);
          // console.log(tablsit);

          editNode.value[index] = node;
          //.value.push({ ...node });

          let tablist = [
            {
              key: 'add',
              tab: '新增根节点',
              //closable: false,
            },
          ];
          unref(editNode).forEach((item) => {
            tablist.push({ key: `${item.id}`, tab: item.name });
          });
          tabListNoTitle.value = tablist;
          noTitleKey.value = index;
          setFieldsValue({ ...node });
        } else {
          noTitleKey.value = tab;
          // console.log(tab, editNode.value[tab]);
          CurrentNode.value = editNode.value[tab];
          //console.log(CurrentNode.value);
          setFieldsValue({ ...CurrentNode.value });
        }
        //console.log(noTitleKey.value, editNode, tabListNoTitle.value);
      };
      return {
        formRef,
        editNode,
        noTitleKey,
        onTabChange,
        tabListNoTitle,
        formTitle,
        CurrentNode,
        register,
        treeData,
        treeRef,
        actionList,
        resetFields,
        handleSelect,
        handlePlus,
      };
    },
  });
</script>

<style lang="less">
  .menu {
    .ant-card-body {
      padding: 10px;
    }
  }

  .menu-button-table {
    margin-left: 10px;

    .fs-container {
      padding-right: 5px;
    }

    .ant-card-body {
      padding: 10px;
    }
  }
</style>
