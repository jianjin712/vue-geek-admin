import { dict, compute } from '@fast-crud/fast-crud';

//export default function ({ expose, service }) {
export default function ({ expose, service }) {
  const curdApi = service.task.info;
  const crudBinding = expose.crudBinding;
  return {
    expose,
    crudOptions: {
      request: {
        pageRequest: async (query) => await curdApi.page(query),
        addRequest: async ({ form }) => await curdApi.add(form),
        editRequest: async ({ form }) => await curdApi.update(form),
        delRequest: async ({ row }) => await curdApi.delete({ ids: [row.id] }),
      },
      rowHandle: {
        fixed: 'right',
        align: 'center',
      },
      table: {
        expandRowByClick: true,
        onResizeColumn: (w, col) => {
          //触发resize事件后，修改column宽度，width只能配置为number类型
          //可以将此方法写在app.use()中的commonOptions里面
          crudBinding.value.table.columnsMap[col.key].width = w;
        },
        slots: {
          expandedRowRender: (scope) => {
            return (
              <div>
                index: {scope.index} ; row: {JSON.stringify(scope.record)}
              </div>
            );
          },
        },
      },
      form: {
        display: 'flex',
        col: { span: 12 },
        labelAlign: 'right',
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
      },
      columns: {
        id: {
          title: '任务ID',
          type: 'text',
          form: { show: false },
          column: {
            align: 'center',
            width: 80,
            resizable: true,
            component: {
              on: {
                // 注意：必须要on前缀
                onClick({ value, key, row, form }) {
                  console.log('点击事件', key, value, row, form);
                },
              },
            },
          },
        },
        name: {
          title: '名称',
          type: 'text',
          key: 'name',
          form: { required: true },
          //component: { name: 'a-input' },
        },
        taskType: {
          title: '模式',
          type: 'dict-radio',
          column: { width: 100 },
          dict: dict({
            data: [
              { label: 'cron', value: 0, color: 'error' },
              { label: '时间间隔', value: 1, color: 'success' },
            ],
          }),
          form: {
            value: 1,
            helper: {
              text: ' 0:cron 1：时间间隔',
            },
          },
          //component: { name: 'a-input' },
        },
        every: {
          title: '间隔(秒)',
          type: 'number',
          column: { show: false },
          form: {
            value: 1,
            component: {
              style: { width: '100%' },
              name: 'a-input-number',
              min: 1,
              max: 100000000,
            },
            show: compute(({ form }) => {
              return form.taskType ? true : false;
            }),
            helper: { text: '每间隔多少毫秒执行一次 如果cron设置了 这项设置就无效' },
          },
          //
        },
        repeatConf: {
          title: '任务配置',
          type: 'json',
          column: { show: false },
          form: {
            show: false,
            valueBuilder({ form }) {
              if (form.repeatConf == null) {
                return;
              }
              form.repeatConf = JSON.parse(form.repeatConf);
            },
            valueResolve({ form }) {
              if (form.repeatConf == null) {
                return;
              }
              form.repeatConf = JSON.stringify(form.repeatConf);
            },
          },
          // component: {
          //   name: 'a-input',
          // },
        },
        cron: {
          title: 'Cron 规则',
          type: 'text',
          key: 'cron',
          column: { width: 120 },
          form: {
            show: compute(({ form }) => {
              return form.taskType ? false : true;
            }),
            helper: { text: '书写标准的cron规则，格式： 0/5 * * * * ? ' },
            component: { placeholder: '*/秒 */分钟 */小时 */天 */月 */年' },
          },
        },
        startDate: {
          title: '开始时间',
          column: { show: false },
          form: {
            show: compute(({ form }) => {
              return form.taskType ? true : false;
            }),
            component: {
              name: 'a-date-picker',
              props: {
                //type: 'date',
                format: 'YYYY-MM-DD HH:mm:ss',
              },
            },
            helper: { text: ' 任务开始时间' },
          },
        },

        limit: {
          title: '最大执行次数',
          type: 'number',
          column: { show: false },
          form: {
            component: {
              name: 'a-input-number',
              style: { width: '100%' },
            },
            helper: { text: ' 不传为无限次' },
          },
          //component: { name: 'a-input' },
        },

        endDate: {
          title: '结束时间',
          column: { show: false },
          form: {
            show: compute(({ form }) => {
              return form.taskType ? true : false;
            }),
            component: {
              name: 'a-date-picker',
              props: {
                //type: 'date',
                format: 'YYYY-MM-DD HH:mm:ss',
              },
            },
            helper: { text: ' 任务结束时间' },
          },
        },

        status: {
          title: '状态',
          type: 'dict-radio',
          column: { show: false },
          //component: { name: 'dict-switch' },
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
        data: {
          title: '数据',
          key: 'data',
          column: { show: false },
          form: {
            show: false,
            //component: { name: 'a-input' },
          },
        },
        service: {
          title: '运行实例',
          type: 'text',
          //column: { show: false },
          form: {
            helper: {
              text: '执行的service实例ID',
            },
          },
        },
        type: {
          title: '等级',
          type: 'dict-radio',
          column: { width: 80 },
          dict: dict({
            data: [
              { label: '系统', value: 0, color: 'warning' },
              { label: '用户', value: 1, color: 'success' },
            ],
          }),
          form: {
            value: 1,
            helper: { text: '0:系统 1：用户' },
          },
          //component: { name: 'a-input' },
        },
        nextRunTime: {
          title: '下一次执行时间',
          key: 'nextRunTime',
          column: { show: false },
          form: {
            show: false,
            component: {
              name: 'a-date-picker',
              props: { type: 'datetime', format: 'YYYY-MM-DD HH:mm:ss' },
            },
          },
        },

        remark: {
          title: '备注',
          key: 'remark',
          column: { show: false },
          type: ['textarea', 'rows'],
          // component: {
          //   name: 'el-input',
          //   props: { type: 'textarea', rows: 4 }
          // },
        },
      },
    },
  };
}
