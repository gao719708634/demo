<template>
  <div class="view-video"
    :class="{'poster':mp3Type}"
    id="viewVideo">
    <video id="video">
    </video>
    <div v-show="tryState"
      class="try-mask">
      <i class="el-icon-loading"></i>
    </div>
  </div>
</template>
<script>
/*
 *@description: 音视频播放器组件
 *@author: gaoliang
 *@date: 2020-07-01
 *@version: V1.0.0
 *@use: <player-view :fileId="" appId=""></player-view> 
 * 文件fileId和appId必传
 */
export default {
  name: 'PlayerView',
  components: {
  },
  props: {
    src: String,
    isMp3: {
      type: Boolean,
      default: false
    },
    poster: {
      type: String,
      default: ''
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    loop: {
      type: Boolean,
      default: false
    },
    playsinline: {
      type: Boolean,
      default: false
    },
    fileId: {
      type: String,
      default: ''
    },
    appId: {
      type: String,
      default: '1301860064'
    },
    time: {
      type: Number,
      default: 0
    },
    muted: {
      type: Boolean,
      default: false
    },
    isReport: {
      type: Boolean,
      default: false
    },
  },
  data: function () {
    return {
      mp3Type: this.isMp3,
      player: '', //实例化对象
      curTime: this.time || 0,
      tryTimes: 0, // 当前尝试次数
      maxTimes: 3, // 最多尝试3次
      tryState: false, // 当前在尝试
      tryOpen: false,
      timer: 1500 // 尝试间隔
    };
  },
  computed: {
  },
  filters: {
  },
  methods: {
    loadScript() {   //加载播放器js
      let tcPlayer = document.getElementById('tcPlayer');
      if (tcPlayer) {
        this.initVideo();
      } else {
        let hlsScript = document.createElement('script');
        hlsScript.type = 'text/javascript';
        hlsScript.src = 'https://imgcache.qq.com/open/qcloud/video/tcplayer/libs/hls.min.0.13.2m.js';
        document.getElementsByTagName('head')[0].appendChild(hlsScript);
        let configScript = document.createElement('script');
        configScript.type = 'text/javascript';
        configScript.id = 'tcPlayer';
        configScript.src = 'https://imgcache.qq.com/open/qcloud/video/tcplayer/tcplayer.v4.1.min.js';
        document.getElementsByTagName('head')[0].appendChild(configScript);
        const self = this;

        configScript.onload = function () {
          self.tryOpen = true;
          // self.fileId = self.fileId;
          self.initVideo();
        }
      }
    },
    initVideo() {    //初始化播放器
      this.player = window.TCPlayer('video', {
        fileID: this.fileId,
        appID: this.appId,
        plugins: {
          muted: this.muted,     //是否静音
          autoplay: this.autoplay,   //是否自动播放
          poster: this.poster,   //封面
          loop: this.loop,   //循环播放
          language: this.appLang === 'cn' ? 'zh-CN' : 'en-US',
          ContinuePlay: { // 开启续播功能
            auto: true, //[可选] 是否在视频播放后自动续播
            text: '上次播放至 ', //[可选] 提示文案
            btnText: '恢复播放' //[可选] 按钮文案
          },
        }
      });
      this.setPlayTime(this.curTime);  //设置播放上次播放记录

      let self = this;
      this.player.on('ready', r => {
        if (self.isReport) {
          self.monitorTimeChange();
        }
        self.tryOpen = false;
        self.tryState = false;
      });
      this.player.on('error', r => {
        if (r.data.code === 4) {
          if (self.tryOpen && self.maxTimes > self.tryTimes) { // 开始时音视频播放失败后尝试
            self.tryState = true;
            self.player.dispose();
            self.createNewView();
            setTimeout(() => {
              self.tryTimes++;
              self.player = null;
              self.initVideo();
            }, self.timer);
          } else {
            self.tryState = false;
          }
        } else {
          self.$message.warning('播放失败!');
        }
      });
    },
    monitorTimeChange() {   //监听时间变化，保存到后台
      const self = this;
      this.player.on('timeupdate', function () {
        let curTime = self.player.currentTime();
        if (curTime - self.curTime > 10) {
          self.curTime = curTime;
          const updateStudyProgress = self.$parent.updateStudyProgress
          if (typeof updateStudyProgress === 'function') {
            updateStudyProgress(curTime);
          }
        }
      });
    },
    setPlayTime(time) {    //设置播放位置
      this.player.currentTime(time);
    },
    getPlayTime() {    //获取当前播放时间
      return this.player.currentTime();
    },
    destroy() {    //销毁播放器实例
      this.player.dispose();
    },
    createNewView() {
      let videoDom = document.createElement('video');
      videoDom.id = 'video';
      videoDom.style.width = '100%';
      videoDom.style.height = '100%';
      document.getElementById('viewVideo').appendChild(videoDom);
    }
  },
  created() {
  },
  mounted() {
    this.loadScript();
  },
  watch: {
    fileId() {
      // console.log(newVal);
      this.initVideo();
    }
    // 'fileId': function (newVal) {
    //   console.log(newVal);
    //   this.initVideo();
    // },
  }
};
</script>

<style lang="less" scoped>
.view-video {
  position: relative;
  height: 100%;
  #video {
    width: 100%;
    height: 100%;
  }
  .controls-enter,
  .controls-leave-to {
    opacity: 0;
  }
  .try-mask {
    background: #000;
    width: 100%;
    height: 100%;
    text-align: center;
    padding-top: 100px;
    i {
      color: #fff;
      font-size: 30px;
    }
  }
  .video-js {
    background: none;
  }
}
.poster {
  // background: url('~@/assets/img/poster-MP3.png') no-repeat center;
  // background-size: 103px;
}
</style>
