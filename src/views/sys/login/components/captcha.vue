<template>
  <div class="login-captcha" @click="refresh" :style="`background-color: ${rgb}`">
    <div v-if="svg" class="svg" v-html="svg" style="{rgb.value}"></div>
    <img v-else class="base64" :src="base64" alt="" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useCode } from '/@/geek/index';
  export default defineComponent({
    emits: ['update:modelValue', 'change'],

    setup(_, { emit }) {
      const base64 = ref('');
      const svg = ref('');
      const rgb = ref('');

      const { service } = useCode();
      const refresh = async () => {
        await service.sys.open
          .captcha(
            {
              height: 36,
              width: 120,
            },
            {
              errorMessageMode: 'message',
              //apiUrl: globals.apiUrl,
            }
          )
          .then((res: any) => {
            const { captchaId, data } = res;
            if (data.includes(';base64,')) {
              base64.value = data;
            } else {
              svg.value = data;
            }

            emit('update:modelValue', captchaId);
            emit('change', {
              base64,
              svg,
              captchaId,
            });
          });
        rgb.value = Color();
      };

      function Color() {
        const colorAngle = Math.floor(Math.random() * 360);
        const color = 'hsla(' + colorAngle + ',60%,40%,0.8)';
        return color;
      }

      refresh();

      return {
        base64,
        svg,
        refresh,
        rgb,
      };
    },
  });
</script>

<style lang="less" scoped>
  .login-captcha {
    height: 36px;
    cursor: pointer;

    .svg {
      height: 100%;
    }

    .base64 {
      height: 100%;
    }
  }
</style>
