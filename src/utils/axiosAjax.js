// import axios from 'axios'
import qs from 'qs';
// import router from '../router'
// axios 配置
axios.create({
    // baseURL: '192.168.8.159:8081',
    // timeout: 60000,
    // responseType: 'json',
    headers: {
        // 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        'Content-Type': 'application/x-www-form-urlencoded'
        // 'Content-Type': 'application/json'
    }
})

axios.defaults.withCredentials = true;
// http request 请求拦截器
axios.interceptors.request.use(
    config => {
        if(config.method == 'post'){
            config.data = qs.stringify(config.data)
        }
        return config
    },
    err => {
        return Promise.reject(err)
    },
)

// http response 返回拦截器
axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        let data = error.response.data
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    data = {
                        code:401,
                        message: data.msg
                    }            
                    // router.replace({                        
                    //     path: '/',                        
                    //     query: { 
                    //         redirect: router.currentRoute.fullPath 
                    //     }
                    // });
                    break;
                case 403:
                    data = {
                        code:403,
                        message: data.msg
                    }            
                    break;
                case 500:
                    data = {
                        code:500,
                        message: `请联系管理员:${data.error}`
                    }
                    break;
                default:
                    // console.log()
                    
            }
        }
        console.log(data)
        return Promise.reject(data)
    },
)

export default axios