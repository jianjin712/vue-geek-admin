<template>
  <PageWrapper class="fixed">
    <!-- <a-row :gutter="[8, { xs: 16, sm: 16, md: 24, lg: 32 }]" justify="space-between">
      <a-col :xs="24" :sm="24" :md="6" :lg="5" :xl="5">
        <a-card class="menu"> 权限菜单 </a-card>
      </a-col>

      <a-col :xs="24" :sm="24" :md="12" :lg="10" :xl="10">
        <a-card title="菜单信息" class="menu"> 表单内容 </a-card>
      </a-col>

      <a-col :xs="24" :sm="24" :md="8" :lg="9" :xl="9">
        <a-card title="资源信息" class="menu-button-table"> 资源信息 </a-card>
      </a-col>
    </a-row> -->
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #form_option="scope">
        <a-input-group compact>
          <a-input
            size="default"
            v-for="(item, index) in scope.form.option"
            :key="index"
            v-model="scope.form.option[index]"
            :disabled="scope.mode === 'view'"
            class="mb-5"
          >
            <template #suffix>
              <fs-button
                :disabled="scope.mode === 'view'"
                icon="ion:trash-outline"
                @click="removeTopic(index, scope.form, scope.key)"
              />
            </template>
          </a-input>
        </a-input-group>
        <a-button :disabled="scope.mode === 'view'" @click="addTopic(scope.form, scope.key)"
          >添加</a-button
        >
      </template>
    </fs-crud>
  </PageWrapper>
</template>

<script>
  import { defineComponent, onMounted, ref, unref, h, inject } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Icon } from '/@/components/Icon';
  import { Input } from 'ant-design-vue';
  import { useCrud, useExpose } from '@fast-crud/fast-crud';
  import createCrudOptions from './groupCurd';

  export default defineComponent({
    name: 'Group',
    components: {
      PageWrapper,
      // Input,
      // Icon,
    },
    setup() {
      // crud组件的服务
      const service = inject('service');
      const crudApi = service.sports.group;
      // crud组件的ref
      const crudRef = ref();
      // crud 配置的ref
      const crudBinding = ref();
      // 暴露的方法
      const { crudExpose } = useExpose({ crudRef, crudBinding });
      // 你的crud配置
      const { crudOptions } = createCrudOptions({ crudExpose, crudApi });

      const { resetCrudOptions } = useCrud({ crudExpose, crudOptions });
      // 页面打开后获取列表数据
      onMounted(() => {
        crudExpose.doRefresh();
      });

      function addTopic(form, key) {
        console.log(form[key]);
        if (form[key] == null) {
          form[key] = [];
        }
        form[key].push('');
      }
      function removeTopic(index, form, key) {
        form[key].splice(index, 1);
      }

      return {
        addTopic,
        removeTopic,
        crudBinding,
        crudRef,
      };
    },
  });
</script>
