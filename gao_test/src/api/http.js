import axios from 'axios'

// 历史记录存入sessionStorage
function setSessionStorage (val) {
  let requestDate = val.config.metadata.RequestDate // 调用时间
  let responseDate = new Date().getTime() // 响应时间
  let oldHistoryList = sessionStorage.getItem('historyList') ? JSON.parse(sessionStorage.getItem('historyList')) : []
  oldHistoryList.push({
    requestDate: requestDate, // 调用时间
    requestStatus: val.request.status, // 调用状态
    waiting: responseDate - requestDate // 加载时间
  })
  sessionStorage.setItem('historyList', JSON.stringify(oldHistoryList))
}

// 请求拦截器
axios.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/json'

    // 新增调用时间戳
    config.metadata = { RequestDate: new Date().getTime() }
    return config
  },
  error => {
    console.log('请求超时，请稍后重试！')
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(res => {
  console.log('响应拦截器成功------------------')
  console.log(res)
  setSessionStorage(res)
  return res
},
error => {
  console.log('请求失败，请稍后重试！')
  setSessionStorage(error)
  return Promise.reject(error)
}
)

export default axios
