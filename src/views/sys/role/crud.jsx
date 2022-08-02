import { dict /* , compute */ } from '@fast-crud/fast-crud';
import moment from 'moment';
import { usePermission } from '/@/hooks/web/usePermission';

export default function ({ expose, distribution, service }) {
  const { hasPermission } = usePermission();
  const roleApi = service.sys.role;
  return {
    crudOptions: {
      request: {
        pageRequest: async (query) => await roleApi.page(query),
        addRequest: async ({ form }) => await roleApi.add(form),
        editRequest: async ({ form }) => await roleApi.update(form),
        delRequest: async ({ row }) => await roleApi.delete({ ids: [row.id] }),
      },
      form: {
        labelWidth: 100,
      },
      rowHandle: {
        show: true,
        width: 120,
        fixed: 'right',
        dropdown: {
          // 操作列折叠
          atLeast: 2,
          more: {
            size: 'small',
            text: '',
            icon: 'gg:more-o',
            show: hasPermission('sys:role:bution_user') || hasPermission('sys:role:bution_res'),
          },
        },
        buttons: {
          distribution: {
            text: '分配用户',
            size: 'small',
            order: 4,
            show: hasPermission('sys:role:bution_user'),
            async click(context) {
              await distribution.userModal(context.record.id);
            },
          },
          resource: {
            text: '分配权限',
            size: 'small',
            order: 5,
            show: hasPermission('sys:role:bution_res'),
            async click(context) {
              await distribution.resourceModal(context.record.id);
            },
          },
        },
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { /* show: false */ width: 60, content: true },
        },
        name: {
          title: '名称',
          type: 'text',
          column: { width: 120, content: true },
          search: { show: true, component: { style: { width: '120px' } } },
        },
        code: {
          title: '标识',
          type: 'text',
          column: { width: 110 },
          form: {
            rules: [
              { required: true, message: '请输入编码' },
              { min: 2, max: 30, message: '长度在 2 到 30 个字符' },
            ],
          },
        },
        readonly: {
          title: '内置角色',
          type: 'dict-radio',
          column: { width: 90, align: 'center' },
          addForm: { show: false },
          editForm: {
            component: {
              disabled: true,
            },
          },
          dict: dict({
            data: [
              { value: 1, label: '是', color: 'success' },
              { value: 0, label: '否', color: 'error' },
            ],
          }),
        },
        status: {
          title: '状态',
          type: 'dict-radio',
          search: { show: true },
          column: { width: 100, align: 'center' },
          form: { disabled: 1 },
          dict: dict({
            data: [
              { value: 1, label: '启用', color: 'success' },
              { value: 0, label: '禁用', color: 'error' },
            ],
          }),
          // valueBuilder({ value, row, key }) {
          //   if (value != null) {
          //     row[key] = value === true ? 1 : 0;
          //   }
          // },
        },
        scopeType: {
          title: '权限范围',
          search: { show: true },
          type: 'dict-select',
          column: { width: 120 },
          dict: dict({
            data: [
              { value: 10, label: '个人', color: 'warning' },
              { value: 20, label: '自定义', color: 'error' },
              { value: 30, label: '本级', color: 'warning' },
              { value: 40, label: '本级及子级', color: 'success' },
              { value: 50, label: '全部', color: 'success' },
            ],
          }),
          form: {
            component: { radioName: 'a-radio-button' },
            valueChange: ({ value, form, ...content }) => {
              console.log('value', value, 'form', form, 'content', content);
            },
          },
        },
        description: {
          title: '描述',
          search: { show: false },
          column: { width: 170, ellipsis: true },
          type: ['textarea', 'colspan'],
        },
        orgIdsList: {
          title: '部门',
          type: 'dict-tree',
          search: { show: false },
          column: { show: false },
          dict: dict({
            //cloneable: false,
            isTree: true,
            url: '/sys/org/tree',
            value: 'id',
            label: 'label',
            // async onReady({ dict }) {
            //   //console.log('dict', dict);
            //   await dict.setData(dict.data.data);
            // },
          }),
          form: {
            //show:
            async valueBuilder(context) {
              //如果配置在form下，则表示将行数据的值转化为表单组件所需要的值
              //在点击编辑按钮之后，弹出表单对话框之前执行转化。
              const orgIdsList = await roleApi.getByOrgIds({ roleId: context.form.id });
              console.log('orgIdsList', orgIdsList);
              context.form.orgIdsList = orgIdsList;
            },
            component: {
              // checkedChildren: true,
              // unCheckedChildren: true,
              //multiple: true,
              treeCheckable: true,
              treeDefaultExpandAll: true,
              //treeIcon: true,
              dropdownStyle: { maxHeight: '300px', overflow: 'auto' },
              treeLine: true,
              showSearch: true,
              height: 200,
              //defaultExpandAll: true,
              dict: { cache: false },
              fieldNames: {
                key: 'id',
                value: 'id',
                label: 'label',
              },
            },

            valueChange: ({ value /* , form, ...content */ }) => {
              console.log('orgIdsList', value /* 'form', form, 'content', content */);
            },
          },
        },
        createTime: {
          title: '创建时间',
          type: 'datetime',
          column: { width: 180, sorter: true },
          addForm: { show: false },
          editForm: { show: false },
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = moment(value);
            }
          },
        },
      },
    },
  };
}
