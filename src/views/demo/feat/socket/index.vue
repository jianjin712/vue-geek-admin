<template>
  <a-card> 测试 </a-card>
</template>

<script lang="ts">
  import { defineComponent, onMounted, inject } from 'vue';
  import io from 'socket.io-client';
  import { Socket } from 'socket.io-client';

  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    setup() {
      const { getToken, getUserInfo } = useUserStore();

      const service: any = inject('service');

      let socket: Socket;
      console.log(service);
      // service.chat.session.page().then((res) => {
      //   // 默认加载第一个会话的消息
      //   // if (!value.value) {
      //   // 	set(res.list[0]);
      //   // }
      //   // 设置列表
      //   //list.value = res.list;
      //   console.log(res);
      // });

      // 连接
      function connect() {
        if (!socket) {
          socket = io('ws://127.0.0.1:8002', {
            auth: {
              token: getToken,
            },
            //transports: ['websocket'],
          });

          socket.on('connect', () => {
            console.log(`connect ${getUserInfo?.nickName}`);

            socket.on('data', (msg) => {
              console.log('服务端消息', msg);
            });

            // 监听消息
            socket.on('message', (msg) => {
              console.log('message', msg);
              // mitt('chat-message', msg);
            });

            // refresh();
          });

          socket.on('disconnect', (err) => {
            console.error(err);
          });
        }
      }

      onMounted(() => {
        connect();
      });
    },
  });
</script>
