<template>
  <fs-crud ref="crudRef" v-bind="crudBinding">
    <template #actionbar-right>
      <template v-if="crudBinding.table.editable.enabled">
        <fs-button class="ml-1" @click="addRow">添加行</fs-button>
        <fs-button class="ml-1" @click="active">激活全部编辑</fs-button>
        <!-- <fs-button class="ml-1" @click="inactive">反激活全部</fs-button> -->
        <!-- <fs-button class="ml-1" @click="editCol">编辑列</fs-button>
        <fs-button class="ml-1" @click="cancel">取消/恢复原状</fs-button> -->
        <fs-button class="ml-1" @click="save">保存</fs-button>
      </template>
    </template>
  </fs-crud>
</template>

<script>
  import { defineComponent, ref, onMounted, nextTick } from 'vue';
  import { useExpose, useCrud, compute } from '@fast-crud/fast-crud';
  import { isArray } from '/@/utils/is';

  const createCrudOptions = function ({ expose, props, ctx }) {
    const { crudBinding } = expose;
    //const pageRequest = async (query) => {
    //return await api.GetList(query);
    //};

    const delRequest = async function (row) {
      // console.log(expose.getTableData());
      //expose.crudRef.value.data = [];
      //console.log();
      //expose.removeTableRow();
      console.log(row);
      //console.log(expose.editable.getChangedData());
    };

    const onCurrentRowChange = () => {
      //currentRow.value = id;
      return crudBinding.value.getTableData();
      //crudBinding.value.setSearchFormData({ form: { gradeId: id } });
      //crudBinding.value.doRefresh();
    };

    return {
      crudOptions: {
        request: {
          pageRequest: () => {},
          // addRequest,
          // editRequest,
          delRequest,
        },
        data: isArray(props.data) ? props.data : [],
        rowHandle: {
          width: '100px',
          buttons: {
            add: {
              show: compute(() => {
                if (crudBinding.value) {
                  return !crudBinding.value?.table.editable.enabled;
                }
                return false;
              }),
            },
            addRow: {
              show: compute(() => {
                if (crudBinding.value) {
                  return crudBinding.value?.table.editable.enabled;
                }
                return false;
              }),
            },
            //remove: { type: 'text', text: '移除', icon: '' },
          },
        },
        pagination: {
          show: false,
        },
        toolbar: {
          show: false,
        },
        actionbar: {
          buttons: {
            add: {
              show: compute(() => {
                if (crudBinding.value) {
                  return !crudBinding.value?.table.editable.enabled;
                }
                return false;
              }),
            },
            addRow: {
              show: compute(() => {
                if (crudBinding.value) {
                  return crudBinding.value?.table.editable.enabled;
                }
                return false;
              }),
            },
          },
        },
        table: {
          emptyText: '请新增扩展参数',
          width: '100%',
          tableLayout: '100%',
          size: 'small',
          pagination: false,
          editable: {
            enabled: true,
            mode: 'free',
            activeTrigger: false,
          },
          customRow(record, index) {
            //const clazz = record.id === props.modelValue ? 'fs-current-row' : '';
            return {
              onClick() {
                ctx.emit('update:modelValue', onCurrentRowChange());
              },
              //class: clazz,
            };
          },
          onDataChange(data) {
            console.log('onDataChange', data);
          },
        },
        columns: props.columns || {},
      },
    };
  };

  export default defineComponent({
    name: 'Item',
    props: {
      // enabled: Boolean,
      // mode: String,
      // activeTrigger: Boolean,
      editable: Object,
      modelValue: Object,
      columns: Object,
      data: Array,
    },

    emits: ['update:modelValue', 'change'],

    setup(props, ctx) {
      const value = ref < Object > (props.modelValue || {});
      //const data = ref<Array<any>>(props.data || []);

      // console.log('上下文');
      // console.log(ctx);
      // console.log(props);

      // crud组件的ref
      const crudRef = ref();
      // crud 配置的ref
      const crudBinding = ref();
      // 暴露的方法
      const { expose } = useExpose({ crudRef, crudBinding });
      // 你的crud配置
      const { crudOptions } = createCrudOptions({ expose, props, ctx });
      // 初始化crud配置
      // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
      const { resetCrudOptions } = useCrud({ expose, crudOptions });
      //resetCrudOptions(crudOptions);

      function onChange() {
        ctx.emit('update:modelValue', expose.getTableData());
        // console.log('expose.getTableData()');
        console.log('update:modelValue', expose.getTableData());
        //ctx.emit('change', val);
      }

      onMounted(() => {
        nextTick(() => {
          expose.editable.enable({ enabled: true, mode: 'free' });
          //onChange();
          active();
        });
      });

      // watch(
      //   () => {
      //     console.log(props);
      //     return props.modelValue;
      //   },
      //   (value) => {
      //     console.log('modelValue changed', value);
      //   }
      // );

      expose.editable.doRemoveRow = async ({ index }) => {
        expose.editable.removeRow(index);
        console.log(index);
      };

      const active = () => {
        expose.editable.active();
      };

      const addRow = () => {
        expose.editable.addRow();
      };

      const save = () => {
        expose.getTableRef().editable.submit(({ changed, removed, setData }) => {
          onChange();
          // console.log('changed', changed);
          // console.log('removed', removed);
          // console.log('modelValue', expose.getTableData());
          // setData({ 0: {id:1} }); //设置data
          // ElMessage.success(
          //   '保存,修改行：' + JSON.stringify(changed) + '；删除行：' + JSON.stringify(removed)
          // );
        });
      };

      return {
        value,
        save,
        addRow,
        active,
        onChange,
        crudBinding,
        crudRef,
      };
    },
  });
</script>
