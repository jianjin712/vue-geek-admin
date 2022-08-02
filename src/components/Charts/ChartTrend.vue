<template>
  <div class="chart-trend">
    {{ term }}
    <span>{{ rate }}%</span>
    <span :class="['trend-icon', trend]">
      <!-- <a-icon :type="'caret-' + trend" /> -->
      <CaretUpOutlined v-if="type" />
      <CaretDownOutlined v-else />
    </span>
  </div>
</template>

<script lang="ts">
  import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons-vue';
  //import { CaretUpOutlined } from '@ant-design/icons-vue';
  export default {
    name: 'ChartTrend',
    components: { CaretUpOutlined, CaretDownOutlined },
    props: {
      term: {
        type: String,
        default: '',
        required: true,
      },
      percentage: {
        type: Number,
        default: null,
      },
      type: {
        type: Boolean,
        default: null,
      },
      target: {
        type: Number,
        default: 0,
      },
      value: {
        type: Number,
        default: 0,
      },
      fixed: {
        type: Number,
        default: 2,
      },
    },
    data() {
      return {
        trend: (this.type && 'up') || 'down',
        rate: this.percentage,
      };
    },
    created() {
      const type = this.type === null ? this.value >= this.target : this.type;
      this.trend = type ? 'up' : 'down';
      this.rate = (
        this.percentage === null
          ? (Math.abs(this.value - this.target) * 100) / this.target
          : this.percentage
      ).toFixed(this.fixed);
    },
  };
</script>

<style lang="less">
  .chart-trend {
    display: inline-block;
    font-size: 14px;
    line-height: 22px;

    .trend-icon {
      font-size: 12px;

      &.up,
      &.down {
        margin-left: 4px;
        position: relative;
        top: 1px;

        i {
          font-size: 12px;
          transform: scale(0.83);
        }
      }

      &.up {
        color: #f5222d;
      }

      &.down {
        color: #52c41a;
        top: -1px;
      }
    }
  }
</style>
