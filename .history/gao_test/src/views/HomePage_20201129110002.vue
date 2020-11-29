<template>
  <div class="home-page">
    <div cla>
      结果显示页面
      <Button type="primary" @click="goToHistory">
        go to history
        <Icon type="ios-arrow-forward"></Icon>
      </Button>
    </div>
    <Table class="table1" :columns="columns1" :data="apiList" size="small" border highlight-row></Table>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data () {
    return {
      title: '结果显示页面',
      columns1: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: 'NAME',
          key: 'name',
          width: 400,
          tooltip: true
        },
        {
          title: 'URL',
          key: 'url'
        }
      ],
      apiList: [],
      historyList: [],
      timer: ''
    }
  },
  created () {
    this.requestApi()
    // 定时5秒
    this.timer = setInterval(this.requestApi, 5000)
  },
  methods: {
    // 调用接口方法
    requestApi () {
      this.$http.get('https://api.github.com').then(res => {
        let obj = res.data
        this.apiList = []
        // 梳理数据
        for (let i in obj) {
          this.apiList.push({
            name: i,
            url: obj[i]
          })
        }
      })
    },
    // 跳转历史页面
    goToHistory () {
      this.$router.push({path: '/History'})
    }
  },
  beforeDestroy () {
    clearInterval(this.timer) // 清除定时器
  }
}
</script>

<style scoped lang="less">
.home-page {
  padding: 10px;
  .table1 {
    margin-top: 10px;
  }
  .title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }
}
</style>
