//import { shallowRef } from 'vue';
import { dict, compute, uiContext } from '@fast-crud/fast-crud';
//import ClMenuPerms from './components/perms.vue';
//import { ApiCascader } from '/@/components/Form';
export default function ({ expose, nodeRef, curdApi }) {
  const ui = uiContext.get();

  return {
    crudOptions: {
      request: {
        pageRequest: async ({ form }) => {
          return await curdApi.page({
            parentId: nodeRef.value.id,
            type: 2,
            ...form,
          });
        },
        addRequest: async ({ form }) => await curdApi.add(form),
        editRequest: async ({ form }) => await curdApi.update(form),
        delRequest: async ({ row }) => await curdApi.delete({ ids: [row.id] }),
      },
      rowHandle: {
        show: true,
        width: 90,
        fixed: 'right',
        dropdown: {
          // 操作列折叠
          atLeast: 1,
          more: { size: 'small', text: '', icon: 'gg:more-o' },
        },
      },
      toolbar: {
        compact: true,
        buttons: {
          search: { show: false },
          refresh: { show: false },
        },
      },
      actionbar: { buttons: { add: { show: false } } },
      table: {
        size: 'small',
        scroll: { fixed: true },
        editable: {
          mode: 'free',
          enabled: true,
          activeTrigger: false,
        },
      },
      // table: {
      //   /* emptyText: '请新增扩展参数',
      //   width: '100%',
      //   tableLayout: '100%', */
      //   size: 'small',
      //   scroll: { fixed: true },
      //   pagination: false,
      //   editable: {
      //     enabled: true,
      //     mode: 'free',
      //     activeTrigger: false,
      //   },
      // },
      search: { show: false },
      buttons: { show: false },
      columns: {
        id: {
          title: 'ID',
          type: 'number',
          column: { show: false },
          form: { show: false },
        },
        parentId: {
          title: '父ID',
          type: 'text',
          column: { show: false },
          addForm: {
            value: compute(() => {
              return nodeRef.value.id;
            }),
          },
          form: {
            component: {
              disabled: true,
            },
            rules: [{ required: true, message: '请选择菜单后操作' }],
          },
        },
        type: {
          title: '类型',
          type: 'dict-select',
          column: { show: false },
          dict: dict({
            data: [
              { value: 1, label: '菜单' },
              { value: 2, label: '按钮' },
            ],
          }),
          addForm: { value: 2 },
          form: { component: { disabled: true } },
        },
        label: {
          title: '节点',
          type: 'text',
          column: { width: 70, ellipsis: true },
          form: {
            rules: [{ required: true, message: '请填写资源名称' }],
          },
        },

        permission: {
          title: '权限',
          type: 'text',
          form: {
            component: {
              placeholder: '资源权限编码',
            },
            rules: [{ required: true, message: '请填写资源权限编码' }],
            helper: '如（sys:admin:edit）',
          },
          column: { width: 150, ellipsis: true },
        },
        global: {
          title: '全局',
          type: 'dict-radio',
          column: { show: true, width: 50 },
          addForm: { value: 0 },
          form: {
            component: {
              vModel: ui.radio.modelValue,
            },
            helper: {
              position: 'label',
              text: '通常带有dict前缀的属于接口级，可以设置全局授权。',
            },
          },
          dict: dict({
            data: [
              { value: 1, label: '是', color: 'success' },
              { value: 0, label: '否', color: 'error' },
            ],
          }),
        },
        // permission: {
        //   title: '编码',
        //   type: 'text',
        //   form: {
        //     //col: { span: 24 },
        //     //labelWidth: '5%',
        //     //wrapperCol: { span: 24 },
        //     placeholder: '资源权限编码',
        //     labelPosition: 'top',
        //     component: {
        //       //全局注册的组件直接写组件名称即可
        //       //name: 'a-select',
        //       //局部注册的组件需要shallowRef方法包裹
        //       //name: 'fs-table',
        //       //vModel: 'text',
        //       name: shallowRef(ClMenuPerms),
        //       vModel: 'modelValue',
        //       onClick: (event) => {
        //         console.log('点击事件', event);
        //       },

        //       on: {
        //         dataChange({ data }) {
        //           console.log('table data changed', data);
        //           // if (dict.data != null && form.firstDefault == null) {
        //           //   form.firstDefault = dict.data[0].value;
        //           // }
        //         },
        //       },
        //       //vModel: 'text',
        //       // props: {
        //       //   //vModel: 'parameters',
        //       //   //table: {
        //       //   //show: false,
        //       //   /* editable: {
        //       //     enabled: true,
        //       //     mode: 'row',
        //       //     activeTrigger: 'onClick',
        //       //   }, */
        //       //   //},
        //       //   data: compute(({ form }) => {
        //       //     if (form.parameters) {
        //       //       const parameters = form.parameters;
        //       //       // console.log(typeof parameters);
        //       //       // console.log(parameters);
        //       //       return form.parameters ?? '';
        //       //     }
        //       //   }),
        //       //   columns: {
        //       //     name: {
        //       //       title: '参数名',
        //       //       type: 'text',
        //       //       table: {
        //       //         rules: [{ required: true, message: '请求参数不能为空' }],
        //       //       },
        //       //     },
        //       //     type: {
        //       //       title: '类型',
        //       //       type: 'dict-select',
        //       //       dict: dict({
        //       //         url: '/mock/dicts/FieldType',
        //       //       }),
        //       //     },
        //       //     required: {
        //       //       title: '是否必需',
        //       //       type: 'dict-switch',
        //       //       column: {
        //       //         width: 70,
        //       //         align: 'center',
        //       //       },
        //       //       dict: dict({
        //       //         data: [
        //       //           { value: true, label: '' },
        //       //           { value: false, label: '' },
        //       //         ],
        //       //       }),
        //       //     },
        //       //     sampleValue: {
        //       //       title: '默认值',
        //       //       type: 'text',
        //       //     },
        //       //     description: {
        //       //       title: '描述',
        //       //       type: 'text',
        //       //     },
        //       //   },
        //       // },
        //     },
        //   },
        // },
        orderNum: {
          title: '排序',
          type: 'number',
          column: { show: false, width: 50, align: 'center' },
          addForm: { value: 0 },
          form: { component: { min: 0, max: 100 } },
        },
        description: {
          title: '描述',
          column: { show: false, ellipsis: true },
          type: ['textarea', 'colspan'],
        },
      },
    },
  };
}
