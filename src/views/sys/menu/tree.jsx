import { ref, shallowRef, unref } from 'vue';
import { dict, compute, uiContext, useColumns, useExpose } from '@fast-crud/fast-crud';
import { deepTree, filterData } from '/@/utils';
import { IconPicker } from '/@/components/Icon';
import ClMenuPerms from './components/perms.vue';
import { useTabs } from '/@/hooks/web/useTabs';
import { usePermission } from '/@/hooks/web/usePermission';
import { message, Modal } from 'ant-design-vue';
import * as _ from 'lodash-es';
import { isDevMode } from '/@/utils/env';

export default function ({ expose, service }) {
  const curdApi = service.sys.menu;
  const ui = uiContext.get();
  const { refreshMenu, hasPermission } = usePermission();
  const { refreshPage } = useTabs();
  //const { getFormWrapperRef } = expose;

  const moduleRef = ref();
  const moduleFormOptions = ref();
  // 暴露的方法

  const useExpos = useExpose({ crudRef: moduleRef, crudBinding: moduleFormOptions });
  useExpos.expose._eps = expose._eps;
  moduleFormOptions.value = createFormOptions(service, useExpos.expose);
  function openFormModule() {
    moduleRef.value.open(moduleFormOptions.value);
  }
  // return {
  //   moduleRef,
  //   openFormModule,
  //   moduleFormOptions,
  // };

  const handleBatchDelete = () => {
    if (selectedRowKeys.value?.length > 0) {
      Modal.confirm({
        title: '确认',
        content: `确定要批量删除这${selectedRowKeys.value.length}条记录吗`,
        async onOk() {
          await service.sys.menu.delete({ ids: selectedRowKeys.value }).then((res) => {
            if (res.code == 1000) {
              message.info('删除成功');
              expose.doRefresh();
              selectedRowKeys.value = [];
            }
          });
        },
      });
    } else {
      message.error('请先勾选记录');
    }
  };

  const selectedTreeDict = ref({});
  let TreeDict = dict({
    async onReady({ dict }) {
      const treeData = await curdApi.page({
        // query: { type: 1 },
        size: 300,
        pageSize: 1,
      });
      const listData = treeData.list.filter((item) => item.type === 1);
      const tree = deepTree(listData);
      dict.setData([{ id: 0, parentId: 0, label: '++ 一级菜单 ++' }, ...tree]);
    },
  });

  const selectedRowKeys = ref([]);
  const onSelectChange = (changed, selectedRows) => {
    // console.log('selection', changed);
    // console.log('selectedRows', selectedRows);
    if (selectedRows[0]?.children?.length > 0) {
      const children = selectedRows[0].children.map((child) => child.id);
      changed.push(...children);
      //console.log('children', changed);
    } else {
      function deepChildren(data) {
        //console.log('data', data);
        const ids = [];
        data.forEach((child) => {
          if (!_.isEmpty(child.children)) {
            return deepChildren(child.children);
          } else {
            return ids.push(child.id);
          }
        });
        return ids;
      }
      const children = deepChildren(selectedRows);
      //selectedRows.map((row) => row.id);
      //const _changed = new Set([...children, ...selectedRowKeys.value]);
      // console.log('children >> ', children);
      // console.log('selectedRowKeys.value >> ', selectedRowKeys.value);
      selectedRowKeys.value = children;
    }
    selectedRowKeys.value = changed;
  };

  return {
    moduleRef,
    openFormModule,
    moduleFormOptions,

    //getColumns,
    selectedRowKeys, //返回给index.vue去使用
    crudOptions: {
      request: {
        pageRequest: async (query) => {
          //return await curdApi.page({ ...query, size: 300, pageSize: 1 });

          return await curdApi.list().then((res) => {
            return {
              list: res,
              pagination: { page: 1, size: 300, total: 156 },
            };
          });
        },
        addRequest: async ({ form }) => {
          await curdApi.add(form).then(async (res) => {
            //console.log(res'addRequest', res);
            if (res) {
              //expose.doRefresh();
              await refreshMenu();
              await refreshPage();
            }
          });
        },
        editRequest: async ({ form }) =>
          await curdApi.update(form).then(async (res) => {
            //console.log(res'addRequest', res);
            if (res) {
              //expose.doRefresh();
              await refreshMenu();
              await refreshPage();
            }
          }),
        delRequest: async ({ row }) => await curdApi.delete({ ids: [row.id] }),
        //将后端返回的结果，改造成fs所需要的结构
        transformRes: ({ res }) => {
          console.log('transformRes', res);
          const tree = res.list ? deepTree(res.list) : [];
          return {
            // currentPage: 0,
            // pageSize: 0,
            records: tree,
            ...res.pagination,
          };
          //return { currentPage: res.current, pageSize: res.size, ...res };
        },
      },
      actionbar: {
        buttons: {
          delete: {
            show: hasPermission('sys:menu:delete'),
            text: ' ',
            icon: 'ant-design:delete-outlined',
            type: 'danger',
            order: 0,
            click: handleBatchDelete,
          },
          add: {
            show: hasPermission('sys:menu:add'),
            text: '新增菜单',
            icon: 'ant-design:apartment-outlined',
            order: 1,
            click() {
              expose.openAdd({
                row: { parentId: 0, type: 1, global: 0, status: 1, treePath: ',' },
                index: 0,
              });
            },
          },
          create: {
            show: hasPermission('sys:menu:add') && isDevMode,
            text: '快速创建模块',
            icon: 'ant-design:appstore-add-outlined',
            order: 2,
            click: openFormModule,
          },
        },
      },
      // container: {
      //   is: 'fs-layout-default',
      // },
      rowHandle: {
        fixed: 'right',
        align: 'center',
        width: 160,
        dropdown: {
          // 操作列折叠
          atLeast: 3,
          more: {
            size: 'small',
            text: '',
            icon: 'gg:more-o',
            //show: hasPermission('sys:role:bution_user') || hasPermission('sys:role:bution_res'),
          },
        },
        buttons: {
          // view: { show: true },
          // edit: { show: true },
          // remove: { show: true },
          distribution: {
            text: '复制',
            size: 'small',
            order: 4,
            //show: hasPermission('sys:role:bution_user'),
            async click(context) {
              //await expose.addForm(context.record);
              delete context.record.id;
              console.log(context.record);

              expose.openAdd({
                row: context.record,
                index: 0,
              });
            },
          },
          custom: {
            text: '',
            type: 'link',
            title: '新增子级',
            size: 'small',
            icon: 'ant-design:plus-outlined',
            order: 0,
            show: compute(({ row }) => {
              return row.type == 1;
            }),
            click: async (context) => {
              //context.row = context[ui.tableColumn.row];
              //console.log(context.row);
              const parentId = context?.row?.id ?? 0;
              const treePath =
                context.row.treePath != ','
                  ? context.row.treePath + ',' + parentId
                  : ',' + parentId;
              const type = treePath.split(',').length > 3 ? 2 : 1;
              await expose.openAdd({
                row: { parentId, type, global: 0, status: 1, treePath },
                index: context.index,
              });
              //expose.setData({ parentId: 10086 });
            },
          },
        },
      },
      pagination: { disabled: true },
      table: {
        bordered: false,
        rowSelection: { selectedRowKeys: selectedRowKeys, onChange: onSelectChange },
        // onResizeColumn: (w, col) => {
        //   expose.crudBinding.value.columns[col.key].column.width = w;
        // },
      },
      form: {
        display: 'flex',
        wrapper: {
          onOpen(context) {
            if (context.initialForm?.children) {
              context.row = _.omit(context.initialForm, ['children']);
            }
          },
        },
      },
      columns: {
        id: {
          title: 'ID',
          key: 'id',
          type: 'number',
          column: { show: false },
          form: { show: false },
        },
        label: {
          title: '名称',
          type: 'text',
          search: { show: true },
          column: {
            width: 200,
          },
        },
        parentId: {
          title: '上级ID',
          type: 'dict-tree',
          column: { show: false },
          dict: TreeDict,
          form: {
            value: compute(({ row }) => {
              return row?.parentId || 0;
            }),
            component: {
              //multiple: false,
              //defaultExpandAll: false,
              //treeLine: true,
              treeDefaultExpandedKeys: compute(({ row }) => {
                const key = _.concat(['0'], _.compact(row?.treePath.split(',')));
                return key;
              }),
              dict: { cache: false, isTree: true },
              fieldNames: {
                key: 'id',
                value: 'id',
                label: 'label',
              },
            },
            rules: [{ required: true, message: '此项必填' }],
          },
        },
        path: {
          title: '路径',
          type: 'text',
          column: { width: 110, align: 'center' },
          search: { show: true },
          form: {
            show: compute(({ form }) => {
              return form.type == 1;
            }),
          },
        },
        icon: {
          title: '图标',
          type: 'text',
          column: { show: false },
          form: {
            component: {
              name: shallowRef(IconPicker),
              vModel: 'value',
              allowClear: true,
              placeholder: '请点击右侧图标选择',
            },
            rules: [{ required: true, message: '此项必填' }],
          },
        },
        treePath: {
          title: '节点合集',
          type: 'text',
          column: { show: false },
          form: { show: false },
          addForm: {
            value: compute((context) => {
              if (!_.has(context, 'row.treePath')) {
                return ',';
              } else {
                return context.row.treePath + ',' + context.row.parentId;
              }
            }),
          },
        },
        // perms: {
        //   title: '权限节点',
        //   type: 'dict-checkbox',
        //   column: { show: false },
        //   dict: dict({
        //     data: compute((context) => {
        //       //console.log('entity', context.form.entity);
        //       //console.log('dict', expose.eps.api[context.form.entity]);
        //       //根据cellSwitch字段显隐
        //       return context?.form?.entity ? expose.eps.api[context.form.entity] : [];
        //     }),
        //   }),
        //   form: {
        //     // show: compute((context) => {
        //     //   //根据cellSwitch字段显隐
        //     //   if (context?.form?.entity) {
        //     //     return expose.eps.api[context.form.entity] ? true : false;
        //     //   } else {
        //     //     return false;
        //     //   }
        //     // }),
        //     // valueChange({ form, value, getComponentRef }) {
        //     //   const targetDict = getComponentRef('entity').getDict();
        //     //   console.log('targetDict', targetDict);
        //     //   console.log('form', form);
        //     //   console.log('value', value);
        //     //   //targetDict.reloadDict();
        //     // },
        //   },
        // },
        component: {
          title: '组件',
          type: 'text',
          column: { width: 150, ellipsis: true, align: 'center' },
          form: {
            value: 'Layout',
            show: compute(({ form }) => {
              return form.type == 1;
            }),
            component: {
              vModel: ui.input.modelValue,
              placeholder: '请填写组件',
            },
            helper: {
              position: 'label',
              text: '填写 Layout 则为页面布局, 填写 http 地址则为内嵌网页',
            },
          },
        },
        permission: {
          title: '标识',
          type: 'a-input',
          column: { show: false },
          show: compute((context) => {
            context.form.type === 2;
          }),
          form: {
            component: {
              //name: shallowRef(ClMenuPerms),
              vModel: ui.input.modelValue,
              // onChange: compute((context) => {
              //   //动态onChange方法测试
              //   //return () => {
              //   console.log('onChange', context.form.permission);
              //   //};
              // }),

              // onClick: compute((context) => {
              //   //动态onChange方法测试
              //   //return () => {
              //   console.log('onClick', context.form.permission);
              //   //};
              // }),
            },
            // valueBuilder({ form }) {
            //   if (form.permission) {
            //     //form.permission = form.roles.map((item) => item.id);
            //     console.log('onClick', form.permission);
            //   }
            // },

            helper: {
              position: 'label',
              text: '按钮权限标识，可以在编写模板时直接调用',
            },
          },
        },
        orderNum: {
          title: '排序',
          type: 'number',
          column: {
            width: 80,
            align: 'center',
          },
          form: {
            value: 0,
            component: {
              placeholder: '请填写排序',
              min: 0,
              max: 100,
            },
            helper: {
              position: 'label',
              text: '数值越小优先级越高',
            },
          },
        },
        type: {
          title: '类型',
          type: 'dict-radio',
          search: { show: true },
          column: {
            width: 80,
            align: 'center',
          },
          //search: { show: true },
          // form: {
          //   component: {
          //     name: 'fs-dict-radio',
          //     vModel: 'value',
          //     options: [
          //       { value: 1, label: '菜单路由', color: 'success' },
          //       { value: 2, label: '权限按钮', color: 'red' },
          //     ],
          //   },
          // },
          dict: dict({
            data: [
              { value: 1, label: '菜单路由', color: 'success' },
              { value: 2, label: '权限按钮', color: 'red' },
            ],
          }),
        },
        global: {
          title: '全局',
          type: 'dict-radio',
          column: {
            width: 60,
            align: 'center',
            helper: {
              position: 'label',
              text: '所有角色默认授权',
            },
          },
          dict: dict({
            url: '/sys/open/getDictCode?code=YES_NO',
            async onReady({ dict }) {
              dict.data.map((item) => {
                item.value = Number(item.value);
              });
              //console.log(dict.data);
              dict.setData(dict.data);
            },
          }),
          form: {
            helper: {
              position: 'label',
              text: '全局是默认授权给所有角色',
            },
          },
        },
        status: {
          title: '状态',
          type: 'dict-radio',
          column: {
            width: 80,
            align: 'center',
          },
          /* column: {
            width: 60,
            component: {
              name: 'fs-dict-switch',
              vModel: 'checked',
              onChange: compute(({ row, key, value }) => {
                row.status = value === 1 ? 'checked' : false;
              }),
            },
            valueBuilder({ row, value, key }) {
              row.status = value === 1 ? 'checked' : false;
            },
          }, */
          //search: { show: true },
          dict: dict({
            url: '/sys/open/getDictCode?code=STATUS',
            async onReady({ dict }) {
              dict.data.map((item) => {
                item.value = Number(item.value);
              });
              dict.setData(dict.data);
            },
            // data: [
            //   { value: 1, label: '正常', color: 'success' },
            //   { value: 0, label: '停用', color: 'red' },
            // ],
          }),
        },
        description: {
          title: '描述',
          type: ['textarea', 'colspan'],
          column: { width: 180, ellipsis: true, align: 'center' },
          form: {
            component: {
              placeholder: '请填写描述信息',
              rows: 2,
            },
          },
        },
      },
    },
  };
}

function createFormOptions(service, expose) {
  // 自定义表单配置
  const { buildFormOptions } = useColumns();
  const ui = uiContext.get();
  //使用crudOptions结构来构建自定义表单配置

  const { _eps } = expose;

  // 实体列表
  const entities = [];
  for (const i in _eps) {
    _eps[i].forEach((e) => {
      if (!_.isEmpty(e.columns)) {
        const prefixs = e.prefix.replace('/admin/', '/');
        const filename = _.last(e.prefix.split('/'));
        delete e.prefix;
        //delete e.children;
        entities.push({
          ...e,
          label: `${e.name}`,
          value: `${entities.length}`,
          key: entities.length,
          filename,
          prefixs,
          //prefix: e.prefix.replace('/admin/', '/'),
        });
      }
    });
  }

  // console.log(entities[10]);
  // const form = createTest(entities[10]);
  // console.log(JSON.stringify(form.list));
  //console.log(entities);

  return buildFormOptions({
    columns: {
      // id: {
      //   title: 'ID',
      //   type: 'number',
      //   form: {
      //     show: false,
      //   },
      // },
      label: {
        title: '菜单名称',
        type: 'text',
        form: {
          component: {
            name: 'a-input',
            allowClear: true,
            placeholder: '菜单导航显示的名称',
          },
          rules: [{ required: true, message: '此项必填' }],
        },
      },
      parentId: {
        title: '上级ID',
        type: 'dict-tree',
        dict: dict({
          url: '/sys/menu/list',
          // isTree: true,
          // value: 'id',
          // label: 'label',
          cache: true,
          async getData({ dict }) {
            return await service.sys.menu.list().then((res) => {
              const _list = res
                .filter((e) => e.type != 2)
                .map((e) => {
                  return {
                    id: e.id,
                    value: e.id,
                    label: e.label,
                    parentId: e.parentId,
                    orderNum: e.orderNum,
                  };
                });
              _list.unshift({
                label: '一级菜单',
                id: 0,
                value: 0,
              });
              return deepTree(_list);
            });
          },
        }),
        form: {
          value: 0,
          component: {
            placeholder: '请选择归属上级菜单',
          },
          rules: [{ required: true, message: '此项必填' }],
        },
      },
      module: {
        title: '归属目录',
        type: 'dict-select',
        dict: dict({
          url: '/__cool_modules',
          cache: true,
          async getData({ dict }) {
            // 覆盖全局获取字典请求配置
            return await service
              .request({
                url: dict.url,
                proxy: false,
              })
              .then((response) => {
                return response.map((e) => {
                  return {
                    label: e,
                    value: e,
                  };
                });
              });
          },
        }),
        form: {
          // valueChange(context) {
          //   //if (value) {
          //   const formItemRef = context.getComponentRef('module', true);
          //   console.log(formItemRef);
          //   console.log(context);
          //   //form.entity.form.component.disabled = false;
          //   //}
          // },
          component: {
            allowClear: true,
            placeholder: '请选择模块归属目录',
          },
          rules: [{ required: true, message: '此项必填' }],
          helper: {
            text: '当前功能模块，生成在本地哪个目录下',
          },
        },
      },
      icon: {
        title: '菜单图标',
        type: 'text',
        form: {
          component: {
            name: shallowRef(IconPicker),
            vModel: 'value',
            allowClear: true,
            placeholder: '请点击右侧图标选择',
          },
          rules: [{ required: true, message: '此项必填' }],
          helper: {
            text: '设置菜单辨识度图标',
          },
        },
      },
      entity: {
        title: '数据结构',
        type: 'dict-select',
        dict: dict({
          data: entities,
        }),
        form: {
          valueChange({ form, value }) {
            form.path = ['', form.module || 'test', entities[value]?.filename || ''].join('/');
            //form.component = [form.path, 'index'].join('/');
          },
          component: {
            disabled: compute(({ form }) => {
              return form.module === undefined ? true : false;
            }),
            placeholder: '请选择数据表模型',
          },
          rules: [{ required: true, message: '此项必填' }],
          helper: {
            position: 'label',
            text: '实体，是后端的数据表模型，可以自动关联内置或自定义权限节点',
          },
        },
      },
      type: {
        title: '类型',
        type: 'dict-radio',
        dict: dict({
          data: [
            {
              label: '菜单',
              value: 1,
            },
            {
              label: '权限',
              value: 2,
            },
          ],
        }),
        form: {
          show: false,
          value: 1,
          helper: {
            position: 'label',
            text: '菜单节点类型规划',
          },
        },
      },
      path: {
        title: '菜单路由',
        type: 'text',
        form: {
          value: '',
          helper: {
            text: '菜单路由路径',
          },
        },
      },
      /* perms: {
        title: '权限节点',
        type: 'dict-checkbox',
        dict: dict({
          data: compute((context) => {
            //根据cellSwitch字段显隐
            return expose.eps.api[context.form.entity];
          }),
        }),
        form: {
          show: compute((context) => {
            //根据cellSwitch字段显隐
            if (context.form.entity) {
              return expose.eps.api[context.form.entity] ? true : false;
            } else {
              return false;
            }
          }),
          // valueChange({ form, value, getComponentRef }) {
          //   const targetDict = getComponentRef('entity').getDict();
          //   console.log('targetDict', targetDict);
          //   console.log('form', form);
          //   console.log('value', value);
          //   //targetDict.reloadDict();
          // },
        },
      }, */
      // component: {
      //   title: '组件',
      //   type: 'text',
      //   form: {
      //     show: true,
      //     value: '',
      //   },
      // },
      status: {
        title: '状态',
        type: 'number',
        form: {
          show: false,
          value: 1,
        },
      },
      global: {
        title: '全局',
        type: 'number',
        form: {
          show: false,
          value: 0,
        },
      },
      orderNum: {
        title: '排序',
        type: 'number',
        form: {
          value: 0,
          component: {
            placeholder: '请填写排序',
            min: 0,
            max: 100,
          },
          helper: {
            position: 'label',
            text: '数值越小优先级越高',
          },
        },
      },
      description: {
        title: '描述',
        type: 'textarea',
        form: {
          component: {
            placeholder: '请填写描述信息',
            rows: 4,
          },
        },
      },
    },
    form: {
      labelCol: { span: 6 },
      //wrapperCol: { span: 16 },
      //col: { span: 18 },
      display: 'fixed',
      // labelWidth: 24,
      //col: { span: 24 },
      //display: 'fixed',
      // labelCol: { span: 5 },
      // wrapperCol: { span: 18 },
      // col: { span: 12 },
      // display: 'grid',
      // },

      doSubmit({ form }) {
        // 选择的数据结构
        const item = entities[form.entity];

        // 插入菜单
        service.sys.menu
          .add({
            ...form,
            component: `${form.path}/index`,
            entity: item.label,
            permission: [item.module, item.filename].join(':'),
          })
          .then((res) => {
            // 权限列表
            const perms = [];

            item.api.forEach((e) => {
              const d = {
                type: 2,
                parentId: res.id,
                global: 0,
                icon: 'ant-design:function-outlined',
                label: e.summary || e.path,
                permission: [e.path],
              };

              // if (e.path == '/update') {
              //   if (item.api.find((a) => a.path == '/info')) {
              //     d.permission.push('/info');
              //   }
              // }

              d.permission = d.permission
                //.map((e) => (item.prefixs + e).replace(/\//g, ':'))
                .map((e) => (item.prefixs + e).split('/').join(':'))
                .join(',');

              perms.push(d);
            });

            // 批量插入权限
            const post = { ...item, ...form };
            console.log('post submit:');
            console.log(post);
            service.sys.menu.add(perms).then(() => {
              service.request({
                url: '/__cool_createMenu',
                proxy: false,
                method: 'POST',
                data: post,
              });
            });
          });
        // .catch((err) => {
        //   ui.message.error(err.message);
        // });
      },
    },
  });
}
