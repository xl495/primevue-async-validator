// 导出组件
export { default as Form } from './components/Form.vue'
export { default as FormItem } from './components/FormItem.vue'
export { default as FInputText } from './components/fields/FInputText.vue'
export { default as FInputNumber } from './components/fields/FInputNumber.vue'
export { default as FDropdown } from './components/fields/FDropdown.vue'
export { default as FCalendar } from './components/fields/FCalendar.vue'
export { default as FTextarea } from './components/fields/FTextarea.vue'

// 导出 composables
export { useValidation } from './composables/useValidation'
export { useFormItem, useFormItemBindings } from './composables/useFormItem'

// 导出类型
export * from './types'

// 导出插件安装函数（可选）
import type { App } from 'vue'
import Form from './components/Form.vue'
import FormItem from './components/FormItem.vue'
import FInputText from './components/fields/FInputText.vue'
import FInputNumber from './components/fields/FInputNumber.vue'
import FDropdown from './components/fields/FDropdown.vue'
import FCalendar from './components/fields/FCalendar.vue'
import FTextarea from './components/fields/FTextarea.vue'

const components = {
  Form,
  FormItem,
  FInputText,
  FInputNumber,
  FDropdown,
  FCalendar,
  FTextarea
}

export default {
  install(app: App) {
    Object.keys(components).forEach(key => {
      app.component(key, components[key as keyof typeof components])
    })
  }
}