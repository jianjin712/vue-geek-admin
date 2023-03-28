import { ref, shallowRef } from 'vue';
import { dict, uiContext, compute, useColumns, useExpose } from '@fast-crud/fast-crud';
import { IconPicker } from '/@/components/Icon';
import { deepTree } from '/@/utils';
import { last, isEmpty, isFunction, isRegExp, isString } from 'lodash-es';

import rules from '/build/geek/lib/menu/rules';

// 格式化
function format(data) {
  //const prop = data.prop;
  const result = {
    title: data.label,
    //prop: data.prop,
    ...data,
    //component: data.component,
  };
  return result;
}
// 颜色
const colors = [
  '#409EFF',
  '#67C23A',
  '#E6A23C',
  '#F56C6C',
  '#909399',
  '#B0CFEB',
  '#FF9B91',
  '#E6A23C',
  '#BFAD6F',
  '#FB78F2',
];

const dictFn = 'dict';

// 组件处理器
const handler = {
  // 单选
  dict({ comment }) {
    const [title, ...arr] = comment.split(' ');

    // 选择列表
    const list = arr.map((e, i) => {
      const [value, label] = e.split(':');
      const d = {
        label,
        value: isNaN(Number(value)) ? value : Number(value),
      };

      if (colors[i]) {
        d.color = colors[i];
      }

      return d;
    });
    //console.log(list);

    const d = {
      columns: {
        title,
        dict: dict({
          //data: list,
          url: '/sys/open/getDictCode?code=STATUS',
        }),
      },
      form: {
        title,
        // component: {
        //   name: '',
        //   options: list,
        // },
        dict:
          dictFn +
          `({
          url: '/sys/open/getDictCode?code=STATUS',
        })`,
        // valueBuilder: ({ value, row, key }) => {
        //   if (value != null) {
        //     row[key] = value === 1 ? '1' : '0';
        //   }
        // },
      },
    };

    // 默认值
    // if (list[0]) {
    //   //d.form.value = list[0].value;
    //   d.form.addForm.value = list[0].value;
    // }

    // 匹配组件
    //d.form.component.name = arr.length > 4 ? 'dict-select' : 'dict-radio';
    d.form.type = arr.length > 4 ? 'dict-select' : 'dict-radio';

    return d;
  },

  // 多选
  dict_multiple({ comment }) {
    const { table, form } = handler.dict({ comment });

    if (!form.component.props) {
      form.component.props = {};
    }

    if (!form.value) {
      form.value = [];
    }

    switch (form.type) {
      case 'dict-select':
        form.component.props.multiple = true;
        form.component.props.filterable = true;
        break;
      case 'dict-radio':
        form.component.name = 'a-radio-group';
        break;
    }

    return {
      table,
      form,
    };
  },
};

function createComponent(item) {
  const { propertyName: field, comment: title /* , type */ } = item;
  // propertyName: 'id', type: 'number', length: '', comment: 'ID', nullable: false
  // {propertyName: 'name', type: 'string', length: '', comment: '菜单名称', nullable: false}
  // {propertyName: 'type', type: 'tinyint', length: '', comment: '类型 0：目录 1：菜单 2：按钮', nullable: false}

  let d = null;

  rules.forEach((r) => {
    const s = r.test.find((e) => {
      if (isRegExp(e)) {
        return e.test(field);
      }

      if (isFunction(e)) {
        return e(field);
      }

      if (isString(e)) {
        const re = new RegExp(`${e}$`);
        return re.test(field.toLocaleLowerCase());
      }

      return false;
    });

    if (s) {
      if (r.handler) {
        const fn = isString(r.handler) ? handler[r.handler] : r.handler;

        if (isFunction(fn)) {
          d = fn(item);
        }
      } else {
        d = {
          ...r,
          test: undefined,
        };
      }
    }
  });

  function parse(v) {
    //console.log('parse', ...v);
    if (v?.type) {
      return {
        title,
        key: field,
        ...v,
        //column: {},
        search: {},
        // addForm: {},
        // editForm: {},
      };
    } else {
      return {
        title,
        type: 'text',
        key: field,
        ...v,
      };
    }
  }

  function queue(v) {
    let list = [];
    if (v?.type) {
      //console.log('list', ...v);
      list.push(`title : ${title}`);
      list.push(`type : ${v?.type ?? 'text'}`);
      if (v?.type === 'dict-radio') {
        list.push(`dict : dict({ 'url': '/sys/open/getDictCode?code=STATUS', })`);
        list.push(`valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = value === '1' ? 1 : 0;
            }
          },`);
      }
      console.log(v);
      console.log('\n++++++++++++++++\n');
    } else {
      console.log(v);
      console.log('\n++++++++++++++++\n');
    }
    return list;
  }

  return {
    column: parse(d?.table),
    item: parse(d?.form),
    list: queue(d?.form),
  };
}

const createTest = (post) => {
  const upsert = {
    items: {},
    list: [],
  };

  const { columns } = post;

  // const table = {
  //   columns: [],
  // };

  //try {
  // 遍历
  columns.forEach((e) => {
    // 组件
    const { item, list /* , column */ } = createComponent(e);
    // 验证规则
    if (e.nullable) {
      item.form = {
        rules: [{ required: true, message: '此项必填' }],
      };
    }
    // 忽略部分字段
    if (![/*'createTime', 'updateTime',*/ 'id', 'endTime', 'endDate'].includes(item.key)) {
      upsert.items[item.key] = format(item);
    }
    upsert.list.push(`${item.key}: {${JSON.parse(JSON.stringify(list.join(',')))}},`);
    //}
  });

  return upsert;
};

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

  // console.log(entities[10]);
  // const form = createTest(entities[10]);
  // console.log(JSON.stringify(form.list));
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
            const post = { ...item, ...form };
            console.log('post submit:');
            console.log(post);
            service.sys.menu.add(perms).then(() => {
              service.request({
                url: '/__cool_createMenu',
                proxy: false,
                method: 'POST',
                data: post,
              });
            });
          });
        // .catch((err) => {
        //   ui.message.error(err.message);
        // });
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
