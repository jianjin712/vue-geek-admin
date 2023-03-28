import moment from 'moment';
import { dict } from '@fast-crud/fast-crud';
import { toRaw, unref } from 'vue';
export default function ({ expose, props }) {
  console.log(unref(props.rowform));
  let dictionaryId = props.modelValue || 0;
  const service = props.service;
  return {
    crudOptions: {
      request: {
        pageRequest: async (query) => await service.page({ dictionaryId, ...query }),
        addRequest: async ({ form }) => await service.add(form),
        editRequest: async ({ form }) => await service.update(form),
        delRequest: async ({ row }) => await service.delete(row.id),
      },
      rowHandle: {
        width: 150,
        align: 'center',
        buttons: {
          view: { size: 'small' /* show: false */ },
          edit: { size: 'small' },
          remove: { size: 'small' },
        },
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        label: {
          title: '文本',
          search: { show: true },
          type: 'text',
          column: {
            width: 80,
            align: 'center',
            sorter: true,
          },
        },
        value: {
          title: '值',
          search: { show: false },
          type: 'text',
          column: {
            sorter: true,
          },
        },
        dictionaryCode: {
          title: '上级代码',
          type: 'text',
          column: { show: false },
          form: {
            component: {
              name: 'a-input',
              disabled: true,
              placeholder: '上级字典代码',
            },
          },
          addForm: { value: props.rowform.code },
        },
        color: {
          title: '颜色',
          type: 'dict-select',
          column: { width: 100 },
          dict: dict({
            //cache: true,
            url: '/sys/open/getDictCode?code=COLOR',
          }),
        },
        dictionaryId: {
          title: '上级 ID',
          type: 'number',
          form: {
            component: {
              name: 'a-input',
              disabled: true,
              placeholder: '上级ID',
            },
          },
          addForm: { value: props.rowform.id },
          column: { show: false },
        },
        status: {
          title: '状态',
          type: 'dict-radio',
          search: { show: true },
          dict: dict({
            url: '/sys/open/getDictCode?code=STATUS',
          }),
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = value === 1 ? '1' : '0';
            }
          },
          addForm: { value: 1 },
          // valueBuilder({ value, row, key }) {
          //   if (value != null) {
          //     row[key] = value === true ? 1 : 0;
          //   }
          // },
        },
        orderNum: {
          title: '排序',
          column: { show: false },
          type: 'number',
          addForm: { value: 0 },
          form: { component: { min: 0, max: 100 } },
        },
        description: {
          title: '描述',
          column: { show: false },
          type: ['textarea', 'colspan'],
        },
        createTime: {
          title: '创建时间',
          type: 'datetime',
          column: { width: 180, sorter: true },
          form: { show: false },
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
