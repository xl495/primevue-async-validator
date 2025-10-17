import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'

// PrimeVue 样式
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

// 导入示例组件
import App from './App.vue'

// 创建应用
const app = createApp(App)

// 使用 PrimeVue
app.use(PrimeVue)

// 注册 PrimeVue 组件
app.component('Button', Button)

// 挂载应用
app.mount('#app')