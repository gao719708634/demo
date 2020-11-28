<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
import {requestDemoPost,requestDemoGet} from "../api/request.js"
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  created() {
    this.getPageData();
  },
  methods: {
    getPageData(){
      requestDemoGet().then(resp=>{
        if(resp.data.code === 200){
         this.getValue = resp.data.result;
         console.log("GET请求测试获取值: ",resp.data.result);
         console.log(" Author：孤水寒月\n Time:2020/09/17\n BlogAddress：https://www.cnblogs.com/nanstar/\n",new Date);
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
