<template>
  <div class="view-rate"
    ref="rates"
    @click="showRateList = !showRateList">
    <span>{{ value }}X</span>
    <div class="view-rate-list"
      v-show="showRateList">
      <div class="rate-item"
        v-for="(s, i) in rates"
        :key="i"
        @click="onChangeRate(s)">
        <span>{{ s }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ViewRates',
  props: {
    value: Number,
    rates: {
      type: Array,
      default: function () {
        return ['2.0', '1.5', '1.0', '0.5'];
      }
    }
  },
  data: function () {
    return { showRateList: false };
  },
  computed: {},
  model: {
    prop: 'value',
    event: 'change'
  },
  methods: {
    onChangeRate(s) {
      this.$emit('change', Number.parseFloat(s));
    }
  },
  mounted() {
    document.addEventListener('click', e => {
      //点击文档其他区域时隐藏弹出项
      const rates = this.$refs.rates;
      if (rates && !rates.contains(e.target)) {
        this.showRateList = false;
      }
    });
  }
};
</script>
<style lang="less">
.view-rate {
  position: absolute;
  right: 20px;
  top: -28px;
  padding: 5px 20px;
  .view-rate-list {
    position: absolute;
    right: 0;
    bottom: 30px;
    .rate-item {
      padding: 5px 20px;
      text-align: right;
    }
    .rate-item:hover {
      background-color: #fff;
      color: #050509;
    }
  }
  cursor: pointer;
}
</style>
