<template>
  <PageWrapper>
    <div class="console">
      <!--数据卡片-->
      <a-row :gutter="24">
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <ChartCard title="访问量" :loading="loading">
            <template #extra>
              <a-tag color="purple">日</a-tag>
            </template>

            <template #total>
              <div class="py-1 px-1 flex justify-between">
                <CountTo
                  :loading="loading"
                  :startVal="1"
                  :endVal="visits.dayVisits"
                  class="text-3xl"
                />
              </div>
            </template>

            <div>
              <Trend flag="down" style="margin-right: 16px" title="日同比">
                <CountTo suffix="%" :startVal="1" :endVal="visits.rise" />
              </Trend>
              <Trend flag="up" title="周同比">
                <CountTo suffix="%" :startVal="1" :endVal="visits.decline" />
              </Trend>
            </div>

            <template #footer>
              总访问量：
              <CountTo prefix="" :startVal="1" :endVal="visits.amount" />
            </template>
          </ChartCard>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <ChartCard title="销售额" :loading="loading">
            <template #extra>
              <a-tag color="orange">周</a-tag>
            </template>
            <template #total>
              <div class="py-1 px-1 flex justify-between">
                <CountTo
                  class="text-3xl"
                  prefix="￥"
                  :startVal="1"
                  :endVal="saleroom.weekSaleroom"
                />
              </div>
            </template>
            <div class="ml-10">
              <a-progress :percent="saleroom.degree" size="small" status="active" />
            </div>
            <template #footer>
              总销售额：
              <CountTo prefix="￥" :startVal="1" :endVal="saleroom.amount" />
            </template>
          </ChartCard>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <ChartCard title="订单量" :loading="loading">
            <template #extra>
              <a-tag color="blue">日</a-tag>
            </template>
            <template #total>
              <div class="py-1 px-1 flex justify-between">
                <CountTo :startVal="1" :endVal="orderLarge.weekLarge" class="text-3xl" />
              </div>
            </template>
            <div>
              <Trend flag="down" style="margin-right: 16px" title="日同比">
                <CountTo suffix="%" :startVal="1" :endVal="orderLarge.rise" />
              </Trend>
              <Trend flag="up" title="周同比">
                <CountTo suffix="%" :startVal="1" :endVal="orderLarge.decline" />
              </Trend>
            </div>
            <template #footer>
              转化率：
              <CountTo suffix="%" :startVal="1" :endVal="orderLarge.amount" />
            </template>
          </ChartCard>
        </a-col>
        <!-- <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <a-card
          title="成交额"
          :segmented="{ content: 'hard', footer: 'hard' }"
          size="small"
          :bordered="false"
        >
          <template #extra>
            <a-tag color="red">月</a-tag>
          </template>
          <div class="py-1 px-1 flex justify-between">
            <a-skeleton active v-if="loading" :width="100" size="medium" />
            <CountTo v-else prefix="￥" :startVal="1" :endVal="volume.weekLarge" class="text-3xl" />
          </div>
          <div class="py-1 px-1 flex justify-between">
            <div class="text-sn">
              <a-skeleton active v-if="loading" :width="100" size="medium" />
              <template v-else>
                月同比
                <CountTo :startVal="1" suffix="%" :endVal="volume.rise" />
                <ArrowUpOutlined :style="{ fontSize: '16px', color: '#00ff6f' }" />
              </template>
            </div>
            <div class="text-sn">
              <a-skeleton active v-if="loading" :width="100" size="medium" />
              <template v-else>
                月同比
                <CountTo :startVal="1" suffix="%" :endVal="volume.decline" />
                <ArrowDownOutlined :style="{ fontSize: '16px', color: '#ffde66' }" />
              </template>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-between">
              <a-skeleton active v-if="loading" :width="100" size="medium" />
              <template v-else>
                <div class="text-sn"> 总成交额： </div>
                <div class="text-sn">
                  <CountTo prefix="￥" :startVal="1" :endVal="volume.amount" />
                </div>
              </template>
            </div>
          </template>
        </a-card>
      </a-col> -->
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <ChartCard :loading="loading" title="成交额">
            <template #extra>
              <a-tag color="red">月</a-tag>
            </template>

            <template #total>
              <div class="py-1 px-1 flex justify-between">
                <CountTo
                  class="text-3xl"
                  prefix="￥"
                  :loading="loading"
                  :startVal="1"
                  :endVal="volume.weekLarge"
                />
              </div>
            </template>
            <div>
              <Trend flag="down" class="mr-16" title="月同比">
                <CountTo suffix="%" :startVal="1" :endVal="volume.rise" />
              </Trend>
              <Trend flag="up" title="月同比">
                <CountTo suffix="%" :startVal="1" :endVal="volume.decline" />
              </Trend>
              <!-- <div class="text-sn">
              <a-skeleton active v-if="loading" :width="100" size="medium" />
              <template v-else>
                月同比
                <CountTo :startVal="1" suffix="%" :endVal="volume.rise" />
                <ArrowUpOutlined :style="{ fontSize: '16px', color: '#00ff6f' }" />
              </template>
            </div>
            <div class="text-sn">
              <a-skeleton active v-if="loading" :width="100" size="medium" />
              <template v-else>
                月同比
                <CountTo :startVal="1" suffix="%" :endVal="volume.decline" />
                <ArrowDownOutlined :style="{ fontSize: '16px', color: '#ffde66' }" />
              </template>
            </div> -->
            </div>

            <!-- <template #actions>
            <OneToOneOutlined />
            <SisternodeOutlined />
            <ShareAltOutlined />
          </template> -->
            <template #footer>
              总成交额：<CountTo prefix="￥" :startVal="1" :endVal="volume.amount" />
            </template>
          </ChartCard>
        </a-col>
      </a-row>

      <!--导航卡片-->
      <div class="mt-4">
        <!-- <a-row :gutter="24">
        <a-col :sm="24" :md="24" :xl="24"> -->
        <a-card :bordered="false" title="功能快捷">
          <a-card-grid
            style="width: 25%; text-align: center"
            v-for="(item, index) in iconList"
            :key="index"
            v-on="item.eventObject || {}"
          >
            <!-- <template #actions> -->
            <a-skeleton active v-if="loading" size="medium" />
            <div class="cursor-pointer" v-else>
              <p class="flex justify-center">
                <span>
                  <component
                    :is="item.icon"
                    v-if="item.icon"
                    :style="{ fontSize: item.size, color: item.color }"
                  />
                </span>
              </p>
              <p class="flex justify-center">
                <span>{{ item.title }}</span>
              </p>
            </div>
          </a-card-grid>
          <!-- </template> -->
        </a-card>
        <!-- </a-col>
      </a-row> -->
      </div>

      <!--访问量 | 流量趋势-->
      <!-- <VisiTab /> -->
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import {
    ref,
    onMounted,
    unref,
    /* , nextTick, toRef, toRefs, onBeforeMount */
  } from 'vue';
  import * as api from './api';
  //import VisiTab from './components/VisiTab.vue';
  import { CountTo } from '/@/components/CountTo2';
  import ChartCard from '/@/components/Charts/ChartCard.vue';
  import Trend from '/@/components/Trend';
  import { message } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import {
    CaretUpOutlined,
    CaretDownOutlined,
    UsergroupAddOutlined,
    BarChartOutlined,
    ShoppingCartOutlined,
    AccountBookOutlined,
    CreditCardOutlined,
    MailOutlined,
    TagsOutlined,
    SettingOutlined,
  } from '@ant-design/icons-vue';

  //const cardHeaderStyle = ref({ 'border-bottom': '1px solid #eee', 'font-size': '16px' });

  const loading = ref(true);
  const visits: any = ref({});
  const saleroom: any = ref({});
  const orderLarge: any = ref({});
  const volume: any = ref({});

  // let state: any = reactive({
  //   visits: {},
  //   saleroom: {},
  //   orderLarge: {},
  //   volume: {},
  // });

  // 图标列表
  const iconList = [
    {
      icon: 'AndroidOutlined',
      size: '42px',
      title: '用户',
      color: '#69c0ff',
      eventObject: {
        click: () => {
          message.info('测试');
        },
      },
    },
    {
      icon: 'AppleOutlined',
      size: '42px',
      title: '分析',
      color: '#69c0ff',
      eventObject: {
        click: () => {},
      },
    },
    {
      icon: 'GithubOutlined',
      size: '42px',
      title: '商品',
      color: '#ff9c6e',
      eventObject: {
        click: () => {},
      },
    },
    {
      icon: 'WeiboOutlined',
      size: '42px',
      title: '订单',
      color: '#b37feb',
      eventObject: {
        click: () => {},
      },
    },
    {
      icon: 'WechatOutlined',
      size: '42px',
      title: '票据',
      color: '#ffd666',
      eventObject: {
        click: () => {},
      },
    },
    {
      icon: 'SkypeOutlined',
      size: '42px',
      title: '消息',
      color: '#5cdbd3',
      eventObject: {
        click: () => {},
      },
    },
    {
      icon: 'SlackOutlined',
      size: '42px',
      title: '标签',
      color: '#ff85c0',
      eventObject: {
        click: () => {},
      },
    },
    {
      icon: 'SettingOutlined',
      size: '42px',
      title: '配置',
      color: '#ffc069',
      eventObject: {
        click: () => {},
      },
    },
  ];

  onMounted(async () => {
    //nextTick(async () => {
    const { data } = await api.GetList();
    console.log(data);
    //const { visits, saleroom, orderLarge, volume } = await getConsoleInfo();
    visits.value = data.visits;
    saleroom.value = data.saleroom;
    orderLarge.value = data.orderLarge;
    volume.value = data.volume;

    setTimeout(() => {
      loading.value = !unref(loading);
    }, 1000);
  });
</script>

<style lang="less" scoped></style>
