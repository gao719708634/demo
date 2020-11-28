import request from "axios"


/**
 *  post请求
 * @param data
 */
export const requestDemoPost = (data) =>{
    return request({
        //url地址（地址可以使用拼接的方法，让我们只需要写后部分，前部分连接地址我们可以固定）
        url: "https://api.apiopen.top/videoHomeTab",
        //请求方法
        method: 'post',
        data:data
    })
}

/**
 *  get请求
 */
export const requestDemoGet = (params) =>{
    return request({
        url: "https://api.apiopen.top/videoHomeTab",
        method: 'get',
        params:params
    })
}
