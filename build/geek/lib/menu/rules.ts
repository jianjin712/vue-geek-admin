export default [
  {
    test: ['avatar', 'img', 'image', 'pic', 'photo', 'picture', 'head', 'icon'],
    table: {
      type: 'image-uploader',
      props: {
        size: 60,
      },
    },
    form: {
      type: 'image-uploader',
    },
  },
  {
    test: ['avatars', 'imgs', 'images', 'pics', 'photos', 'pictures', 'heads', 'icons'],
    table: {
      type: 'image-uploader',
      props: {
        size: 60,
      },
    },
    form: {
      type: 'image-uploader',
      props: {
        listType: 'picture-card',
        multiple: true,
      },
    },
  },
  {
    test: ['file', 'attachment', 'attach', 'url', 'video', 'music'],
    table: {
      type: 'a-link',
    },
    form: {
      type: 'image-uploader',
      props: {
        listType: 'text',
        limit: 1,
      },
    },
  },
  {
    test: ['files', 'attachments', 'attachs', 'urls', 'videos', 'musics'],
    table: {
      type: 'a-link',
    },
    form: {
      type: 'cl-upload',
      props: {
        listType: 'text',
        multiple: true,
      },
    },
  },
  {
    test: ['enable', 'status'],
    handler: 'dict',
    // table: {
    //   type: 'dict-radio',
    // },
    // form: {
    //   type: 'dict-radio',
    //   dict: dictDo({
    //     url: '/sys/open/getDictCode?code=STATUS',
    //   }),
    //   valueBuilder: ({ value, row, key }) => {
    //     if (value != null) {
    //       row[key] = value === 1 ? '1' : '0';
    //     }
    //   },
    // },
  },
  {
    test: ['type', 'classify', 'category'],
    //handler: 'dict',
  },
  {
    test: ['types', 'classifys', 'categorys'],
    //handler: 'dict_multiple',
  },
  {
    test: ['date'],
    table: {
      type: 'a-date-text',
      props: {
        format: 'YYYY-MM-DD',
      },
    },
    form: {
      form: {
        component: {
          name: 'a-date-picker',
          //props: {
          //type: 'date',
          valueFormat: 'YYYY-MM-DD',
          //},
        },
      },
    },
  },
  {
    test: ['dates', 'dateRange', 'dateScope'],
    table: {
      type: 'a-date-text',
      props: {
        format: 'YYYY-MM-DD',
      },
    },
    form: {
      component: {
        type: 'a-date-picker',
        props: {
          type: 'daterange',
          valueFormat: 'YYYY-MM-DD',
        },
      },
    },
  },
  {
    test: ['time'],
    form: {
      type: 'a-date-picker',
      props: {
        type: 'datetime',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        defaultTime: [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)],
      },
    },
  },
  {
    test: ['times', 'timeRange', 'timeScope'],
    form: {
      component: {
        type: 'a-date-picker',
        props: {
          type: 'datetimerange',
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
          defaultTime: [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)],
        },
      },
    },
  },
  {
    test: ['star', 'stars'],
    table: {
      type: 'a-rate',
      props: {
        disabled: true,
      },
    },
    form: {
      type: 'a-rate',
    },
  },
  {
    test: ['progress', 'rate', 'ratio'],
    table: {
      type: 'a-progress',
    },
    form: {
      type: 'a-slider',
      props: {
        style: {
          width: '200px',
        },
      },
    },
  },
  {
    test: ['num', 'price', 'age', 'amount'],
    form: {
      //type: 'a-input-number',
      form: {
        component: {
          name: 'a-input-number',
          min: 0,
          vModel: 'modelValue',
        },
      },
    },
  },
  {
    test: ['remark', 'desc'],
    table: {
      showOverflowTooltip: true,
    },
    form: {
      type: 'textarea',
      props: {
        type: 'textarea',
        rows: 4,
      },
    },
  },
  {
    test: ['rich', 'text', 'html', 'content', 'introduce', 'description', 'desc'],
    table: {
      type: ['textarea', 'rows'],
    },
    form: {
      //type: 'textarea',
      // props: {
      //   placeholder: '请填写描述信息',
      //   rows: 4,
      // },
      type: ['textarea', 'rows'],
      form: {
        component: {
          placeholder: '请填写描述信息',
          rows: 2,
        },
      },
    },
  },
  {
    test: ['codes'],
    table: {
      type: 'a-codemirror',
    },
    form: {
      type: 'a-codemirror',
      props: {
        height: 400,
      },
    },
  },
  {
    test: ['createTime'],
    table: {
      type: 'datetime',
      column: {
        sortable: 'custom',
      },
    },
    form: {
      type: 'datetime',
      column: {
        sortable: 'custom',
      },
      valueBuilder: ({ value, row, key }) => {
        if (value != null) {
          row[key] = moment(value);
        }
      },
    },
  },
  {
    test: ['updateTime'],
    table: {
      type: 'datetime',
      column: {
        sortable: 'custom',
      },
      //sortable: 'custom',
    },
    form: {
      type: 'datetime',
      column: {
        sortable: 'custom',
      },
      valueBuilder({ value, row, key }) {
        if (value != null) {
          row[key] = moment(value);
        }
      },
    },
  },
];

const moment = (str: string) => {
  return str;
};
