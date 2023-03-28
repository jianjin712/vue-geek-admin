import { ref /* , shallowRef */, h } from 'vue';
import { dict, useColumns, uiContext, compute } from '@fast-crud/fast-crud';
//import { IconPicker } from '/@/components/Icon';
import { useMessage } from '/@/hooks/web/useMessage';
import _ from 'lodash-es';
import { fn } from 'moment/moment';
const { createMessage } = useMessage();

const ui = uiContext.get();

export function useCrudOptions({ expose, curdApi }) {
  console.log(expose);
  return {
    crudOptions: {
      request: {
        pageRequest: async (query) => await curdApi.page(query),
        addRequest: async ({ form }) => await curdApi.add(form),
        editRequest: async ({ form }) => await curdApi.update(form),
        delRequest: async ({ row }) => await curdApi.delete({ ids: [row.id] }),
      },
      table: { show: true },
      toolbar: { show: false },
      actionbar: { show: false },
      search: { show: false },
      //pagination: { show: false },
    },
  };
}

export function createFormOptions(expose) {
  // 自定义表单配置
  const { buildFormOptions } = useColumns();

  const crudOptions = {
    columns: {},
    form: {
      labelCol: { span: 4 },
      wrapperCol: { span: 12 },
      col: { span: 24 },
      mode: 'form',
      group: {
        groupType: 'tabs', //collapse， tabs
        accordion: false,
        animated: { inkBar: true, tabPane: true },
        tabPosition: 'top',
      },
      beforeSubmit: (context) => {
        console.log('context', context);
      },
      doSubmit: (context) => {
        console.log('form submit:', context);
        createMessage.info('自定义表单提交:' + JSON.stringify(context.form));
        //createMessage.success('保存成功');
      },
    },
  };
  return buildFormOptions(crudOptions);
}
/**
 * 表单直接独立使用
 * */
export function useFormDirect(expose, curdApi) {
  const formRef = ref();
  const formOptions = ref();

  const { crudBinding } = expose;

  //console.log('useFormDirect:', crudBinding.columns);

  formOptions.value = createFormOptions(expose);

  const doSubmit = formOptions.value.doSubmit;

  formOptions.value.doSubmit = (context) => {
    // console.log('submit', context);
    //doSubmit(context);
    // //提交成功后，关闭本页面
    console.log('保存成功', context.form);
    curdApi
      .edit(context.form)
      .then((res) => {
        console.log('res', res);
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  formOptions.value.group.onChange = (event) => {
    formRef.value.group.activeKey = event;
    console.log(event);
  };

  function formSubmit() {
    formRef.value.submit();
  }

  function formReset() {
    formRef.value.setFormData({});
    formRef.value.reset();
  }

  function setFormData() {
    formRef.value.setFormData(formOptions.value.initialForm);
  }

  function CrudHandler(item) {
    let dictData = [];
    if (!_.isEmpty(item.store_range)) {
      const arr = item.store_range.split('\n');
      dictData = arr.map((e) => {
        const [value, text] = e.split('|');
        const d = {
          label: text.toString(),
          value: isNaN(Number(value)) ? String(value) : String(value),
        };
        return d;
      });
      //console.log('dictData', dictData);
    }

    const type = item.type;
    let fu = {};
    switch (type) {
      case 'text':
        fu = {
          type: 'text',
          component: {
            name: 'a-input',
            vModel: 'value',
            allowClear: true,
            placeholder: item?.explain ?? item.explain,
          },
        };
        break;
      case 'textarea':
        fu = {
          type: 'textarea',
          component: {
            name: 'a-textarea',
            row: 4,
            vModel: 'value',
            allowClear: true,
            placeholder: item?.explain ?? item.explain,
          },
          // helper: {
          //   text: item?.explain ?? item.explain,
          // },
        };
        break;
      case 'image':
      case 'pic':
      case 'image-uploader':
        fu = {
          type: 'file-uploader',
          component: {
            name: 'fs-file-uploader',
            limit: 1,
            uploader: {
              type: 'form',
            },
            listType: ui.upload.typeImageCard,
            accept: '*.png,*.jpeg,*.jpg,*.gif,*.webp,*.svg',
          },
          //helper: '传1个文件',
        };
        break;
      case 'radio':
      case 'dict-radio':
        if (dictData.length > 0) {
          fu = {
            type: 'dict-radio',
            component: {
              name: 'fs-dict-radio',
              vModel: ui.radioGroup.modelValue,
              [ui.select.clearable]: true,
              dict: dict({
                data: dictData,
                //url: '/sys/open/getDictCode?code=STATUS',
              }),
              onChange: (e) => {
                //动态onChange方法测试
                console.log('onChange', e.target);
                console.log('item', item);
              },
            },
            // valueBuilder({ value, row, key }) {
            //   if (!_.isNull(value)) {
            //     row[key] = value === 1 ? '1' : '0';
            //   }
            // },
          };
        } else {
          fu = {
            type: 'dict-radio',
          };
        }
        break;
      case 'options':
      case 'dict-select':
        fu = {
          type: 'dict-select',
          component: {
            name: 'fs-dict-select',
            vModel: ui.select.modelValue,
            [ui.select.clearable]: true,
            dict: dict({
              data: dictData,
            }),
          },
        };
        break;
    }
    return fu;
  }

  async function getConfig() {
    const options = {
      groups: {},
      columns: {},
      activeKey: '',
      //data: [],
      initialForm: [],
    };
    return await curdApi.getGroups().then((res) => {
      res.map((row) => {
        const children = row.children.map((child) => {
          return child.field;
        });
        options.groups[row.field] = {
          title: row.title,
          //header: row.title,
          tab: row.title,
          key: row.field,
          columns: [...children],
        };

        row.children.map((item) => {
          //options.data.push(item);
          options.initialForm[item.field] = item.value;
          //formOptions.value.columns[item.field] = {
          /*  let isTable = {};
          const tableColumn = ['title', 'name', 'field', 'type', 'value', 'store_range', 'explain'];
          Object.keys(item).forEach((key) => {
            if (!tableColumn.includes(key)) {
              console.log('item', key);
              isTable = {
                column: { show: true, width: 'auto', content: true },
              };
            }
          }); */
          options.columns[item.field] = {
            title: item.title,
            //key: item.id,
            //id: item.id,
            //...isTable,
            ...CrudHandler(item),
            // valueResolve(context) {
            //   console.log('valueResolve', context);
            // },
          };
        });
      });

      //formOptions.value.group.activeKey =
      options.activeKey = Object.keys(options.groups)[0];
      // formOptions.value.columns = options.columns;
      //formOptions.value.group.groups = options.groups;
      // formOptions.value.initialForm = options.data;
      // console.log(options.columns);
      const optionsA = {
        columns: options.columns,
        //form: {
        group: {
          activeKey: options.activeKey,
          groups: options.groups,
          groupType: 'tabs', //collapse， tabs
          accordion: false,
          animated: { inkBar: true, tabPane: true },
          tabPosition: 'top',
        },
        //},
        //data: options.data,
        initialForm: options.initialForm,
      };
      _.merge(formOptions.value, optionsA);
      return formOptions.value;
    });
  }

  return {
    formOptions,
    formRef,
    formSubmit,
    setFormData,
    formReset,
    getConfig,
  };
}
