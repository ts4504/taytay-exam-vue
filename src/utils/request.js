import axios from "axios";
import { ElMessage } from "element-plus";

import router from "@/router";
import { useTokenStore } from "@/stores/token";

const baseURL = '/api'
const instance = axios.create({ baseURL })

//请求拦截器：为每次请求的请求头上都配上token
instance.interceptors.request.use(function (config) {
    let tokenStore = useTokenStore()
    if (tokenStore.token) {
        config.headers.Authorization = tokenStore.token
    }
    return config
}, function (error) {
    return Promise.reject(error)
}
)


//响应拦截器：拦截是失败的请求，为其做一个统一的处理（例如弹出错误信息）
instance.interceptors.response.use(
    result => {
        if (result.data.code === 0) {
            return result.data;
        }
        ElMessage.error(result.data.message || '服务器异常，请稍后重试。。。');
        return Promise.reject(result.data)
    },
    err => {
        if (err.response.status === 401) {
            ElMessage.warning("未登录，请登录！")
            router.push('/login')
        }
        ElMessage.error(result.data.message || '服务器异常，请稍后重试。。。')
        return Promise.reject(err)
    }
)

export default instance