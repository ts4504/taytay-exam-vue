import './assets/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-persistedstate-plugin'
import locale from 'element-plus/dist/locale/zh-cn'

const pinia = createPinia()
const persist = createPersistedState()
pinia.use(persist)
const app = createApp(App)
app.use(ElementPlus,{locale})
app.use(router)
app.use(pinia)


app.mount('#app')
