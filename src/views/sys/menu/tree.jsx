import { ref, shallowRef } from 'vue';
import { dict, compute, uiContext } from '@fast-crud/fast-crud';
import { deepTree } from '/@/utils';
import { IconPicker } from '/@/components/Icon';
import ClMenuPerms from './components/perms.vue';
import * as _ from 'lodash-es';

export default function ({ expose, service }) {
  const curdApi = service.sys.menu;
  const ui = uiContext.get();

  const pageRequest = async (query) => {
    //return await curdApi.list(query);
    curdApi.list(query).then((res) => {
      const tree = deepTree(res);
      expose.setTableData(tree);
    });
    return {
      currentPage: 0,
      pageSize: 0,
      records: [],
      pagination: { total: 0, size: 0, page: 0 },
      list: [],
    };
  };
  const editRequest = async ({ form, row }) => {
    form.id = row.id;
    return await curdApi.update(form);
  };
  const delRequest = async ({ row }) => {
    return await curdApi.delete(row.id);
  };

  const addRequest = async ({ form }) => {
    return await curdApi.add(form);
  };
  const selectedRowKeys = ref([]);

  const onSelectChange = (changed, selectedRows) => {
    console.log('selection', changed);
    console.log('selectedRows', selectedRows);
    if (selectedRows[0]?.children?.length > 0) {
      const children = selectedRows[0].children.map((child) => child.id);
      changed.push(...children);
      console.log('children', changed);
    } else {
      function deepChildren(data) {
        console.log('data', data);
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

  //const columns = ref({});
  // const getColumns = (columns) => {
  //   console.log('columns', columns);
  //   columns.value = columns;
  // };
  return {
    //getColumns,
    selectedRowKeys, //返回给index.vue去使用
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      actionbar: {
        buttons: {
          add: {
            text: '新增菜单',
            icon: 'ant-design:apartment-outlined',
            click() {
              expose.openAdd({
                row: { parentId: 0, type: 1, global: 0, status: 1, treePath: ',' },
                index: 0,
              });
            },
          },
        },
      },
      rowHandle: {
        buttons: {
          // view: { show: true },
          // edit: { show: true },
          // remove: { show: true },
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
        //wrapper: {
        //async onOpened(context) {
        //     //getFormWrapperRef().formOptions.display = context.options.initial?.display;
        //     console.log('form getFormWrapperRef', getFormWrapperRef());
        //     console.log('form getFormData', getFormData());
        //console.log('form context', context);
        //     console.log('form expose', expose);
        //     columns.value = context.formRef.columns;
        //},
        //},
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
            width: 180,
            ellipsis: true,
            resizable: true,
          },
        },
        parentId: {
          title: '上级ID',
          type: 'number',
          column: { show: false },
          addForm: {
            value: compute((context) => {
              //console.log('context.row', context.row);
              return context?.row?.parentId || 0;
            }),
          },
          form: {
            component: {
              name: 'a-input',
              disabled: true,
              placeholder: '请填写上级ID',
            },
            rules: [{ required: true, message: '此项必填' }],
          },
        },
        path: {
          title: '路径',
          type: 'text',
          column: { width: 120 },
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
          // valueBuilder(context) {
          //   //value构建，就是把后台传过来的值转化为前端组件所需要的值
          //   //在pageRequest之后执行转化，然后将转化后的数据放到table里面显示
          //   context.row.icon = context.row.label;
          // },
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
          column: { width: 150, ellipsis: true },
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
        // entity: {
        //   title: '实体',
        //   type: 'dict-select',
        //   show: compute(({ form }) => {
        //     return form.type == 1;
        //   }),
        //   dict: dict({
        //     data: expose.eps.entities,
        //   }),
        //   form: {
        //     // show: compute(({ form }) => {
        //     //   return form.type === 1;
        //     // }),
        //     component: {
        //       //name: shallowRef(FsTable),
        //       //vModel: 'modelValue',
        //       vModel: ui.input.modelValue,
        //       placeholder: '请选择数据表模型',
        //       onChange: compute(({ form }) => {
        //         //动态onChange方法测试
        //         //return () => {
        //         if (form.entity) {
        //           form.path = expose.eps.path[form.entity];
        //           form.component = expose.eps.path[form.entity] + '/index';
        //         } else {
        //           form.path = '';
        //           form.component = '';
        //         }
        //         //};
        //         //console.log('onChange', form.path);
        //       }),
        //     },
        //     helper: {
        //       position: 'label',
        //       text: '实体，是后端的数据表模型，可以自动关联内置或自定义权限节点',
        //     },
        //   },
        // },
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
          column: {
            width: 100,
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
            width: 80,
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
          valueBuilder({ value, row, key }) {
            //if (value != null) {
            row[key] = value == 1 ? '1' : '0';
            //}
          },
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
          },
          //search: { show: true },
          dict: dict({
            // url: '/sys/open/getDictCode?code=YES_NO',
            // async onReady({ dict }) {
            //   dict.data.map((item) => {
            //     item.value = Number(item.value);
            //   });
            //   dict.setData(dict.data);
            // },
            data: [
              { value: 1, label: '正常', color: 'success' },
              { value: 0, label: '停用', color: 'red' },
            ],
          }),
        },
        description: {
          title: '描述',
          type: ['textarea', 'colspan'],
          column: { show: false },
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
