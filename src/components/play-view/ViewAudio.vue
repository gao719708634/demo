<template>
  <div class="view-audio">
    <audio ref="audio"
      class="audio"
      :src="src"
      :autoplay="autoplay"
      :loop="loop"
      :muted="muted"
      controlsList="nodownload"
      @contextmenu="onContextMenu"
      @load="onReadyState"
      @loadstart="onReadyState"
      @loadedmetadata="onReadyState"
      @loadeddata="onReadyState"
      @durationchange="onReadyState"
      @seeked="onSeeked"
      @volumechange="onVolume"
      @ratechange="onRate"
      @pause="onPause"
      @play="onPlay"
      @playing="onPlaying"
      @progress="onProgress"
      @timeupdate="onTime"
      @ended="onEnded"
      @error="onError">
      <p>Your browser doesn't support HTML5 audio.</p>
      <slot></slot>
    </audio>
    <div class="audio-controls"
      ref="controls"
      v-if="controls">
      <view-rates :value="playbackRate"
        @change="onChangeRate"></view-rates>
      <div class="audio-time">
        <span>{{ currentTime | formatTime }}</span>
        <view-slider class="audio-progress"
          :value="currentTime"
          :max="duration"
          :format-tooltip="null"
          @input="onChangeCurrentTime"></view-slider> <span>{{ duration | formatTime }}</span>
      </div>
      <div class="audio-btn">
        <span class="progress-btn retreat-btn"
          @click="onChangeCurrentTime('retreat')">-15s</span>
        <i class="iconfont"
          :class="isPlaying ? 'pause-btn' : 'play-btn'"
          @click="clickPlay" />
        <span class="progress-btn advance-btn"
          @click="onChangeCurrentTime('advance')">15s+</span>
      </div>

      <!-- <div class="audio-btn"
        @click="clickMuted">
        <i class="iconfont"
          :class="muteVolume ? 'icon-sound' : 'icon-sound-mute'" />
      </div> -->
      <!-- <view-slider class="audio-volume"
        :value="muteVolume"
        :format-tooltip="null"
        @input="onChangeVolume"></view-slider> -->
    </div>
  </div>
</template>
<script>
import ViewSlider from './ViewSlider.vue';
import ViewRates from './ViewRates.vue';
import { formatTime } from './ViewSlider.vue';

export default {
  name: 'ViewAudio',
  components: {
    [ViewSlider.name]: ViewSlider,
    [ViewRates.name]: ViewRates
  },
  props: {
    src: String,
    controls: {
      type: Boolean,
      default: true
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    muted: {
      type: Boolean,
      default: false
    },
    loop: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      duration: 0, //时长
      currentTime: 0, //当前播放时长
      playbackRate: 1, //倍速
      volume: 0, //音量
      isMuted: false, //静音
      isPlaying: false, //播放中
      states: [] //记录视频初始化状态
    };
  },
  computed: {
    muteVolume() {
      return this.isMuted ? 0 : this.volume;
    }
  },
  filters: {
    formatTime: function (value) {
      return formatTime(value);
    }
  },
  methods: {
    onChangeCurrentTime(value) {
      switch (value) {
        case 'advance':
          this.$refs.audio.currentTime += 15;
          break;
        case 'retreat':
          this.$refs.audio.currentTime -= 15;
          break;
        default:
          this.$refs.audio.currentTime = value;
          break;
      }

    },
    onChangeVolume(value) {
      this.$refs.audio.volume = value;
    },
    onChangeRate(value) {
      this.$refs.audio.playbackRate = value;
    },
    clickPlay() {
      const audio = this.$refs.audio;
      audio.paused ? audio.play() : audio.pause();
    },
    clickMuted() {
      this.$refs.audio.muted = !this.$refs.audio.muted;
    },
    onReadyState(e) {
      this.pushState(e);
      this.duration = e.target.duration;
      this.playbackRate = e.target.playbackRate;
      this.volume = e.target.volume;
      this.isMuted = e.target.muted;
    },
    onRate(e) {
      this.pushState(e);
      this.playbackRate = e.target.playbackRate;
    },
    onVolume(e) {
      this.pushState(e);
      this.volume = e.target.volume;
      this.isMuted = e.target.muted;
    },
    onSeeked(e) {
      this.pushState(e);
    },
    onContextMenu(e) {
      this.pushState(e);
      //e.preventDefault(); return false;//禁用右键菜单，避免用户下载视频（其实没什么用）
    },
    onPause(e) {
      this.pushState(e);
      this.isPlaying = !e.target.paused;
    },
    onPlay(e) {
      this.pushState(e);
      this.isPlaying = !e.target.paused;
    },
    onPlaying(e) {
      this.pushState(e);
      this.isPlaying = !e.target.paused;
    },
    onProgress(e) {
      // console.log(e);
    },
    onTime(e) {
      // console.log(e);
      this.currentTime = e.target.currentTime;
    },
    getCurrentTime() {
      return this.currentTime;
    },
    onEnded(e) {
      this.pushState(e);
    },
    onError(e) {
      this.pushState(e);
    },
    pushState(e) {
      // console.log(e);
      const states = this.states;
      const len = states.length;
      if (!len || states[len - 1] != e.type) {
        states.push(e.type);
      }
    },
    formatTime(value) {
      return formatTime(value);
    }
  }
};
</script>
<style lang="less">
.view-audio {
  height: 100%;
  position: relative;
  background: rgba(0, 0, 0, 1);
  // opacity: 0.2;
  .audio {
    margin: auto;
  }
  .audio-controls {
    position: absolute;
    bottom: 100px;
    width: 100%;
    align-items: center;
    color: #fff;
    font-size: 14px;
    .audio-btn {
      cursor: pointer;
      font-size: 0;
      margin-top: 30px;
      .pause-btn {
        display: inline-block;
        width: 44px;
        height: 44px;
        font-size: 44px;
        vertical-align: middle;
        background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMzYgMzYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogICAgPHBhdGggZD0iTTExLDEwIEwxNywxMCAxNywyNiAxMSwyNiBNMjAsMTAgTDI2LDEwIDI2LDI2IDIwLDI2IiBmaWxsPSIjZmZmIj48L3BhdGg+DQo8L3N2Zz4=);
      }
      .play-btn {
        display: inline-block;
        width: 44px;
        height: 44px;
        vertical-align: middle;
        background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMzYgMzYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogICAgPHBhdGggZD0iTTExLDEwIEwxOCwxMy43NCAxOCwyMi4yOCAxMSwyNiBNMTgsMTMuNzQgTDI2LDE4IDI2LDE4IDE4LDIyLjI4IiBmaWxsPSIjZmZmIj48L3BhdGg+DQo8L3N2Zz4=);
        background-size: 44px;
      }
      .progress-btn {
        display: inline-block;
        width: 44px;
        height: 44px;
        color: #fff;
        font-size: 14px;
        text-align: center;
        line-height: 44px;
        background: url('~@/assets/img/retreat_btn.png') no-repeat center;
        background-size: 44px;
        vertical-align: middle;
        margin-right: 31px;
      }
      .advance-btn {
        background: url('~@/assets/img/advance_btn.png') no-repeat center;
        background-size: 44px;
        margin-right: 0;
        margin-left: 31px;
      }
    }
    .audio-btn:first-of-type {
      margin-left: 20px;
    }
    .audio-btn:last-of-type {
      margin-right: 20px;
    }
    .audio-btn:hover {
      // background-color: #333;
    }
    .audio-progress {
      width: 250px;
      display: inline-block;
      vertical-align: middle;
    }
    .audio-time {
      width: 100%;
      padding: 0 20px;
      font-size: 0;
      span {
        font-size: 10px;
        vertical-align: middle;
      }
    }
    .audio-volume {
      flex: 1 0 20px;
    }
  }
}
</style>
