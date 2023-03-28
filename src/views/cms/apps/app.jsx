import { dict } from '@fast-crud/fast-crud';

export default function ({ crudExpose, crudApi }) {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query) => await crudApi.page({ ...query, parentId: 0 }),
        addRequest: async ({ form }) => await crudApi.add(form),
        editRequest: async ({ form }) => await crudApi.update(form),
        delRequest: async ({ row }) => await crudApi.delete({ ids: [row.id] }),
      },

      columns: {
        id: {
          title: 'ID',
          key: 'id',
          type: 'number',
          column: {
            width: 50,
          },
          form: {
            show: false,
          },
        },
        name: {
          title: '分组名称',
          type: 'text',
          // column: {
          //   width: 100,
          // },
          search: { show: true },
        },
        desc: {
          title: '分组描述',
          //column: { show: false },
          type: ['textarea', 'row'],
        },
        option: {
          title: '参数',
          //type: 'dict-select',
          type: 'text',
          search: { show: false },
          column: { show: false },
        },
        status: {
          title: '项目状态',
          search: { show: false },
          type: 'dict-radio',
          dict: dict({
            url: '/sys/open/getDictCode?code=STATUS',
          }),
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = value === 1 ? '1' : '0';
            }
          },
          addForm: {
            value: '1',
          },
        },
      },
    },
  };
}
