import { dict } from '@fast-crud/fast-crud';

export default function ({ crudExpose, crudApi }) {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query) => await crudApi.page(query),
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
          title: '项目名称',
          type: 'text',
          search: { show: true },
        },
        option: {
          title: '参数',
          //type: 'dict-select',
          type: 'text',
          search: { show: false },
          column: { show: false },
          // dict: dict({
          //   value: 'id',
          //   label: 'text',
          //   data: [
          //     { id: 'sz', text: '深圳', color: 'success' },
          //     { id: 'gz', text: '广州' },
          //     { id: 'bj', text: '北京' },
          //     { id: 'wh', text: '武汉' },
          //     { id: 'sh', text: '上海' },
          //   ],
          // }),
        },
        status: {
          title: '项目状态',
          search: { show: false },
          type: 'dict-radio',
          dict: dict({
            url: '/sys/open/getDictCode?code=STATUS',
          }),
          addForm: {
            value: '1',
          },
        },
      },
    },
  };
}
