import { ref, shallowRef } from 'vue';
import { dict, uiContext, compute, useColumns, useExpose } from '@fast-crud/fast-crud';
import { IconPicker } from '/@/components/Icon';
import { deepTree } from '/@/utils';
import { last, isEmpty } from 'lodash-es';

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
      if (!isEmpty(e.columns)) {
        const prefixs = e.prefix.replace('/admin/', '/');
        const filename = last(e.prefix.split('/'));
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

  const { columns } = entities[2];
  const columnList = [];
  columns.forEach((e) => {
    columnList[e.propertyName] = {
      title: e.comment,
      type: e.type,
      form: {
        show: true,
        rules: [{ required: e.nullable, message: '必填项目' }],
        helper: {
          text: e.comment,
        },
      },
    };
  });

  console.log(entities);

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
            console.log('form submit:', [item, form]);

            service.sys.menu.add(perms).then(() => {
              service.request({
                url: '/__cool_createMenu',
                proxy: false,
                method: 'POST',
                data: {
                  ...item,
                  ...form,
                },
              });
            });
          })
          .catch((err) => {
            ui.message.error(err.message);
          });
      },
    },
  });
}

export function useModuleForm(service, _eps) {
  const moduleRef = ref();
  const moduleFormOptions = ref();
  // 暴露的方法

  const { expose } = useExpose({ crudRef: moduleRef, crudBinding: moduleFormOptions });
  expose._eps = _eps;
  moduleFormOptions.value = createFormOptions(service, expose);
  function openFormModule() {
    moduleRef.value.open(moduleFormOptions.value);
  }
  return {
    moduleRef,
    openFormModule,
    moduleFormOptions,
  };
}
