<template>
  <fs-page>
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <!-- <template #default> -->
      <div class="view-task">
        <div class="box">
          <!-- 系统，用户自定义，已停止 -->
          <div v-for="(item, index) in list" :key="index" class="block" :class="[`_${item.key}`]">
            <div class="header">
              <!-- 图标 -->
              <i class="icon" :class="item.icon"></i>
              <!-- 标题 -->
              <span class="label">{{ item.label }}</span>
              <!-- 数量 -->
              <span class="num">({{ item.pagination.total }})</span>
              <span class="flex1"></span>
              <!-- 操作按钮 -->
              <ul class="op-btn">
                <!-- v-permission="perm.delete" -->
                <li class="refresh-btn" @click="refreshTask({ page: 1 })">
                  <undo-outlined />
                  <span>刷新</span>
                </li>

                <!-- v-permission="perm.add" -->
                <li class="add-btn" @click="addHandle(item.params)">
                  <plus-outlined />
                  <span>添加</span>
                </li>
              </ul>
            </div>

            <!--  -->
            <div class="container scroller1">
              <draggable
                v-model="list[index].list"
                v-bind="drag.options"
                tag="ul"
                item-key="id"
                :data-type="item.params.type"
                :data-status="item.params.status"
                @end="onDragEnd"
              >
                <template #item="{ element }">
                  <li
                    :key="element.id"
                    :data-id="element.id"
                    class="_drag"
                    @contextmenu.stop.prevent="openCM($event, element)"
                  >
                    <div class="h">
                      <span v-show="element.status === 0" class="type _warning">
                        {{ element.type === 0 ? '系统' : '用户' }}
                      </span>
                      <span class="name">{{ element.name }}</span>
                    </div>

                    <div class="remark">{{ element.remark }}</div>

                    <div class="f">
                      <template v-if="element.status === 1">
                        <span class="date">{{ element.nextRunTime || '...' }}</span>
                        <span class="start">进行中</span>
                      </template>

                      <template v-else>
                        <span>...</span>
                        <span class="stop">已停止</span>
                      </template>
                    </div>

                    <div class="op">
                      <div v-if="element.status === 0" class="op-item" @click="start(element)">
                        <play-circle-outlined />
                        <span>开始</span>
                      </div>

                      <!-- v-else v-permission="perm.stop" -->
                      <div class="op-item" @click="stop(element)">
                        <pause-circle-outlined />
                        <span>暂停</span>
                      </div>

                      <!-- 
                        v-permission="{
                          and: [perm.update, perm.info],
                        }"
                       -->
                      <div class="op-item" @click="editHandle(element)">
                        <edit-outlined />
                        <span>编辑</span>
                      </div>
                      <!-- v-permission="perm.log" -->
                      <div class="op-item" @click="findLog(element)">
                        <unordered-list-outlined />
                        <span>查看日志</span>
                      </div>
                    </div>
                  </li>
                </template>

                <template #header>
                  <div v-if="list[index].list.length == 0" class="empty">暂无数据</div>
                </template>
              </draggable>

              <a-button
                v-if="item.pagination.total >= item.pagination.size"
                class="more"
                text
                @click="moreTask(index)"
                >查看更多</a-button
              >
            </div>

            <div class="footer">
              <!-- v-permission="perm.add" -->
              <a-button class="btn-add" @click="addHandle(item.params)">
                <template #icon><plus-outlined /></template>
              </a-button>
            </div>
          </div>

          <!-- 日志 v-permission="perm.log" -->
          <div class="block _log">
            <div class="header">
              <!-- 标题 -->
              <span class="label">日志</span>
              <!-- 数量 -->
              <span class="num">({{ logs.pagination.total }})</span>
              <span class="flex1"></span>

              <!-- 是否异常 -->
              <a-checkbox-group v-model="logs.filters.status" class="status" @change="filterLog">
                <a-checkbox :value="0">异常</a-checkbox>
              </a-checkbox-group>

              <!-- 操作按钮 -->
              <ul class="op-btn">
                <li @click="refreshLog({ page: 1 })">
                  <undo-outlined text="刷新" />
                  <!-- <span>刷新</span> -->
                </li>

                <li v-if="logs.current" class="_current-log" @click="allLog">
                  <span>{{ logs.current.name }}</span>
                  <!-- <i class="a-icon-close"></i> -->
                  <close-outlined />
                </li>
              </ul>
            </div>

            <div
              loading="logs.loading"
              class="container scroller1"
              loading-tips="拼命加载中..."
              ref="logScroller"
            >
              <ul>
                <li
                  v-for="(item, index) in logs.list"
                  :key="index"
                  :class="{ _error: item.status == 0 }"
                  @click="expandLog(item)"
                >
                  <div class="h">
                    <span class="name">{{ Number(index) + 1 }} · {{ item.taskName }}</span>
                  </div>

                  <div class="remark" :class="{ _ellipsis: !item._expand }">
                    {{ item.detail || '...' }}
                  </div>

                  <div class="f">
                    <span>执行时间：{{ item.createTime }}</span>
                  </div>
                </li>

                <li v-if="logs.list.length == 0">
                  <div class="empty">暂无数据</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!-- </template> -->
    </fs-crud>
  </fs-page>
</template>

<script>
  import { defineComponent, ref, onMounted, inject, computed, reactive } from 'vue';
  import { useExpose, useCrud } from '@fast-crud/fast-crud';
  //import { useCode } from '/@/geek/index';
  import createCrudOptions from './task';
  import { message } from 'ant-design-vue';
  //import { useRefs } from '/@/hooks/core/useRefs';
  import { useInfiniteScroll } from '@vueuse/core';
  import Draggable from 'vuedraggable/src/vuedraggable';

  //import { shallowRef } from 'vue';
  //import { dict, compute } from '@fast-crud/fast-crud';

  export default defineComponent({
    components: { Draggable },
    setup() {
      // crud 配置的ref
      //const [refs, setRefs] = useRefs();
      //const { refs, named } = useCode();

      //named('task');
      // 任务列表
      const list = reactive([
        {
          key: 'sys',
          label: '系统任务',
          icon: 'el-icon-s-tools',
          list: [],
          loading: false,
          params: {
            type: 0,
            status: 1,
          },
          pagination: {
            size: 10,
            page: 1,
            total: 0,
          },
        },
        {
          key: 'user',
          label: '用户自定义任务',
          icon: 'el-icon-user-solid',
          list: [],
          loading: false,
          params: {
            type: 1,
            status: 1,
          },
          pagination: {
            size: 10,
            page: 1,
            total: 0,
          },
        },
        {
          key: 'stop',
          label: '已停止任务',
          list: [],
          loading: false,
          params: {
            type: null,
            status: 0,
          },
          pagination: {
            size: 10,
            page: 1,
            total: 0,
          },
        },
      ]);

      const crudRef = ref();
      const crudBinding = ref();
      const service = inject('service');

      const { expose } = useExpose({ crudRef, crudBinding });
      // 你的crud配置
      const { crudOptions } = createCrudOptions({ expose, service });
      useCrud({ expose, crudOptions });

      //const perm = computed(() => service.task.info.permission);
      //console.log(perm);

      // 页面打开后获取列表数据
      onMounted(() => {
        expose.doRefresh();
        refreshTask({ page: 1 });
      });

      async function editHandle(item) {
        await expose.openEdit({ row: item });
      }

      async function addHandle(item) {
        await expose.openAdd({ row: item });
      }

      async function removeHandle(item) {
        await expose.doRemove({ row: { id: item.id } });
      }
      // 开始任务
      async function start({ id, type }) {
        await service.task.info
          .start({ id, type })
          .then(() => {
            refreshTask();
            //expose.doRefresh();
          })
          .catch((err) => {
            message.error(err.message);
          });
      }

      // 刷新任务
      function refreshTask(params, options) {
        const { index, more } = options || {};
        const arr = index === undefined || index === null ? list.map((e, i) => i) : [index];

        arr.forEach(async (k) => {
          const item = list[k];

          Object.assign(item.params, {
            ...item.pagination,
            ...params,
          });

          item.loading = true;

          const res = await service.task.info.page(item.params);

          moreList(res, item);

          if (!more) {
            //refs.value[`${item.key}-scroller`].scroll(0, 0);
          }

          item.loading = false;
        });
      }

      // 更多列表
      function moreList(res, { list, pagination }) {
        if (!res) {
          return;
        }
        const { page, size } = res.pagination;
        const len = res.list.length;
        const max = list.length;

        if (page == 1) {
          list.splice(0, max, ...res.list);
        } else {
          const start = max - (max % size);
          const end = start + len;

          list.splice(start, end, ...res.list);
        }

        if (len == size) {
          res.pagination.page += 1;
        }

        Object.assign(pagination, res.pagination);

        return page != 1;
      }

      // 停止任务
      async function stop({ id }) {
        await service.task.info
          .stop({ id })
          .then(() => {
            refreshTask();
            //expose.doRefresh();
          })
          .catch((err) => {
            message.error(err.message);
          });
      }

      // 更多任务
      function moreTask(index) {
        refreshTask(null, { index, more: true });
      }

      // 任务拖动
      function onDragEnd({ to, item }) {
        const status = to.getAttribute('data-status');
        const type = to.getAttribute('data-type');
        const id = item.getAttribute('data-id');

        if (status == 0) {
          stop({ id });
        }

        if (status == 1) {
          start({ id, type });
        }
      }
      // 日志列表
      const logs = reactive({
        loading: false,
        list: [],
        pagination: {
          size: 10,
          page: 1,
        },
        params: {},
        filters: {
          status: [],
        },
        current: null,
      });

      // 拖动选项
      const drag = reactive({
        options: {
          group: 'Task',
          animation: 300,
          ghostClass: 'Ghost',
          dragClass: 'Drag',
          draggable: '._drag',
        },
      });

      const logScroller = ref(null);

      useInfiniteScroll(
        logScroller,
        () => {
          // const length = data.value.length + 1;
          // data.value.push(...Array.from({ length: 3 }, (_, i) => length + i));
          refreshLog(null, { more: true });
        },
        { distance: 10 }
      );

      // 过滤日志
      function filterLog([v]) {
        refreshLog({ page: 1, status: v === undefined ? 1 : 0 });
      }

      // 刷新日志
      async function refreshLog(newParams, options) {
        /* if (logs.loading) {
            return false;
          } */

        // if (!checkPerm(perm.value.log)) {
        //   return false;
        // }

        const { params, pagination } = logs;
        const { more } = options || {};

        Object.assign(params, {
          ...pagination,
          ...newParams,
        });

        logs.loading = true;

        const res = await service.task.info.log(params);

        moreList(res, logs);

        // if (!more) {
        //   refs.value['log-scroller'].scroll(0, 0);
        // }

        logs.loading = false;
      }
      // 更多列表
      function moreList(res, { list, pagination }) {
        if (!res) {
          return;
        }
        const { page, size } = res.pagination;
        const len = res.list.length;
        const max = list.length;

        if (page == 1) {
          list.splice(0, max, ...res.list);
        } else {
          const start = max - (max % size);
          const end = start + len;

          list.splice(start, end, ...res.list);
        }

        if (len == size) {
          res.pagination.page += 1;
        }

        Object.assign(pagination, res.pagination);

        return page != 1;
      }
      // 更多日志
      function moreLog() {
        refreshLog(null, { more: true });
      }
      // 展开
      function expandLog(e) {
        console.log(e);
        e._expand = !e._expand;
      }
      // 查看任务对应的日志
      function findLog(e) {
        logs.current = e;
        refreshLog({ page: 1, id: e.id });
      }
      // 所有日志
      function allLog() {
        logs.current = null;
        refreshLog({ page: 1, id: null });
      }

      return {
        crudBinding,
        crudRef,
        editHandle,
        removeHandle,
        stop,
        start,
        logs,
        moreLog,
        expandLog,
        //setRefs,
        //refs,
        findLog,
        refreshLog,
        filterLog,
        allLog,
        logScroller,
        refreshTask,
        drag,
        onDragEnd,
        list,
        addHandle,
      };
    },
  });
</script>

<style lang="less">
  .fs-container .box .inner .body {
    overflow: hidden;
  }

  .fs-container .box {
    flex-direction: inherit !important;
  }

  .Ghost {
    opacity: 0.7;
  }

  .Drag {
    border: 1px dashed #000 !important;
    background: #fff !important;
  }

  .view-task {
    .box {
      display: flex;
      height: 100%;
      overflow-x: auto;
      padding: 2px;
    }

    .block {
      height: 100%;
      width: 300px;
      margin-right: 5px;
      flex-shrink: 0;

      &:last-child {
        margin-right: 0;
      }

      .header {
        display: flex;
        align-items: center;
        height: 40px;
        background-color: #f0f0f0;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        position: relative;
        top: 5px;
        z-index: 1;
        padding: 0 10px 5px 10px;

        i {
          font-size: 18px;
        }

        .label {
          font-size: 12px;
          margin: 0 5px;
          letter-spacing: 0.5px;
        }

        .num {
          font-size: 12px;
        }

        .flex1 {
          flex: 1;
        }

        .op-btn {
          display: flex;

          li {
            display: flex;
            align-items: center;
            list-style: none;
            cursor: pointer;
            padding: 2px 10px;
            background-color: #fff;
            border-radius: 3px;
            margin-left: 5px;

            &:hover {
              background-color: #dedede;
              color: #444;
            }

            i {
              font-size: 13px;
              margin-right: 2px;
            }

            span {
              font-size: 12px;
            }
          }
        }
      }

      .container {
        max-height: calc(100% - 90px);
        overflow-y: auto;
        margin-bottom: 5px;
        z-index: 2;
        position: relative;

        ul {
          li {
            list-style: none;
            background-color: #fff;
            border-radius: 5px;
            margin-bottom: 5px;
            padding: 10px 15px;
            font-size: 14px;
            letter-spacing: 0.5px;
            border: 1px solid #f7f7f7;

            &:last-child {
              margin-bottom: 0;
            }

            &._drag {
              cursor: pointer;
            }

            &:hover {
              .op {
                height: 30px;
              }
            }

            .h {
              display: flex;
              align-items: center;
              font-size: 14px;
              margin-bottom: 10px;

              .type {
                font-size: 12px;
                border-radius: 3px;
                padding: 1px 2px;
                margin-right: 5px;

                &._warning {
                  background-color: #e6a23c;
                  color: #fff;
                }
              }
            }

            .remark {
              font-size: 12px;
              color: #666;
              margin-bottom: 20px;
            }

            .f {
              display: flex;
              align-items: center;
              justify-content: space-between;
              position: relative;

              .date {
                font-size: 12px;
                color: #fff;
                background-color: #2f3447;
                border-radius: 2px;
                margin-left: 40px;
                padding: 1px 3px;

                &::before {
                  content: 'NEXT';
                  position: absolute;
                  left: 0;
                  top: 1px;
                  color: #222;
                }
              }

              .start,
              .stop {
                display: flex;
                align-items: center;
                font-size: 12px;
                margin-left: 30px;
                position: relative;

                &::before {
                  content: '';
                  display: block;
                  height: 6px;
                  width: 6px;
                  border-radius: 6px;
                  position: absolute;
                  left: -15px;
                }
              }

              .start {
                color: #67c23a;

                &::before {
                  background-color: #67c23a;
                }
              }

              .stop {
                color: #f56c6c;

                &::before {
                  background-color: #f56c6c;
                }
              }
            }

            .op {
              display: flex;
              height: 0;
              margin-top: 15px;
              transition: height 0.3s;
              overflow: hidden;

              &-item {
                flex: 1;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;

                &:hover {
                  background-color: #f7f7f7;
                }

                span {
                  font-size: 12px;
                  color: #666;
                }

                i {
                  font-size: 16px;
                  margin-right: 5px;
                }
              }
            }

            &._error {
              background-color: #f56c6c;
              color: #fff;

              .remark {
                color: #fff !important;
              }
            }
          }
        }

        .empty {
          text-align: center;
          font-size: 13px;
          color: #666;
          background-color: #fff;
          padding: 20px;
        }

        .more {
          display: block;
          margin: 10px auto;
        }
      }

      .footer {
        height: 36px;

        .btn-add {
          height: 34px;
          width: 100%;
          border-radius: 3px;
          border: 0;
          background-color: #fff;
          cursor: pointer;

          i {
            font-size: 16px;
            color: #999;
          }

          &:hover {
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
          }
        }
      }
    }

    .block._stop {
      .header {
        .add-btn {
          display: none;
        }
      }

      .container {
        max-height: calc(100% - 50px);
      }

      .footer {
        display: none;
      }
    }

    .block._log {
      .header {
        .status {
          .a-checkbox {
            margin-right: 10px;
          }
        }

        .op-btn {
          li {
            display: flex;
            align-items: center;
            height: 20px;

            &._current-log {
              span {
                display: block;
                max-width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              i {
                margin-left: 2px;
              }

              &:hover {
                background-color: #f56c6c;
                color: #fff;
              }
            }
          }
        }
      }

      .container {
        height: calc(100% - 50px);
        // max-height: calc(100% - 50px);
        width: 280px;
        overflow-y: auto;
        position: absolute;

        ul {
          height: calc(100% - 50px);
          //position: absolute;
          // overflow-y: scroll;

          li {
            .remark {
              color: #999;

              &._ellipsis {
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
              }
            }

            .f {
              font-size: 12px;
            }

            &:hover {
              .remark {
                color: #444;
              }
            }
          }
        }
      }
    }
  }
</style>
