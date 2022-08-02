<template>
  <div class="cl-menu-perms">
    <fs-dict-cascader
      v-model="value"
      separator=":"
      :options="options"
      multiple
      @change="onChange"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, watch, inject } from 'vue';
  import * as _ from 'lodash-es';

  export default defineComponent({
    name: 'ClMenuPerms',
    props: {
      modelValue: {
        type: String,
        default: '',
      },
    },

    emits: ['update:modelValue'],

    setup(props, { emit }) {
      const service = inject('service');

      // 绑定值
      const value = ref<any[]>([]);

      // 权限列表
      const options = ref<any[]>([]);

      // 监听改变
      function onChange(row: any) {
        value.value = row
          .map((e: any) => {
            console.log(e);
            return e.join(':');
          })
          .join(',');
        console.log('onChange -> update:modelValue', value.value);
        emit('update:modelValue', value.value);
      }

      // 解析权限
      (function parsePerm() {
        const list: any[] = [];
        let perms: any[] = [];
        let tree: any[] = [];
        let root: any[] = [];

        const flat = (obj: any) => {
          for (const i in obj) {
            const { permission, action } = obj[i];
            tree[i] = {
              label: i,
              value: i,
              children: action ? Object.values(action) : [],
            };
            if (permission) {
              perms = [...perms, Object.values(permission)].flat();
            } else {
              flat(obj[i]);
            }

            //console.log([i, action, obj[i]]);

            if (action == undefined) {
              // tree.forEach((i: any) => {
              //   if (i.label === i) {
              //     i.children = tree;
              //   }
              // });
              root[i] = tree;
              flat(obj[i]);
              //console.log([i, permission, action, obj[i]]);
            } else {
              //root[i].children = Object.values(action);
            }
          }
        };

        flat(service);

        //console.log(root);

        perms
          .filter((e) => e.includes(':'))
          .map((e) => e.split(':'))
          .forEach((arr) => {
            const col = (i: number, d: any[]) => {
              const key = arr[i];

              if (d) {
                const index = d.findIndex((e: any) => e.label == key);

                if (index >= 0) {
                  col(i + 1, d[index].children);
                } else {
                  const isLast = i == arr.length - 1;

                  d.push({
                    label: key,
                    value: key,
                    children: isLast ? null : [],
                  });

                  if (!isLast) {
                    col(i + 1, d[d.length - 1].children || []);
                  }
                }
              }
            };

            col(0, list);
          });

        options.value = list;
      })();
      //console.log(options.value);
      // 监听值
      watch(
        () => props.modelValue,
        (val: string) => {
          console.log('val', val);
          value.value = val ? val.split(',').map((e: string) => e.split(':')) : [];
        },
        {
          immediate: true,
        }
      );

      return {
        value,
        options,
        onChange,
      };
    },
  });
</script>

<style lang="less">
  .cl-menu-perms {
    .el-cascader {
      width: 100%;
    }
  }
</style>
