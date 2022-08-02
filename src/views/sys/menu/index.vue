<template>
  <PageWrapper class="fixed">
    <!--  
     w-1/4 -->
    <a-row :gutter="[16, { xs: 16, sm: 16, md: 24, lg: 32 }]" justify="space-between">
      <a-col :xs="24" :sm="24" :md="6" :lg="5" :xl="5">
        <a-card class="menu">
          <template #title>
            <a-space>
              权限菜单
              <a-tooltip>
                <PlusOutlined @click="handlePlus" />
                <template #title>新增根节点，作为顶级导航菜单</template>
              </a-tooltip>
            </a-space>
          </template>
          <BasicTree
            search
            toolbar
            checkStrictly
            _showLine
            @check="onTreeNodeCheck"
            ref="treeRef"
            :treeData="treeData"
            :fieldNames="{ key: 'id', title: 'name' }"
            @select="handleSelect"
            :actionList="actionList"
          />
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="24" :md="12" :lg="10" :xl="10">
        <a-card title="菜单信息" class="menu">
          <!-- <BasicForm @register="register" /> -->
          <fs-form ref="formRef" v-bind="formOptions" />
          <div style="margin-top: 10px">
            <a-button v-if="formRef" @click="formRef.submit" type="primary">提交表单</a-button>
            <!-- <a-button class="ml-10" @click="setFormData">setFormData</a-button> -->
          </div>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="24" :md="8" :lg="9" :xl="9">
        <a-card title="资源信息" class="menu-button-table">
          <fs-crud ref="crudRef" v-bind="crudBinding" />
        </a-card>
      </a-col>
    </a-row>
  </PageWrapper>
</template>

<script>
  import { defineComponent, onMounted, ref, unref, h, inject } from 'vue';
  //import { BasicForm, useForm } from '/@/components/Form';
  import { BasicTree } from '/@/components/Tree/index';
  import { PageWrapper } from '/@/components/Page';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useAppStore } from '/@/store/modules/app';
  //import { schemas } from './data';

  import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';

  import createCrudOptions from './crud';

  import { useFormDirect } from './menu';

  import {
    useCrud,
    useExpose /* , useColumns, uiContext, dict, compute */,
  } from '@fast-crud/fast-crud';
  import { isUndefined, isEmpty } from 'lodash-es';
  //import { IconPicker } from '/@/components/Icon';

  export default defineComponent({
    name: 'MenuForm',
    components: { /* BasicForm, */ BasicTree, PageWrapper, PlusOutlined },
    setup() {
      const { /* notification, */ createConfirm } = useMessage();
      const actionList = ref([]);
      const treeRef = ref({});
      const treeData = ref();
      const appStore = useAppStore();
      const eps = appStore.getEps;
      const service = inject('service');
      const curdApi = service.sys.menu;

      const nodeRef = ref();
      // crud组件的ref
      const crudRef = ref();
      // crud 配置的ref
      const crudBinding = ref();
      // 暴露的方法
      const { expose } = useExpose({ crudRef, crudBinding });

      expose.eps = {
        entities: [],
        api: [],
        path: [],
      };
      for (const i in eps) {
        eps[i].forEach((e) => {
          if (e.columns.length == 0 || i == undefined || isEmpty(e.name)) {
            return;
          }
          expose.eps.entities.push({
            //label: `${e.name}（${e.prefix}）`,
            label: e.name,
            value: e.name,
            key: e.name,
            // filename: last(e.prefix.split('/')),
            // ...e,
          });
          const permission = e.prefix.replace('/admin/', '').split('/');
          expose.eps.path[e.name] = e.prefix.replace('/admin/', '/');
          expose.eps.api[e.name] = e.api.map((k) => {
            return {
              label: k.summary,
              value: k.summary + '|' + permission.join(':') + k.path.replace('/', ':'),
              key: e.prefix,
            };
          });
          //}
        });
      }

      // 你的crud配置
      const { crudOptions } = createCrudOptions({ expose, nodeRef, curdApi });
      // 初始化crud配置
      useCrud({ expose, crudOptions, permission: 'sys:menu' });

      const { setFormData, setFormAdd, formRef, formOptions, formSubmit } = useFormDirect(expose);
      formOptions.value.doSubmit = async ({ form }) => {
        await SaveOrUpdate(form).then(() => {
          expose.doRefresh();
        });
      };

      async function SaveOrUpdate(form) {
        if (!isUndefined(form.id)) {
          //console.log('editForm', form);
          return await curdApi.update({ ...form });
        } else {
          delete form.id;
          //console.log('addForm', form);
          return await curdApi.add(form);
        }
      }

      onMounted(() => {
        // console.log('==== eps ====');
        // console.log(eps);
        //console.log('==== expose.eps.entities ====');
        //console.log(_expose.eps.entities);
        setFormAdd();
        loadMenu();
      });

      function handlePlus(node) {
        setFormAdd(node);
      }

      function handleDelete(node) {
        createConfirm({
          iconType: 'warning',
          title: '确认',
          content: `确定删除 ${node.label} ？ 同时会级联删除子节点以及相关资源数据`,
          onOk: async () => {
            await curdApi.delete(node.id).then(() => {
              loadMenu();
            });
          },
        });
      }

      async function loadMenu() {
        await service.sys.comm.getMenuPermis().then((data) => {
          //const data = res.data;
          //console.log('data.menuTreeList', data.menuTreeList);
          treeData.value = data.menuTreeList;
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
        if (!event.selected) {
          return;
        }
        nodeRef.value = event.selectedNodes[0];

        //console.log('table data entities', getEpsNode());
        crudBinding.value.actionbar.buttons.add.show = true;
        crudBinding.value.toolbar.buttons.refresh.show = true;
        //setFieldsValue({ ...nodeRef.value });
        setFormData({ ...nodeRef.value });
        //formRef.value.setFormData(nodeRef.value);
        expose.doRefresh();
      }

      function onTreeNodeCheck(keys, event) {
        console.log('keys event', keys, event);
        if (!event.checked) {
        } else {
        }
      }

      function getTree() {
        const tree = unref(treeRef);
        if (!tree) {
          throw new Error('tree is null!');
        }
        return tree;
      }

      return {
        nodeRef,
        crudBinding,
        crudRef,
        // register,
        // resetFields,
        treeData,
        treeRef,
        actionList,

        handleSelect,
        onTreeNodeCheck,
        handlePlus,

        formRef,
        setFormData,
        formOptions,
        formSubmit,
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
    // margin-left: 10px;
    // .fs-container {
    //   padding-right: 5px;
    // }

    .ant-card-body {
      padding: 10px;
    }
  }
</style>
