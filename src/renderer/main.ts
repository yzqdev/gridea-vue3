import { createApp } from 'vue'

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import './styles/index.scss'

import '@renderer/assets/styles/tailwind.css'
import './permission'
import App from './App.vue'
import router from './router'
import { errorHandler } from './error'
import { createPinia } from 'pinia'



import { i18n } from "./i18n"

import TitleBar from "./components/common/TitleBar.vue"
const app = createApp(App)
app.use(ElementPlus, { i18n: i18n.global.t })
app.use(router)
app.use(createPinia())
app.use(i18n)
errorHandler(app)

// 全局引入 TitleBar 组件
app.component("TitleBar", TitleBar);

app.mount("#app")
