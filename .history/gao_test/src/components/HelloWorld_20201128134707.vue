<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
import {requestDemoGet} from "../api/request.js";
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
        console.log("GET请求测试获取值: ",resp);
        if(resp.data.status === 200){
         this.getValue = resp;
         console.log("GET请求测试获取值: ",resp);
         console.log(new Date);
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
