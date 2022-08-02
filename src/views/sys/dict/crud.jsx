import { shallowRef } from 'vue';
import SubTable from './sub-table/index.vue';
import { dict, compute } from '@fast-crud/fast-crud';
import moment from 'moment';

export default function ({ expose, service }) {
  const curdApi = service.sys.dict;
  return {
    crudOptions: {
      request: {
        pageRequest: async (query) => await curdApi.page(query),
        addRequest: async ({ form }) => await curdApi.add(form),
        editRequest: async ({ form }) => await curdApi.update(form),
        delRequest: async ({ row }) => await curdApi.delete({ ids: [row.id] }),
      },
      columns: {
        name: {
          title: '名称',
          search: { show: true, component: { style: { width: '120px' } } },
          type: 'text',
        },
        code: {
          title: '编码',
          search: { show: true, component: { style: { width: '120px' } } },
          type: 'text',
        },
        status: {
          title: '状态',
          type: 'dict-radio',
          search: { show: true },
          column: {
            show: true,
            width: 100,
            align: 'center',
            //filterable: true,
            //filterMultiple: false,
            filters: [
              { text: '启用', value: 1 },
              { text: '禁用', value: 0 },
            ],
            onFilter: (value, row) => {
              return row.status === value;
            },
            sorter: true,
            sortable: 'custom',
            //sortDirections: ['descend'],
          },
          dict: dict({
            data: [
              { value: 1, label: '启用', color: 'success' },
              { value: 0, label: '禁用', color: 'error' },
            ],
          }),
          addForm: { value: 1 },
          // valueBuilder({ value, row, key }) {
          //   if (value != null) {
          //     row[key] = value === true ? 1 : 0;
          //   }
          // },
        },
        readonly: {
          title: '内置',
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
        orderNum: {
          title: '排序',
          column: { width: 50, align: 'center' },
          type: 'number',
          addForm: { value: 0 },
          form: { component: { min: 0, max: 100 } },
        },
        description: {
          title: '描述',
          type: ['textarea', 'colspan'],
        },
        createTime: {
          title: '创建时间',
          type: 'datetime',
          form: { show: false },
          column: { width: 180, sorter: true },
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = moment(value);
            }
          },
        },
        id: {
          title: '字典信息',
          column: { show: false },
          type: ['text-area', 'colspan'],
          form: { show: false },
          viewForm: {
            show: true,
            // 嵌套表格字段
            component: {
              //局部引用子表格，要用shallowRef包裹
              name: shallowRef(SubTable),
              vModel: 'modelValue',
              service: service.sys.dictitem,
              rowform: compute(({ form }) => {
                return form;
              }),
            },
          },
        },
      },
    },
  };
}
