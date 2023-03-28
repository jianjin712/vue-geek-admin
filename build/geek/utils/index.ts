import fs from 'fs';

// 首字母大写
export function firstUpperCase(value: string): string {
  return value.replace(/\b(\w)(\w*)/g, function ($0, $1, $2) {
    return $1.toUpperCase() + $2;
  });
}

// 横杠转驼峰
export function toCamel(str: string): string {
  return str.replace(/([^-])(?:-+([^-]))/g, function ($0, $1, $2) {
    return $1 + $2.toUpperCase();
  });
}

// 创建目录
export function createDir(path: string) {
  if (!fs.existsSync(path)) fs.mkdirSync(path);
}

// 读取文件
export function readFile(name: string) {
  try {
    return fs.readFileSync(name, 'utf8');
  } catch (e) {}

  return '';
}

// 解析body
export function parseJson(req: any) {
  return new Promise((resolve) => {
    let d = '';
    req.on('data', function (chunk: Buffer) {
      d += chunk;
    });
    req.on('end', function () {
      try {
        resolve(JSON.parse(d));
      } catch {
        resolve({});
      }
    });
  });
}

/* 代码美化配置 */
export const beautifierConf = {
  html: {
    indent_size: '2',
    indent_char: ' ',
    max_preserve_newlines: '-1',
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: 'separate',
    brace_style: 'end-expand',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: true,
    wrap_line_length: '110',
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true,
  },
  js: {
    indent_size: '2',
    indent_char: ' ',
    max_preserve_newlines: '-1',
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: 'normal',
    brace_style: 'end-expand',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: true,
    end_with_newline: true,
    wrap_line_length: '110',
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true,
  },
};

/* 组件校验触发方式配置
 * todo 1 */
export const ruleTrigger = {
  text: 'blur',
  number: 'blur',
  textarea: 'blur',
  password: 'blur',
  radio: 'change',
  checkbox: 'change',
  select: 'change',
  cascader: 'change',
  rate: 'change',
  'time-picker': 'change',
  'date-picker': 'change',
  'range-picker': 'change',
  upload: 'change',
  tinymce: 'blur',
  treeSelect: 'change',
  'month-picker': 'change',
  tmap: 'change',
};

export function buildScript(child) {
  return `<script>\n${child}\n</script>`;
}

export function buildStyle(child) {
  return `<style scoped lang="less">\n${child}\n</style>`;
}

/**
 * 组装js 【入口函数】
 * @param {Object} formConfig 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 */
let confGlobal;

export function makeUpJs(formConfig) {
  confGlobal = JSON.parse(JSON.stringify(formConfig));
  /* 混入方法 */
  const methodList = []; //mixinMethod();
  /* 钩子 */
  const mountedList = [];
  /* data */
  const dataList = [];
  /* optionList */
  const optionList = [];
  /* rules */
  const ruleList = [];

  confGlobal.list.forEach((el) => {
    buildAttributes(el, dataList, ruleList, methodList, optionList, mountedList);
  });

  const script = build(
    confGlobal.config,
    dataList.join('\n'),
    ruleList.join('\n'),
    methodList.join('\n'),
    optionList.join('\n'),
    mountedList.join('\n')
  );
  confGlobal = null;
  return script;
}

// js整体拼接
function build(conf, data, rules, methods, options, mounted) {
  const str = `export default {
  data () {
    return {
      spinning: true,
      confirmLoading: false,
      ${modal(conf)}
      default${upper(conf.formModel)}: {
        ${data}
      },
      ${conf.formModel}: {},
      ${conf.formRules}: {
        ${rules}
      },
      ${options}
    }
  },
  /*computed: {},
  watch: {},
  created () {
    this.${conf.formModel} = Object.assign({}, this.default${upper(conf.formModel)})

    /*仅用于预览测试，开发中请删除。*/
    this.showModal && this.showModal()
  },
  mounted () {
    ${mounted}
  },
  methods: {
    ${methods}
  }*/
}`;
  return str;
}

function isArray(obj) {
  if (obj instanceof Array) {
    return true;
  }
  return false;
}

function modal(conf) {
  if (conf.showType === '2' || conf.showType === '3') {
    return `
      visible: false,`;
  }
  if (conf.showType === '4') {
    return `
      visible: false,`;
  }
  return '';
}
function upper(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}
