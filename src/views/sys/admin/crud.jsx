import { dict, compute } from '@fast-crud/fast-crud';
import moment from 'moment';

export default function ({ expose, curdApi }) {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query) => await curdApi.sys.admin.page(query),
        addRequest: async ({ form }) => await curdApi.sys.admin.add(form),
        editRequest: async ({ form }) => await curdApi.sys.admin.update(form),
        delRequest: async ({ row }) => await curdApi.sys.admin.delete(row.id),
      },
      rowHandle: { fixed: 'right' },
      table: {
        scroll: { fixed: true },
        // onFilterChange: (content) => {
        //   const form = expose.getSearchFormData();
        //   form.sex = content.sex[0];
        // },
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        username: {
          title: '账号',
          type: 'text',
          column: { width: 155 },
          search: { show: true, component: { style: { width: '120px' } } },
          form: {
            rules: [
              { required: true, message: '请输入账号名' },
              { min: 4, max: 30, message: '长度在 4 到 30 个字符' },
            ],
          },
        },
        password: {
          title: '密码',
          type: 'text',
          column: { show: false },
          viewForm: {
            show: false,
          },
          editForm: {
            show: false,
          },
          form: {
            rules: [
              { required: true, message: '请输入密码' },
              { min: 6, max: 30, message: '长度在 6 到 30 个字符' },
            ],
          },
        },
        nickName: {
          title: '昵称',
          type: 'text',
          column: { width: 155, ellipsis: true },
          search: { show: true, fixed: 'left', component: { style: { width: '120px' } } },
          form: {
            rules: [
              { required: true, message: '请输入昵称' },
              { min: 2, max: 30, message: '长度在 2 到 30 个字符' },
            ],
          },
        },
        mobile: {
          title: '手机号',
          type: 'text',
          search: { show: true, component: { style: { width: '120px' } } },
          column: { width: 155, align: 'center' },
          form: {
            rules: [
              { required: true, message: '请输入手机号' },
              { min: 11, max: 11, message: '长度在 11 个字符' },
            ],
          },
        },
        sex: {
          title: '性别',
          type: 'dict-radio',
          dict: dict({
            url: '/base/open/getDictCode?code=SEX',
          }),
          // viewForm: {
          //   valueBuilder(context) {
          //     context.form.sex = context.row.sex.toString();
          //   },
          // },
          editForm: {
            valueBuilder(context) {
              context.form.sex = context.row.sex.toString();
            },
          },
          column: {
            width: 100,
            align: 'center',
            filterable: true,
            filterMultiple: false,
            filters: [
              { text: '男', value: 1 },
              { text: '女', value: 2 },
            ],
            sortDirections: ['descend'],
          },
          addForm: {
            value: '1',
          },
        },
        status: {
          title: '状态',
          type: 'dict-radio',
          dict: dict({
            data: [
              { value: 1, label: '启用', color: 'success' },
              { value: 0, label: '禁用', color: 'error' },
            ],
          }),
          column: { width: 80 },
        },
        email: {
          title: '邮箱',
          type: 'text',
          search: { show: true, component: { style: { width: '150px' } } },
          column: { width: 180 },
        },
        avatar: {
          title: '头像',
          type: 'cropper-uploader',
          column: {
            width: 70,
            align: 'center',
            show: false,
          },
          form: {
            component: {
              uploader: {
                type: 'qiniu', // 上传后端类型【cos,aliyun,oss,form】
                buildUrl(res) {
                  return res.url;
                },
              },
            },
          },
        },
        orgId: {
          title: '组织',
          search: { show: false, component: { style: { width: '150px' } } },
          type: 'dict-tree',
          column: {
            width: 180,
            component: {
              style: {
                color: 'red',
              },
            },
          },
          dict: dict({
            isTree: true,
            cache: true,
            url: '/sys/org/tree',
            value: 'id',
            label: 'label',
          }),
          form: {
            component: {
              fieldNames: { children: 'children', title: 'label', key: 'id', value: 'id' },
              showSearch: true,
              filterTreeNode: (val, treeNode) => {
                return treeNode.props.title.toLowerCase().indexOf(val.toLowerCase()) >= 0;
              },
            },
            valueChange({ form, value, getComponentRef }) {
              form.stationId = undefined; // 将“stationId”的值置空
              if (value) {
                // 执行 station_id 的select组件的reloadDict()方法，触发“stationId”重新加载字典
                getComponentRef('stationId').reloadDict();
              }
            },
            valueResolve(context) {
              //value解析，就是把组件的值转化为后台所需要的值
              //在form表单点击保存按钮后，提交到后台之前执行转化
              context.form.orgId = Number(context.form.orgId);
            },
          },
        },
        stationId: {
          title: '岗位',
          type: 'dict-select',
          column: { width: 150 },
          dict: dict({
            cache: true,
            prototype: true,
            value: 'orgId',
            label: 'name',
            // url({ form }) {
            //   if (form && form._i != null) {
            //     // 本数据字典的url是通过前一个select的选项决定的
            //     return `/base/data/stations?status=1&orgId=${form._i}`;
            //   }
            //   return undefined;
            // },
            getData: async ({ form }) => {
              if (form.orgId) {
                return await curdApi.sys.station.list({ orgId: form.orgId }).then((data) => {
                  return data.map((item) => {
                    return { color: 'warning', ...item };
                  });
                });
              }
            },
          }),
          form: {
            // show: compute(({ form }) => {
            //   return !form.orgId;
            // }),
            component: {
              showSearch: true,
              filterOption: (val, form) => {
                return form.label.toLowerCase().indexOf(val.toLowerCase()) >= 0;
              },
            },
            helper: '选择组织后才可以选择岗位哟~~~',
            valueResolve(context) {
              //value解析，就是把组件的值转化为后台所需要的值
              //在form表单点击保存按钮后，提交到后台之前执行转化
              context.form.stationId = Number(context.form.stationId);
            },
          },
        },
        positionStatus: {
          title: '职位状态',
          type: 'dict-select',
          column: { width: 90 },
          dict: dict({
            data: [
              { value: 'WORKING', label: '在职', color: 'success' },
              { value: 'QUIT', label: '离职', color: 'error' },
              { value: 'LEAVE', label: '请假', color: 'warning' },
            ],
          }),
        },
        nation: {
          title: '民族',
          type: 'dict-select',
          column: { width: 90 },
          dict: dict({
            code: 'NATION',
            url: '/base/open/getDictCode?code=NATION',
          }),
          form: {
            component: {
              showSearch: true,
              filterOption: (val, form) => {
                return form.label.toLowerCase().indexOf(val.toLowerCase()) >= 0;
              },
            },
          },
        },
        education: {
          title: '学历',
          type: 'dict-select',
          column: { width: 90 },
          dict: dict({
            url: '/base/open/getDictCode?code=EDUCATION',
          }),
          form: {
            component: {
              showSearch: true,
              filterOption: (val, form) => {
                return form.label.toLowerCase().indexOf(val.toLowerCase()) >= 0;
              },
            },
          },
        },
        createdTime: {
          title: '创建时间',
          type: 'datetime',
          column: { width: 180, sorter: true },
          form: {
            show: false,
          },
          editForm: {
            show: false,
          },
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = moment(value);
            }
          },
        },
      },
      form: {
        display: 'flex',
        group: {
          type: 'tab', // tab
          accordion: false, //手风琴模式
          groups: {
            baseInfo: {
              header: '基础信息',
              columns: ['username', 'password', 'nickName', 'sex', 'status'],
            },
            orgInfo: {
              header: '职位信息',
              columns: ['orgId', 'stationId', 'positionStatus'],
            },
            linkInfo: {
              header: '联系方式',
              columns: ['mobile', 'email'],
            },
            otherInfo: {
              header: '其它信息',
              collapsed: false, //默认折叠
              columns: ['nation', 'education', 'avatar', 'createdTime'],
            },
          },
        },
      },
    },
  };
}
