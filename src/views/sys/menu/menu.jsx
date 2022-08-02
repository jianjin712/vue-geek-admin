import { ref, shallowRef } from 'vue';
import { dict, compute, uiContext, useColumns } from '@fast-crud/fast-crud';
import { IconPicker } from '/@/components/Icon';

function createFormOptions(expose) {
  // 自定义表单配置
  const { buildFormOptions } = useColumns();
  const ui = uiContext.get();
  //使用crudOptions结构来构建自定义表单配置
  //console.log('expose', expose);
  return buildFormOptions({
    columns: {
      id: {
        title: 'ID',
        type: 'number',
        form: {
          show: false,
        },
      },
      parentId: {
        title: '上级ID',
        type: 'number',
        form: {
          component: {
            name: 'a-input',
            disabled: true,
            placeholder: '请填写上级ID',
          },
          rules: [{ required: true, message: '此项必填' }],
        },
      },
      label: {
        title: '名称',
        type: 'text',
        form: {
          component: {
            name: 'a-input',
            vModel: 'value',
            allowClear: true,
            placeholder: '请输入名称',
          },
          rules: [{ required: true, message: '此项必填' }],
        },
      },
      icon: {
        title: '图标',
        type: 'text',
        form: {
          component: {
            name: shallowRef(IconPicker),
            vModel: 'value',
            allowClear: true,
            placeholder: '请点击右侧图标选择',
          },
          rules: [{ required: true, message: '此项必填' }],
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
          value: 1,
          helper: {
            position: 'label',
            text: '菜单节点类型规划',
          },
        },
      },
      path: {
        title: '路径',
        type: 'a-input',
        form: {
          show: compute(({ form }) => {
            return form.type === 1;
          }),
          component: {
            vModel: ui.input.modelValue,
            placeholder: '路径内容填写 http 地址则为外链网页',
          },
          helper: {
            position: 'label',
            text: '菜单路由路径',
          },
        },
      },
      entity: {
        title: '实体',
        type: 'dict-select',
        dict: dict({
          data: expose.eps.entities,
        }),
        form: {
          show: compute(({ form }) => {
            return form.type === 1;
          }),
          component: {
            //name: shallowRef(FsTable),
            //vModel: 'modelValue',
            vModel: ui.input.modelValue,
            placeholder: '请选择数据表模型',
            onChange: compute(({ form }) => {
              //动态onChange方法测试
              return () => {
                form.path = expose.eps.path[form.entity];
              };
              //console.log('onChange', form.path);
            }),
          },
          helper: {
            position: 'label',
            text: '实体，是后端的数据表模型，可以自动关联内置或自定义权限节点',
          },
        },
      },
      perms: {
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
      },
      component: {
        title: '组件',
        type: 'a-input',
        form: {
          value: 'Layout',
          show: compute(({ form }) => {
            return form.type === 1;
          }),
          component: {
            vModel: ui.input.modelValue,
            placeholder: '请填写组件',
          },
          helper: {
            position: 'label',
            text: '填写 Layout 则为页面布局, 填写 http 地址则为内嵌网页',
          },
        },
      },
      status: {
        title: '状态',
        type: 'dict-radio',
        form: {
          value: 1,
          // component: {
          //   placeholder: '请选择状态',
          // },
          helper: {
            position: 'label',
            // tooltip: {
            //   placement: 'topLeft',
            // },
            text: '状态开关',
          },
        },
        dict: dict({
          data: [
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 },
          ],
        }),
      },
      global: {
        title: '全局',
        type: 'dict-radio',
        form: {
          value: 0,
          helper: {
            position: 'label',
            text: '无需权限分配，所有账户默认授权此操作',
          },
          component: {
            options: [
              { label: '是', value: 1 },
              { label: '否', value: 0 },
            ],
          },
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
      // labelCol: { span: 24 },
      // wrapperCol: { span: 24 },
      // col: { span: 18 },
      display: 'fixed',
      // labelWidth: 24,
      col: { span: 24 },
      //display: 'fixed',
      // labelCol: { span: 5 },
      // wrapperCol: { span: 18 },
      // col: { span: 12 },
      // display: 'grid',
      // group: {
      //   groupType: 'tabs', //collapse， tabs
      //   accordion: false,
      //   groups: {
      //     testGroupName: {
      //       tab: '分组测试',
      //       columns: ['path', 'component'],
      //     },
      //     demoGroupName: {
      //       tab: '分组测试2',
      //       columns: ['description'],
      //     },
      //   },
      // },

      // doSubmit({ form }) {
      //   console.log('form submit:', form);
      //   SaveOrUpdate(form);
      //   //message.info('自定义表单提交:' + JSON.stringify(form));
      //   //message.success('保存成功');
      // },
    },
  });
}
/**
 * 表单直接独立使用
 * */
export function useFormDirect(expose) {
  const formRef = ref();
  const formOptions = ref();
  formOptions.value = createFormOptions(expose);

  const doSubmit = formOptions.value.doSubmit;

  formOptions.value.doSubmit = (context) => {
    console.log('submit', context);
    doSubmit(context);
    //提交成功后，关闭本页面
    console.log('保存成功', context);
  };

  function formSubmit() {
    formRef.value.submit();
  }

  function formReset() {
    formRef.value.reset();
  }

  function setFormAdd(node) {
    const id = node?.id || 0;
    formRef.value.reset();
    //setFormData({ parentId: id });
    formRef.value.setFormData({ parentId: id });
  }

  function setFormData(formData) {
    delete formData?.meta;
    delete formData?.name;
    delete formData?.children;
    // const data = formData.map((item) => {
    //   if (!isObject(item)) {
    //     return item;
    //   }
    // });
    // console.log(formData);
    //console.log(formData);
    formRef.value.setFormData(formData);
  }

  return {
    formOptions,
    formRef,
    formSubmit,
    setFormData,
    setFormAdd,
    formReset,
  };
}

export function defaultS({ expose, service }) {
  const ui = uiContext.get();

  return {
    menuCrudOptions: {
      columns: {
        id: {
          title: 'ID',
          type: 'number',
          form: {
            show: false,
          },
        },
        parentId: {
          title: '上级ID',
          type: 'number',
          form: {
            component: {
              name: 'a-input',
              disabled: true,
              placeholder: '请填写上级ID',
            },
            rules: [{ required: true, message: '此项必填' }],
          },
        },
        label: {
          title: '名称',
          type: 'text',
          form: {
            component: {
              name: 'a-input',
              vModel: 'value',
              allowClear: true,
              placeholder: '请输入名称',
            },
            rules: [{ required: true, message: '此项必填' }],
          },
        },
        icon: {
          title: '图标',
          type: 'text',
          form: {
            component: {
              name: shallowRef(IconPicker),
              vModel: 'value',
              allowClear: true,
              placeholder: '请点击右侧图标选择',
            },
            rules: [{ required: true, message: '此项必填' }],
          },
        },
        type: {
          title: '类型',
          type: 'dict-radio',
          dict: dict({
            data: [
              {
                label: '目录',
                value: 0,
              },
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
            value: 0,
            helper: {
              position: 'label',
              text: '菜单节点类型规划',
            },
          },
        },
        path: {
          title: '路径',
          type: 'a-input',
          form: {
            show: compute(({ form }) => {
              return form.type === 1;
            }),
            component: {
              vModel: ui.input.modelValue,
              placeholder: '路径内容填写 http 地址则为外链网页',
            },
            helper: {
              position: 'label',
              text: '菜单路由路径',
            },
          },
        },
        entity: {
          title: '实体',
          type: 'dict-select',
          dict: dict({
            //data: expose.eps.entities,
            data: [],
          }),
          form: {
            show: compute(({ form }) => {
              return form.type === 1;
            }),
            component: {
              //name: shallowRef(FsTable),
              //vModel: 'modelValue',
              vModel: ui.input.modelValue,
              placeholder: '请选择数据表模型',
              onChange: compute(({ form }) => {
                //动态onChange方法测试
                // return () => {
                //   form.path = expose.eps.path[form.entity];
                // };
                //console.log('onChange', form.path);
              }),
            },
            helper: {
              position: 'label',
              text: '实体，是后端的数据表模型，可以自动关联内置或自定义权限节点',
            },
          },
        },
        perms: {
          title: '权限节点',
          type: 'dict-checkbox',
          dict: dict({
            data: compute((context) => {
              //根据cellSwitch字段显隐
              //return expose.eps.api[context.form.entity];
            }),
          }),
          form: {
            show: compute((context) => {
              //根据cellSwitch字段显隐
              if (context.form.entity) {
                //return expose.eps.api[context.form.entity] ? true : false;
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
        },
        component: {
          title: '组件',
          type: 'a-input',
          form: {
            value: 'Layout',
            show: compute(({ form }) => {
              return form.type === 1;
            }),
            component: {
              vModel: ui.input.modelValue,
              placeholder: '请填写组件',
            },
            helper: {
              position: 'label',
              text: '填写 Layout 则为页面布局, 填写 http 地址则为内嵌网页',
            },
          },
        },
        status: {
          title: '状态',
          type: 'dict-radio',
          form: {
            value: 1,
            // component: {
            //   placeholder: '请选择状态',
            // },
            helper: {
              position: 'label',
              // tooltip: {
              //   placement: 'topLeft',
              // },
              text: '状态开关',
            },
          },
          dict: dict({
            data: [
              { label: '启用', value: 1 },
              { label: '禁用', value: 0 },
            ],
          }),
        },
        global: {
          title: '全局',
          type: 'dict-radio',
          form: {
            value: 0,
            helper: {
              position: 'label',
              text: '无需权限分配，所有账户默认授权此操作',
            },
            component: {
              options: [
                { label: '是', value: 1 },
                { label: '否', value: 0 },
              ],
            },
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
        mode: 'addForm',
        // labelCol: { span: 24 },
        // wrapperCol: { span: 24 },
        // col: { span: 18 },
        display: 'fixed',
        // labelWidth: 24,
        col: { span: 24 },
        //display: 'fixed',
        // labelCol: { span: 5 },
        // wrapperCol: { span: 18 },
        // col: { span: 12 },
        // display: 'grid',
        // group: {
        //   groupType: 'tabs', //collapse， tabs
        //   accordion: false,
        //   groups: {
        //     testGroupName: {
        //       tab: '分组测试',
        //       columns: ['path', 'component'],
        //     },
        //     demoGroupName: {
        //       tab: '分组测试2',
        //       columns: ['description'],
        //     },
        //   },
        // },

        // doSubmit({ form }) {
        //   console.log('form submit:', form);
        //   SaveOrUpdate(form);
        //   //message.info('自定义表单提交:' + JSON.stringify(form));
        //   //message.success('保存成功');
        // },
      },
    },
  };
}
