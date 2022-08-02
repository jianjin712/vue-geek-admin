import { FormSchema } from '/@/components/Form';

export const schemas: FormSchema[] = [
  {
    field: 'id',
    component: 'InputNumber',
    label: 'ID',
    show: false,
  },
  {
    field: 'parentId',
    component: 'Input',
    label: '上级ID',
    defaultValue: 0,
    componentProps: {
      disabled: true,
      placeholder: '请填写上级ID',
    },
    required: true,
  },
  {
    field: 'label',
    component: 'Input',
    label: '名称',
    componentProps: {
      placeholder: '请输入名称',
    },
    required: true,
  },
  {
    field: 'icon',
    component: 'IconPicker',
    label: '图标',
    componentProps: {
      placeholder: '请选择图标',
    },
    required: true,
  },
  {
    field: 'type',
    component: 'RadioGroup',
    label: '类型',
    helpMessage: ['一键发布则需在开发平台中提前配置一键发布模板'],
    itemProps: {
      extra: '一键发布则需在开发平台中提前配置一键发布模板',
    },
    defaultValue: 1,
    componentProps: {
      options: [
        {
          label: '菜单',
          value: 1,
        },
        {
          label: '一键发布',
          value: 5,
        },
      ],
    },
    required: true,
  },
  {
    field: 'path',
    component: 'Input',
    label: '路径',
    show: ({ model }) => {
      return model.type === 1;
    },
    componentProps: {
      placeholder: '请填写路径',
    },
    itemProps: {
      extra: '路径内容填写 http 地址则为外链网页',
    },
    required: true,
  },
  {
    field: 'component',
    component: 'Input',
    label: '组件',
    helpMessage: ['填写 Layout 则为页面布局', '填写 http 地址则为内嵌网页'],
    show: ({ model }) => {
      return model.type === 1;
    },
    componentProps: {
      placeholder: '请填写组件',
    },
    defaultValue: 'Layout',
    itemProps: {
      extra: '填写 http 地址则为内嵌网页',
    },
    required: false,
  },
  {
    field: 'status',
    component: 'RadioButtonGroup',
    label: '状态',
    defaultValue: 1,
    componentProps: {
      placeholder: '请选择状态',
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
  },
  {
    field: 'global',
    component: 'RadioButtonGroup',
    label: '全局',
    helpMessage: ['所有人都能看到该菜单'],
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
  },
  {
    field: 'orderNum',
    component: 'InputNumber',
    label: '排序',
    defaultValue: 0,
    componentProps: {
      placeholder: '请填写排序',
      min: 0,
      max: 100,
    },
    itemProps: {
      extra: '数值越小优先级越高',
    },
  },
  {
    field: 'description',
    component: 'InputTextArea',
    label: '描述',
    componentProps: {
      placeholder: '请填写描述信息',
      rows: 4,
    },
    required: false,
  },
  {
    field: 'model',
    label: '模块',
    component: 'Select',
    dynamicRules: ({ values }) => {
      return values.field8 ? [{ required: true, message: '字段4必填' }] : [];
    },
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
          key: '1',
        },
        {
          label: '选项2',
          value: '2',
          key: '2',
        },
      ],
      onChange: (e) => {
        console.log('selected:', e);
      },
    },
    required: false,
  },
  {
    field: 'field8',
    component: 'Switch',
    label: '字段4是否必填',
    colProps: {
      span: 8,
    },
    labelWidth: 200,
  },
];
