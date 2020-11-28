<template>
  <div class="view-pdf">
    <div id="pdf"></div>
  </div>
</template>
<script>
import Pdfh5 from "pdfh5";
import 'pdfh5/css/pdfh5.css';
export default {
  name: 'ViewPdf',
  components: {
  },
  props: {
    src: String
  },
  computed: {

  },
  mounted() {
    //实例化
    this.pdfh5 = new Pdfh5("#pdf", {
      pdfurl: this.src,
      scale: 1,
      lazy: false
    }).on("complete", function (status, msg, time) { //监听完成事件
      console.log("状态：" + status + "，信息：" + msg + "，耗时：" + time + "毫秒，总页数：" + this.totalNum);
    })

  },
  data() {
    return {
      pdfh5: null,
    }
  }
};
</script>
<style lang="less">
#pdf {
  width: 100%;
  height: 100%;
  img {
    width: 100%;
  }
}
.view-pdf {
  position: relative;
  margin: auto;
  width: 100%;
  height: 100%;
  .pdframe {
    width: 100%;
    height: 100%;
  }
}
</style>
