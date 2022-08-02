import { createWriteStream } from 'fs';
import prettier from 'prettier';
import { join } from 'path';
import { createDir } from '../../utils';
import rules from './rules';
import { isFunction, isRegExp, isString } from 'lodash';

// 格式化
function format(data: any) {
  //const prop = data.prop;
  const result = {
    title: data.label,
    prop: data.prop,
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

const dict = ({}) => {};

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
      },
    };

    // 默认值
    if (list[0]) {
      d.form.value = list[0].value;
    }

    // 匹配组件
    d.form.component.name = arr.length > 4 ? 'dict-select' : 'dict-radio';

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

    switch (form.component.name) {
      case 'dict-select':
        form.component.props.multiple = true;
        form.component.props.filterable = true;
        break;
      case 'dict-radio':
        form.component.name = 'el-checkbox-group';
        break;
    }

    return {
      table,
      form,
    };
  },
};

// 创建组件
function createComponent(item: any) {
  const { propertyName: dataIndex, comment: title } = item;

  let d: any = null;

  rules.forEach((r: any) => {
    const s = r.test.find((e: any) => {
      if (isRegExp(e)) {
        return e.test(dataIndex);
      }

      if (isFunction(e)) {
        return e(dataIndex);
      }

      if (isString(e)) {
        const re = new RegExp(`${e}$`);
        return re.test(dataIndex.toLocaleLowerCase());
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

  function parse(v: any) {
    if (v?.name) {
      return {
        title,
        //dataIndex,
        key: dataIndex,
        component: v,
      };
    } else {
      return {
        title,
        //dataIndex,
        key: dataIndex,
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
function getPageName(router: string) {
  if (router.indexOf('/') === 0) {
    router = router.substr(1, router.length);
  }

  return router ? router.replace('/', '-') : '';
}

// 时间合并
function datetimeMerge({ columns, item }: any) {
  if (['startTime', 'startDate'].includes(item.prop)) {
    const key = item.prop.replace('start', '');

    if (columns.find((e: any) => e.propertyName == 'end' + key)) {
      item.prop = key.toLocaleLowerCase();
      const isTime = item.prop == 'time';
      item.label = isTime ? '时间范围' : '日期范围';
      item.hook = 'datetimeRange';
      item.component = {
        name: 'el-date-picker',
        props: {
          type: isTime ? 'datetimerange' : 'daterange',
          valueFormat: isTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD 00:00:00',
          defaultTime: [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)],
        },
      };
    }
  }
}

// 创建文件
export async function createMenu({ columns, prefixs, api, module, filename }: any) {
  const upsert: any = {
    items: {},
  };

  // const table: any = {
  //   columns: [],
  // };

  // 遍历
  columns.forEach((e: any) => {
    // 组件
    const { item /* , column */ }: any = createComponent(e);

    //const field = e.propertyName;
    //fscurd.columns.push([e.propertyName, { title: e.comment, type: e.type }]);

    // 验证规则
    if (!e.nullable) {
      item.form = {
        required: true,
      };
    }

    // 忽略部分字段
    if (!['createTime', 'updateTime', 'id', 'endTime', 'endDate'].includes(item.key)) {
      //datetimeMerge({ columns, item });

      if (!item.component) {
        item.component = {
          name: 'a-input',
        };
      }

      upsert.items[item.key] = format(item);
    }

    //if (!['cl-codemirror', 'cl-editor-quill'].includes(column.component?.name)) {
    //crud.columns.push(format(column));
    //}
  });
  //console.log(upsert.items);
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
    import { useExpose, useCrud } from '@fast-crud/fast-crud';
    import { useCode } from '/@/geek/index';
    //import createCrudOptions from './crud';
    //import { shallowRef } from 'vue';
    //import { dict, compute } from '@fast-crud/fast-crud';

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
