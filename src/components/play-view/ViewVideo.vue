<template>
  <div class="view-video">
    <video id="video"></video>

  </div>
</template>
<script>
export default {
  name: 'ViewVideo',
  components: {
  },
  props: {
    src: String,
    poster: String,
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
    },
    playsinline: {
      type: Boolean,
      default: false
    }
    // controls: {
    //   type: Boolean,
    //   default: false
    // }
  },
  data: function () {
    return {
      player: {}
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
        // let tcplayerCss = document.createElement('link');
        // tcplayerCss.type = 'text/css';
        // tcplayerCss.href = 'https://imgcache.qq.com/open/qcloud/video/tcplayer/tcplayer.css';
        // document.getElementsByTagName('head')[0].appendChild(tcplayerCss);
        let configScript = document.createElement('script');
        configScript.type = 'text/javascript';
        configScript.id = 'tcPlayer';
        configScript.src = 'https://imgcache.qq.com/open/qcloud/video/tcplayer/tcplayer.v4.1.min.js';
        document.getElementsByTagName('head')[0].appendChild(configScript);
        const self = this;
        configScript.onload = function () {
          self.initVideo();
        }
      }
    },
    initVideo() {    //初始化播放器
      this.player = TCPlayer('video', { // player-container-id 为播放器容器 ID，必须与 html 中一致
        fileID: '5285890804685800923', // 请传入需要播放的视频 filID（必须）
        appID: '1301860064'
      });
      // this.player = new TcPlayer('video', {
      //   "mp4": "//1256993030.vod2.myqcloud.com/d520582dvodtransgzp1256993030/7732bd367447398157015849771/v.f40.mp4",
      //   "mp4_hd": "https://bsl-2-dev-1301860064.cos.ap-guangzhou.myqcloud.com/trans/files/490/2020/06/24/25e29c86-bdd9-cab4-dba1-7d4a52b30118.mp4",
      //   "mp4_sd": "https://bsl-2-dev-1301860064.cos.ap-guangzhou.myqcloud.com/trans/files/490/2020/06/24/25e29c86-bdd9-cab4-dba1-7d4a52b30118.mp4",
      //   "autoplay": true,      //iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
      //   "poster": "http://www.test.com/myimage.jpg",
      //   "width": '480',
      //   "height": '320',
      //   "QualitySwitcherMenuButton": true,
      //   "playbackRates": [0.5, 1, 1.25, 1.5, 2]
      // });

    },
    setPlayTime() {
      this.player.currentTime(10);
    },
    destroy() {
      this.player.dispose();
    }
  },
  created() {
    this.loadScript();
  },
  mounted() {
  }
};
</script>

<style lang="less">
.view-video {
  width: 100%;
  #video {
    width: 100%;
    height: 210px;
  }
  .vcp-slider .vcp-slider-thumb {
    margin-left: -10px;
  }
}
</style>
