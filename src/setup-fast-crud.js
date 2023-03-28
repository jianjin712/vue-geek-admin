/* eslint-disable prettier/prettier */
import { unref } from 'vue';
import { defHttp } from '/@/utils/http/axios';
import { request } from '/@/api/service';
import { FastCrud/* , setLogger */ } from '@fast-crud/fast-crud';
import '@fast-crud/fast-crud/dist/style.css';
import { FsExtendsEditor, FsExtendsUploader, FsExtendsJson } from '@fast-crud/fast-extends';
import '@fast-crud/fast-extends/dist/style.css';
import UiAntdv from '@fast-crud/ui-antdv';
import { useCrudPermission } from '/@/plugin/permission/use-crud-permission';
import * as _ from 'lodash-es';
import { getToken /* , getUserInfo */ } from '/@/utils/auth';

const token = getToken();
// 导出 setupFastCrud
// 国际化配置见 /src/locales/en  or zh_CN
export default function (app, i18n) {
  //先安装ui
  app.use(UiAntdv);
  //再安装fast-crud
  app.use(FastCrud, {
    i18n,
    async dictRequest ({ url }) {
      return await defHttp.request({
        url: url,
        //method: 'get',
      })
    },
    commonOptions (context) {
      const crudBinding = unref(context.crudBinding);
      const opts = {
        search: {
          show: false
        },
        toolbar: {
          search: true,
          // toolbar.buttons.export.show:false 显示隐藏
          // toolbar.compact:false 默认选择
          compact: true,
          export: { show: true },
          // 列设置按钮
          // columns: {
          //   columnsFilter: {
          //     mode: 'simple'
          //   }
          // }
        },
        // actionbar: {
        //   buttons: {
        //     add: {
        //       icon: 'akar-icons:circle-plus',
        //     },
        //   },
        // },
        container: {
          is: 'fs-layout-card',
        },
        rowHandle: {
          width: 130,
          align: 'center',
          // 固定右侧 不建议设置成全局
          // fixed: 'right',
          buttons: {
            view: { size: 'small', type: 'link', text: null, icon: 'akar-icons:search' },
            edit: { size: 'small', type: 'link', text: null, icon: 'ion:create-outline' },
            remove: { size: 'small', type: 'link', text: null, icon: 'ion:trash-outline' },
          },
          dropdown: {
            more: {
              type: 'link',
            },
          },
        },
        table: {
          size: 'small',
          scroll: {
            //需要设置它，否则滚动条拖动时，表头不会动
            fixed: false,
          },
          // onResizeColumn: (w, col) => {
          //   //触发resize事件后，修改column宽度，width只能配置为number类型
          //   //可以将此方法写在app.use()中的commonOptions里面
          //   console.log(crudBinding)
          //   crudBinding.table.columnsMap[col.key].width = w;
          // },
          pagination: false,
        },
        pagination: {
          pageSize: 10,
          //hideOnSinglePage: true
        },
        request: {
          transformQuery: ({ page, form, sort }) => {
            page.currentPage = page.currentPage ?? 1;
            const order = _.isEmpty(sort)
              ? {}
              : {
                order: sort.prop ?? '',
                sort: sort.asc ? 'asc' : 'desc',
              };
            const search = _.isEmpty(form)
              ? {}
              : {
                keyWord: Object.values(form).join(''),
              };

            return {
              current: page.currentPage,
              size: page.pageSize,
              page: page.currentPage,
              ...order,
              ...search,
              ...form,
            };
          },
          transformRes: ({ res }) => {
            //console.log(res)
            const { list, pagination } = res?.data ? res.data : res;
            const pageSize = parseInt(pagination.size);
            const total = parseInt(pagination.total);
            const current = parseInt(pagination.page);

            return {
              records: list,
              pageSize,
              currentPage: current,
              total,
            };
          },
        },
        // form: {
        //   display: 'flex',
        //   wrapper: {
        //     is: 'a-drawer',
        //   },
        // },
        form: {
          // 提示信息全局
          helper: {
            position: 'label',
            tooltip: {
              placement: 'topLeft',
            },
          },

          //col: { span: 24 },
          display: 'flex',
          // labelCol: { style: { width: "200px" } }
          labelAlign: 'right',
          labelCol: { span: 8 },
          wrapperCol: { span: 14 },
          //labelColWidth: 100,
          wrapper: {
            is: 'a-drawer',
          },
        },
        // search: {
        //   show: false, // 默认隐藏查询工具条
        // },
      };
      const crudPermission = useCrudPermission(context);
      return crudPermission.merge(opts);
    },
  });

  app.use(FsExtendsEditor);
  // JSON 编辑器
  app.use(FsExtendsJson);
  //配置uploader 公共参数
  app.use(FsExtendsUploader, {
    defaultType: 'form',
    cos: {
      domain: 'https://d2p-demo-1251260344.cos.ap-guangzhou.myqcloud.com',
      bucket: 'd2p-demo-1251260344',
      region: 'ap-guangzhou',
      secretId: '', //
      secretKey: '', // 传了secretKey 和secretId 代表使用本地签名模式（不安全，生产环境不推荐）
      async getAuthorization () {
        // 不传secretKey代表使用临时签名模式,此时此参数必传（安全，生产环境推荐）
        return await defHttp.request(
          {
            url: '/upload/cos/getAuthorization',
            method: 'get',
          },
          { apiUrl: 'http://www.docmirror.cn:7070/api' }
        );
      },
      successHandle (ret) {
        // 上传完成后可以在此处处理结果，修改url什么的
        console.log('success handle:', ret);
        return ret;
      },
    },
    alioss: {
      domain: 'https://d2p-demo.oss-cn-shenzhen.aliyuncs.com',
      bucket: 'd2p-demo',
      region: 'oss-cn-shenzhen',
      accessKeyId: '',
      accessKeySecret: '',
      async getAuthorization () {
        // 不传accessKeySecret代表使用临时签名模式,此时此参数必传（安全，生产环境推荐）
        return defHttp.request(
          {
            url: '/upload/alioss/getAuthorization',
            method: 'get',
          },
          { apiUrl: 'http://www.docmirror.cn:7070/api' }
        );
      },
      sdkOpts: {
        // sdk配置
        secure: true, // 默认为非https上传,为了安全，设置为true
      },
      successHandle (ret) {
        // 上传完成后可以在此处处理结果，修改url什么的
        console.log('success handle:', ret);
        return ret;
      }
    },
    qiniu: {
      bucket: 'battcn',
      async getToken () {
        return defHttp.request(
          {
            url: '/qiniuGetToken',
            method: 'get'
          },
          {
            apiUrl: '',
            // headers: {
            //   'Content-Type': "headers.Content-Type, application/json",
            // },
          });
      },
      successHandle (ret) {
        // 上传完成后可以在此处处理结果，修改url什么的
        console.log('success handle:', ret);
        return ret;
      },
      // 不配置 domain 那么就自己在 valueBuilder 构建地址即可
      domain: 'https://qiniu.battcn.com',
    },
    form: {
      //action: 'http://www.docmirror.cn:7070/api/upload/form/upload',
      // /admin/cool/admin/sys/comm/upload Not Found
      action: '/cool/admin/sys/comm/upload',
      name: 'file',
      withCredentials: false,
      headers: {
        Authorization: getToken(),
      },
      // async getAuthorization () {
      //   return token;
      // },
      //{ action, file }
      successHandle (ret) {
        console.log('ret ==> ', ret);
        // 上传完成后的结果处理， 此处后台返回的结果应该为 ret = {code:0,msg:'',data:fileUrl}
        // if (!ret) {
        //   throw new Error('上传失败');
        // }
        return {
          url: ret.data,
        };
      },
    },
  });
}
