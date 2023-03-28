import { compute, dict } from '@fast-crud/fast-crud';
import { buildUUID } from '/@/utils/uuid';
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
          title: '应用名称',
          type: 'text',
          column: { width: 200 },
          search: { show: true },
        },
        siteName: {
          title: '网站名称',
          type: 'text',
          column: { show: false },
        },
        siteDomain: {
          title: '网站域名',
          type: 'text',
          column: { show: false },
          form: {
            helper: {
              text: '网站地址必须以http或https开头',
            },
          },
        },
        appId: {
          title: 'AppId',
          type: 'text',
          search: { show: true },
          column: { width: 200 },
          form: { component: { disabled: true } },
          addForm: {
            value: compute(() => {
              //当value为null时，不显示
              return new Date().getTime().toString().substring(5);
            }),
          },
        },
        appSecret: {
          title: 'AppSecret',
          type: 'text',
          form: { component: { disabled: true } },
          addForm: {
            value: compute(() => {
              //当value为null时，不显示
              return buildUUID();
            }),
          },
        },
        callbackDomain: {
          title: '回调域名',
          type: 'text',
          column: { show: false },
          form: {
            helper: {
              text: '授权回调地址必须以http或https开头',
            },
          },
        },
        option: {
          title: '参数',
          type: 'text',
          search: { show: false },
          column: { show: false },
        },
        desc: {
          title: '应用描述',
          column: { show: false },
          type: ['textarea', 'row'],
        },
        status: {
          title: '应用状态',
          column: { width: 80 },
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
