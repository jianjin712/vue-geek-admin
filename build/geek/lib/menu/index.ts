import { createWriteStream } from 'fs';
import prettier from 'prettier';
import { join } from 'path';
import { createDir } from '../../utils';
import rules from './rules';
import { isFunction, isRegExp, isString } from 'lodash';
// import beautifier from 'beautifier';
// import { beautifierConf, buildScript, buildStyle } from '../../utils';

// 格式化
function format(data: any) {
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

const dict = (config: any) => {
  return config;
};

// 组件处理器
const handler = {
  // 单选
  dict({ comment }) {
    const [title, ...arr] = comment.split(' ');

    // 选择列表
    const list = arr.map((e: string, i: number) => {
      const [value, label] = e.split(':');
      const d: any = {
        label,
        value: isNaN(Number(value)) ? value : Number(value),
      };

      if (i > 0 && colors[i]) {
        d.color = colors[i];
      }

      return d;
    });

    const d: any = {
      columns: {
        title,
        dict: dict({
          data: list,
        }),
      },
      form: {
        title,
        // component: {
        //   name: '',
        //   options: list,
        // },
        dict: dict({
          data: list,
        }),
        // valueBuilder: ({ value, row, key }) => {
        //   if (value != null) {
        //     row[key] = value === 1 ? '1' : '0';
        //   }
        // },
      },
    };

    // 默认值
    if (list[0]) {
      //d.form.value = list[0].value;
      d.form.addForm.value = list[0].value;
    }

    // 匹配组件
    //d.form.component.name = arr.length > 4 ? 'dict-select' : 'dict-radio';
    d.form.type = arr.length > 4 ? 'dict-select' : 'dict-radio';

    return d;
  },

  // 多选
  dict_multiple({ comment }) {
    const { table, form }: any = handler.dict({ comment });

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

// function createCrud(item: any) {
//   let crudOptions: any = {};
//   crudOptions = { title: item.title };
//   if (item.key == 'status') {
//     crudOptions.type = 'dict-radio';
//     crudOptions.dict = `dict({
//             url: '/sys/open/getDictCode?code=STATUS',
//           })`;
//     crudOptions.valueBuilder = `({ value, row, key }) => {
//             if (value != null) {
//               row[key] = value === '1' ? 1 : 0;
//             }
//           }`;
//   }
//   return crudOptions;
// }

// 创建组件
function createComponent(item: any) {
  const { propertyName: field, comment: title /* , type */ } = item;
  // propertyName: 'id', type: 'number', length: '', comment: 'ID', nullable: false
  // {propertyName: 'name', type: 'string', length: '', comment: '菜单名称', nullable: false}
  // {propertyName: 'type', type: 'tinyint', length: '', comment: '类型 0：目录 1：菜单 2：按钮', nullable: false}

  let d: any = null;

  rules.forEach((r: any) => {
    const s = r.test.find((e: any) => {
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

      console.log(field, s, r, d);
      console.log('\n\n++++++++++++++++\n\n');
    }
  });

  function parse(v: any) {
    if (v?.type) {
      return {
        title,
        key: field,
        ...v,
        //column: {},
        //search: {},
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

  return {
    column: parse(d?.table),
    item: parse(d?.form),
  };
}

// 获取页面标识
// function getPageName(router: string) {
//   if (router.indexOf('/') === 0) {
//     router = router.substr(1, router.length);
//   }

//   return router ? router.replace('/', '-') : '';
// }

// 时间合并
// function datetimeMerge({ columns, item }: any) {
//   if (['startTime', 'startDate'].includes(item.prop)) {
//     const key = item.prop.replace('start', '');

//     if (columns.find((e: any) => e.propertyName == 'end' + key)) {
//       item.prop = key.toLocaleLowerCase();
//       const isTime = item.prop == 'time';
//       item.label = isTime ? '时间范围' : '日期范围';
//       item.hook = 'datetimeRange';
//       item.component = {
//         name: 'el-date-picker',
//         props: {
//           type: isTime ? 'datetimerange' : 'daterange',
//           valueFormat: isTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD 00:00:00',
//           defaultTime: [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)],
//         },
//       };
//     }
//   }
// }

// const dictSTATUS = dict({
//   url: '/sys/open/getDictCode?code=STATUS',
// });

export function makeUpJs(e) {
  const { propertyName, comment, nullable } = e;
  const item: any = {
    title: null,
    type: '',
    column: [],
    form: [],
    dict: [],
  };

  item.title = comment;
  item.type = e.type;

  if (nullable) {
    item.form.push(` rules: [{ required: true, message: "此项必填" }] `);
  }

  if (['status'].includes(propertyName)) {
    item.dict.push(` dict({  url: '/sys/open/getDictCode?code=STATUS', }) `);
  }

  return {
    item,
  };
}

// 创建文件 { columns, prefixs, api, module, filename }
export async function createMenu(post: any) {
  const upsert: any = {
    items: {},
  };

  const { columns, prefixs, filename, module } = post;

  // const table: any = {
  //   columns: [],
  // };

  //try {
  // 遍历
  columns.forEach((e: any) => {
    // 组件
    const { item /* , column */ }: any = createComponent(e);

    //const field = e.propertyName;
    //fscurd.columns.push([e.propertyName, { title: e.comment, type: e.type }]);

    // 验证规则
    if (e.nullable) {
      item.form = {
        rules: [{ required: true, message: '此项必填' }],
      };
    }

    // if (['status'].includes(item.key)) {
    //   item.dict = 'dict(${dictSTATUS})';
    //   item.valueBuilder = `({ value, row, key }) => {
    //     if (value != null) {
    //           row[key] = value === 1 ? '1' : '0';
    //       }
    //   }`;
    // }

    // 忽略部分字段
    if (![/*'createTime', 'updateTime',*/ 'id', 'endTime', 'endDate'].includes(item.key)) {
      //datetimeMerge({ columns, item });

      // if (!item.component) {
      //   item.component = {
      //     name: 'a-input',
      //   };
      // }

      upsert.items[item.key] = format(item);
    }

    //if (!['cl-codemirror', 'cl-editor-quill'].includes(column.component?.name)) {
    //crud.columns.push(format(column));
    //}
  });
  // } catch (e) {
  //   console.error(e);
  // }

  // 服务
  const service = 'service' + prefixs.split('/').join('.');

  const tempCrud = `
  function createCrudOptions({ expose, service }) {
    const curdApi = ${service};
    return {
      expose,
      crudOptions: {
        request: {
          pageRequest: async (query) => await curdApi.page(query),
          addRequest: async ({ form }) => await curdApi.add(form),
          editRequest: async ({ form }) => await curdApi.update(form),
          delRequest: async ({ row }) => await curdApi.delete({ ids: [row.id] }),
        },
        columns: ${JSON.stringify(upsert.items)}
      },
    };
  }`;

  // 代码模板
  const temp = `
  <template>
    <fs-crud ref="crudRef" v-bind="crudBinding" />
  </template>

  <script>
    import { defineComponent, ref, onMounted } from 'vue';
    import { useExpose, useCrud, dict, compute } from '@fast-crud/fast-crud';
    import { useCode } from '/@/geek/index';
    //import createCrudOptions from './crud';
    //import { shallowRef } from 'vue';

    ${tempCrud}

  export default defineComponent({
    setup() {
      // crud 配置的ref
      const crudRef = ref();
      const crudBinding = ref();
      const { service } = useCode();
      const { expose } = useExpose({ crudRef, crudBinding });
      // 你的crud配置
      const { crudOptions } = createCrudOptions({ expose, service });
      useCrud({ expose, crudOptions });

      // 页面打开后获取列表数据
      onMounted(() => {
        expose.doRefresh();
      });

      return {
        crudBinding,
        crudRef,
      };
    },
  });
  </script>`;

  const vue = prettier.format(temp, {
    parser: 'vue',
    printWidth: 100,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    vueIndentScriptAndStyle: true,
    singleQuote: true,
    quoteProps: 'as-needed',
    bracketSpacing: true,
    trailingComma: 'es5',
    bracketSameLine: false,
    jsxSingleQuote: false,
    arrowParens: 'always',
    insertPragma: false,
    requirePragma: false,
    proseWrap: 'never',
    htmlWhitespaceSensitivity: 'strict',
    endOfLine: 'lf',
    rangeStart: 0,
  });

  // const crud = prettier.format(tempCrud, {
  //   parser: 'typescript',
  //   useTabs: false,
  //   tabWidth: 2,
  //   endOfLine: 'lf',
  //   semi: true,
  //   bracketSameLine: false,
  //   jsxSingleQuote: false,
  //   singleQuote: true,
  //   printWidth: 100,
  //   trailingComma: 'es5',
  // });

  // views 目录是否存在
  const dir = join(__dirname, `../../../../src/views/${module}/${filename}`);
  // 创建目录
  createDir(dir);

  // 创建crud文件
  // createWriteStream(join(dir, `crud.jsx`), {
  //   flags: 'w',
  // }).write(crud);

  // 创建文件
  createWriteStream(join(dir, `index.vue`), {
    flags: 'w',
  }).write(vue);
}
