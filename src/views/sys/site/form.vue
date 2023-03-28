<template>
  <fs-page>
    <!-- <template #header>
      <div class="title">表单独立使用</div>
    </template> -->
    <div class="m-4">
      <!-- <a-row :gutter="10">
      <a-col :span="16"> -->
      <a-card title="网站设置">
        <fs-form v-if="crudBinding" ref="formRef" v-bind="crudBinding" />
        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-radio-group class="mb-4">
            <a-button type="primary" @click="formSubmit">提交表单</a-button>
            <!-- <a-button class="ml-5" type="dashed" v-if="formRef" @click="formReset"
              >重置表单</a-button
            > -->
          </a-radio-group>
        </a-form-item>
      </a-card>
      <!-- <div class="_hidden">
        <fs-crud v-if="crudBinding" ref="crudRef" v-bind="crudBinding" />
      </div> -->

      <!--</a-col>
       <a-col :span="8">
          <a-card header="打开表单对话框">
            <a-button @click="openFormWrapper">打开表单对话框</a-button>
            <fs-form-wrapper ref="formWrapperRef" />
          </a-card>

          <a-card class="mt-10" header="打开表单对话框【复用crudBinding.addForm】">
            <a-button @click="openFormWrapper2">打开表单对话框</a-button>
            <fs-form-wrapper ref="formWrapperRef2" />
          </a-card>
        </a-col> -->
      <!-- </a-row> -->
    </div>
    <!-- <template #footer>
      
    </template> -->
  </fs-page>
</template>

<script>
  import { defineComponent, onMounted, inject, nextTick, ref, reactive } from 'vue';
  import { useCrud, useExpose } from '@fast-crud/fast-crud';
  import { useFormDirect, useCrudOptions } from './crud';
  import _ from 'lodash-es';

  //import { useCode } from '/@/geek/index';

  export default defineComponent({
    name: 'FormConfig',
    setup() {
      //const { service } = useCode();
      const service = inject('service');
      const curdApi = service.sys.config;
      // crud组件的ref
      const crudRef = ref();
      // crud 配置的ref
      const crudBinding = ref();
      // 暴露的方法
      const { expose } = useExpose({ crudRef, crudBinding });

      // 你的crud配置
      const { crudOptions } = useCrudOptions({ expose, curdApi });

      const { setFormData, formRef, formOptions, formSubmit, formReset, getConfig } = useFormDirect(
        expose,
        curdApi
      );

      //const { crudOptions } = createFormOptions();
      //formOptions.value = createFormOptions();

      onMounted(async () => {
        const crudBackend = await getConfig();

        // 本示例返回的是一个方法字符串，所以要先执行这个方法，获取options
        // const crudOptionsFromBackend = crudBackend({ expose, dict });
        // 与本地options合并
        _.merge(crudOptions, crudBackend);
        // useCrud
        useCrud({ expose, crudOptions });

        nextTick(() => {
          setTimeout(() => {
            setFormData();
            // console.log('formOptions.value', formOptions.value);
            // console.log('formRef.value', formRef.value);
          });
        });
        //expose.doRefresh();
      });

      //console.log('crudBinding', crudBinding);
      return {
        formRef,
        formOptions,
        //...useFormDirect(),
        formSubmit,
        formReset,
        crudBinding,
        crudRef,
      };
    },
  });
</script>
