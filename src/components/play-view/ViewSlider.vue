<template>
  <div class="view-slider"
    :style="sliderStyles">
    <div class="view-slider-bak"
      :style="sliderBakStyles"
      @mousedown="onAdjust"
      @mousemove.prevent="onAdjust"
      @mouseup="onAdjust"
      @mouseleave="onAdjust">
      <div class="view-slider-bar">
        <div class="view-slider-rate"
          :style="sliderRateStyles"></div>
      </div>
      <div class="view-slider-pos"
        :style="sliderPosStyles"
        @mouseout="onHoverPos"
        @mouseover="onHoverPos">
        <div class="pos-tip"
          v-show="(hoverPos || adjusting) && tooltip">
          {{ tooltip }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ViewSlider',
  props: {
    value: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 1
    },
    size: {
      type: Number,
      default: 0.2
    },
    formatTooltip: {
      type: Function
    }
  },
  data: function () {
    return {
      adjusting: false, //正在调节
      adjustValue: this.value,
      hoverPos: false
    };
  },
  model: {
    prop: 'value',
    event: 'changed'
  },
  watch: {
    value: function (newValue, oldValue) {
      console.debug(`ViewSilder::watch.value:${oldValue}-->${newValue}`);
      this.adjustValue = newValue;
    }
  },
  computed: {
    sliderRate() {
      return (100 * this.adjustValue) / this.max;
    },
    sliderRateStyles() {
      return { height: this.size / 2 + 'rem', width: this.sliderRate + '%' };
    },
    sliderPosStyles() {
      const styles = {
        top: this.size + 'rem',
        height: this.size + 'rem'
      };
      styles.width = styles.height;
      styles.left = this.sliderRate + '%';
      styles.transform = `translateX(-50%)`;
      styles.transform += `scale(${this.hoverPos || this.adjusting ? 1.2 : 1})`;
      return styles;
    },
    sliderBakStyles() {
      return {
        padding: this.size * 1.25 + 'rem' + ' 0'
      };
    },
    sliderStyles() {
      return {
        margin: '0 ' + this.size + 'rem'
      };
    },
    tooltip() {
      if (typeof this.formatTooltip == 'function') {
        return this.formatTooltip(this.adjustValue);
      } else if (this.formatTooltip === null) {
        return null;
      }
      return this.sliderRate.toFixed();
    }
  },
  filters: {},
  methods: {
    onAdjust(e) {
      if (e.type == 'mousedown') {
        this.adjusting = true;
      }
      if (
        (e.type == 'mousemove' || e.type == 'mouseleave') &&
        !this.adjusting
      ) {
        return;
      }
      const rect = e.currentTarget.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      let value = (this.max * offsetX) / rect.width;
      if (value <= 0) {
        value = 0;
      } else if (value > this.max) {
        value = this.max;
      }
      this.adjustValue = value;
      this.$emit('input', this.adjustValue);
      if (e.type == 'mouseup' || e.type == 'mouseleave') {
        this.$emit('change', this.adjustValue);
        this.adjusting = false;
      }
    },
    onHoverPos(e) {
      this.hoverPos = e.type == 'mouseover';
    }
  }
};

export function formatTime(value) {
  let time = parseInt(value, 10);
  if (Number.isNaN(time)) return '';
  let strs = [];
  let hour = Math.floor(time / 3600);
  if (hour) {
    strs.push(hour < 10 ? '0' + hour : hour);
  }
  let minute = Math.floor((time - hour * 3600) / 60);
  strs.push(minute < 10 ? '0' + minute : minute);
  let second = time - hour * 3600 - minute * 60;
  strs.push(second < 10 ? '0' + second : second);
  return strs.join(':');
}
</script>

<style lang="less">
.view-slider {
  .view-slider-bak {
    position: relative;
    .view-slider-bar {
      width: 100%;
      background-color: #fff;
      border-radius: 10px;
      .view-slider-rate {
        background-color: #7685f5;
        border-radius: 10px;
      }
    }
    .view-slider-pos {
      position: absolute;
      border-radius: 50%;
      background-color: #fff;
      transition: transform 0.2s ease 0s;
      .pos-tip {
        position: absolute;
        padding: 20% 40%;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        background-color: #7685f5;
        border-radius: 12%;
      }
      .pos-tip:after {
        content: '\00a0';
        width: 0;
        height: 0;
        display: block;
        position: absolute;
        bottom: -1.1rem;
        left: 50%;
        transform: translateX(-50%);
        border-style: solid;
        border-width: 0.7rem;
        border-color: #fff transparent transparent transparent;
      }
    }
  }
  cursor: pointer;
}
</style>
