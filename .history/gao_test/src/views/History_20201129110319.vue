<template>
  <div class="history">
    <div class="header">
        <Button type="primary" class="go-back" @click="goToHomepage">
          <Icon type="ios-arrow-back"></Icon>
          go to homepage
          </Button>
      历史记录页面
    </div>
    <Table class="table1" :columns="columns1" :data="historyList" size="small" border highlight-row></Table>
  </div>
</template>

<script>
export default {
  name: 'History',
  data () {
    return {
      title: '历史记录页面',
      columns1: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '调用时间',
          key: 'requestDate',
          width: 400,
          tooltip: true,
          render: (h, params) => {
            return h('div', {}, this.formatDate(params.row.requestDate))
          }
        },
        {
          title: '调用状态',
          key: 'requestStatus',
          render: (h, params) => {
            return h('div', {}, Number(params.row.requestStatus) === 200 ? '成功' : '失败')
          }
        },
        {
          title: '加载时间(毫秒)',
          key: 'waiting'
        }
      ],
      historyList: []
    }
  },
  created () {
    // 获取sessionStorage
    this.historyList = sessionStorage.getItem('historyList') ? JSON.parse(sessionStorage.getItem('historyList')) : []
  },
  methods: {
    formatDate (time) {
      let datetime = new Date(time)
      // 获取年月日时分秒值  slice(-2)过滤掉大于10日期前面的0
      let year = datetime.getFullYear()
      let month = ('0' + (datetime.getMonth() + 1)).slice(-2)
      let date = ('0' + datetime.getDate()).slice(-2)
      let hour = ('0' + datetime.getHours()).slice(-2)
      let minute = ('0' + datetime.getMinutes()).slice(-2)
      let second = ('0' + datetime.getSeconds()).slice(-2)
      // 拼接
      let result = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
      return result
    },
    // 跳转结果显示页
    goToHomepage () {
      this.$router.push({path: '/'})
    }
  }
}
</script>

<style scoped lang="less">
.history {
  padding: 10px;
  .header{
    text-align: center;
    .history-btn{
      float: right;
    }
  }
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
