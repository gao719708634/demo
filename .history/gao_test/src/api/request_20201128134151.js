import request from "axios"

/**
 *  post请求
 * @param data
 */
export const requestDemoPost = (data) =>{
    return request({
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
        url: "https://api.github.com/",
        method: 'get',
        params:params
    })
}
