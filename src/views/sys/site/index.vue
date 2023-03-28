<template>
  <ScrollContainer>
    <a-card>
      <div ref="wrapperRef" :class="prefixCls">
        <Tabs tab-position="left" :tabBarStyle="tabBarStyle">
          <template v-for="item in settingList" :key="item.key">
            <TabPane :tab="item.name">
              <component :is="item.component" />
            </TabPane>
          </template>
        </Tabs>
      </div>
    </a-card>
  </ScrollContainer>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Tabs } from 'ant-design-vue';
  import { ScrollContainer } from '/@/components/Container/index';
  //import { settingList } from './data';
  import BaseSetting from './BaseSetting.vue';

  //import type { TabsProps } from 'ant-design-vue';

  export default defineComponent({
    components: {
      ScrollContainer,
      Tabs,
      TabPane: Tabs.TabPane,
      BaseSetting,
    },
    setup() {
      // const tabPosition = ref<TabsProps['tabPosition']>('left');

      return {
        prefixCls: 'account-setting',
        //settingList,
        tabBarStyle: {
          width: '220px',
        },
      };
    },
  });
</script>
