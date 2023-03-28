<template>
  <a-card>
    <div class="w-1/3 bg-white p-4">
      <div class="flex items-center">
        <span class="text-lg font-medium mr-4"> 连接状态: </span>
        <!-- <Tag :color="getTagColor">{{ status }}</Tag> -->
      </div>
      <hr class="my-4" />

      <div class="flex">
        <!-- <a-input :value="server">
            <template #addonBefore> 服务地址 </template>
          </a-input> -->

        <!-- <a-button :type="getIsOpen ? 'danger' : 'primary'" @click="toggle">
          {{ getIsOpen ? '关闭连接' : '开启连接' }}
        </a-button> -->
      </div>

      <div class="w-3/3 bg-white ml-4 p-4">
        <span class="text-lg font-medium mr-4"> 消息记录: </span>
        <hr class="my-4" />

        <div class="max-h-80 overflow-auto chat-dialog-cont">
          <ul>
            <li v-for="item in getList" class="mt-2" :key="item.time">
              <div class="flex items-center">
                <span class="mr-2 text-primary font-medium">收到消息:</span>
                <span>{{ formatToDateTime(item.time) }}</span>
              </div>
              <div>
                {{ item.res }}
              </div>
            </li>
          </ul>
        </div>
      </div>

      <p class="text-lg font-medium mt-4">设置</p>
      <hr class="my-4" />

      <InputTextArea placeholder="需要发送到服务器的内容" v-model:value="sendValue" allowClear />

      <a-button type="primary" block class="mt-4" @click="handlerSend"> 发送 </a-button>
      <!-- :disabled="!getIsOpen" -->
    </div>
  </a-card>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, toRefs, computed } from 'vue';
  import io from 'socket.io-client';
  import { Socket } from 'socket.io-client';
  import { useUserStore } from '/@/store/modules/user';
  import { /* Tag, */ Input } from 'ant-design-vue';
  import { formatToDateTime } from '/@/utils/dateUtil';

  export default defineComponent({
    components: {
      //PageWrapper,
      //[Input.name]: Input,
      InputTextArea: Input.TextArea,
      //Tag,
    },
    setup() {
      const { getToken, getUserInfo } = useUserStore();
      //const service: any = inject('service');
      const state = reactive({
        // server: 'ws://localhost:3300/chat',
        server: 'ws://127.0.0.1:8002',
        sendValue: '',
        recordList: [] as { id: number; time: number; res: string }[],
      });

      let socket: Socket;

      // service.chat.session.page().then((res) => {
      //   // 默认加载第一个会话的消息
      //   // if (!value.value) {
      //   // 	set(res.list[0]);
      //   // }
      //   // 设置列表
      //   //list.value = res.list;
      //   console.log(res);
      // });

      function handlerSend() {
        //socket.send(state.sendValue);
        socket.emit('data', state.sendValue);
        state.sendValue = '';
      }

      // 连接
      function connect() {
        if (!socket) {
          const fjh = 'test';
          socket = io('ws://127.0.0.1:8002?fjh=' + fjh, {
            auth: {
              token: getToken,
            },
            secure: true,
            //transports: ['websocket'],
          });

          socket.on('connect', () => {
            console.log(`connect ${getUserInfo?.nickName}`);

            state.recordList.push({
              res: '欢迎' + getUserInfo?.nickName,
              id: Math.ceil(Math.random() * 1000),
              time: new Date().getTime(),
            });
            // socket.on('data', (msg) => {
            //   console.log('服务端消息', msg);
            // });

            // refresh();
          });
        }

        socket.on('disconnect', (err) => {
          console.error(err);
        });

        // 监听消息
        socket.on('message', (msg) => {
          console.log('message', msg);
          // mitt('chat-message', msg);
        });

        socket.on('data', (msg) => {
          //const data2 = [{}];
          if (msg.data != null) {
            // let data3 = {
            //   //name: msg.xx.name,
            //   xx: msg.data,
            //   id: msg.id,
            //   fj: msg.xx.fjh,
            // };
            // data2.push(data3);
            state.recordList.push({
              res: msg.data,
              id: msg.id,
              time: new Date().getTime(),
            });
          }
          // console.log('服务端消息2', msg, data2);
        });
      }

      const getList = computed(() => {
        return [...state.recordList].reverse();
      });

      onMounted(() => {
        connect();
      });

      return {
        ...toRefs(state),
        handlerSend,
        getList,
        formatToDateTime,
      };
    },
  });
</script>
