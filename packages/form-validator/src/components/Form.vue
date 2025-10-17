<template>
  <form class="p-form" @submit.prevent>
    <slot />
  </form>
</template>

<script setup lang="ts">
import { reactive, provide, toRef, watch } from 'vue'
import { useValidation } from '../composables/useValidation'
import { FormContextKey } from '../types'
import type { FormProps, FormExpose, FormItemContext, FormContext, TriggerType } from '../types'

// 定义 props
const props = withDefaults(defineProps<FormProps>(), {
  labelWidth: '100px',
  labelPosition: 'right',
  disabled: false,
  validateOnBlur: true,
  validateOnChange: true
})

// 使用验证 composable
const { errors, validate: validateForm, validateField: validateSingleField, clearValidate } = useValidation()

// 存储所有的表单项
const fields = new Set<FormItemContext>()

// 保存初始值，用于重置
const initialModel = reactive({ ...props.model })

// 监听 model 变化，更新初始值（用于动态表单）
let isResetting = false
watch(
  () => props.model,
  (newModel) => {
    if (!isResetting) {
      Object.assign(initialModel, newModel)
    }
  },
  { deep: true, immediate: true }
)

/**
 * 注册表单项
 */
const registerField = (field: FormItemContext) => {
  fields.add(field)
}

/**
 * 注销表单项
 */
const unregisterField = (field: FormItemContext) => {
  fields.delete(field)
  // 清除该字段的错误
  if (field.prop) {
    delete errors.value[field.prop]
  }
}

/**
 * 验证指定字段
 */
const validateField = async (prop: string, trigger?: TriggerType) => {
  // 根据配置判断是否需要验证
  const triggers = Array.isArray(trigger) ? trigger : (trigger ? [trigger] : [])

  // 如果指定了触发器，检查是否应该验证
  if (triggers.length > 0) {
    const shouldValidateBlur = triggers.includes('blur') && props.validateOnBlur
    const shouldValidateChange = triggers.includes('change') && props.validateOnChange

    // 如果没有任何触发器应该被验证，则返回
    if (!shouldValidateBlur && !shouldValidateChange) return
  }

  if (!props.rules || !props.rules[prop]) {
    return
  }

  try {
    await validateSingleField(props.model, props.rules, prop, trigger)
    // 更新对应 FormItem 的错误状态
    const field = Array.from(fields).find(f => f.prop === prop)
    if (field) {
      field.error.value = ''
    }
  } catch (error) {
    // 更新对应 FormItem 的错误状态
    const field = Array.from(fields).find(f => f.prop === prop)
    if (field) {
      field.error.value = errors.value[prop] || ''
    }
  }
}

/**
 * 验证整个表单
 */
const validate = async (): Promise<Record<string, any>> => {
  if (!props.rules) {
    return props.model
  }

  try {
    const result = await validateForm(props.model, props.rules)
    // 清除所有字段的错误显示
    fields.forEach(field => {
      if (field.prop) {
        field.error.value = ''
      }
    })
    return result
  } catch (error) {
    // 更新所有字段的错误显示
    fields.forEach(field => {
      if (field.prop && errors.value[field.prop]) {
        field.error.value = errors.value[field.prop] || ''
      }
    })
    throw error
  }
}

/**
 * 验证指定字段（支持数组）
 */
const validateFields = async (props: string | string[]): Promise<void> => {
  const propList = Array.isArray(props) ? props : [props]
  const promises = propList.map(prop => validateField(prop))
  await Promise.all(promises)
}

/**
 * 重置表单
 */
const resetFields = () => {
  isResetting = true
  // 重置所有字段的值
  Object.keys(props.model).forEach(key => {
    props.model[key] = initialModel[key]
  })
  // 清除所有验证错误
  clearValidate()
  // 清除所有 FormItem 的错误显示
  fields.forEach(field => {
    field.resetField()
  })
  setTimeout(() => {
    isResetting = false
  }, 0)
}

/**
 * 清除验证
 */
const clearValidateFields = (fieldProps?: string | string[]) => {
  clearValidate(fieldProps)

  if (!fieldProps) {
    // 清除所有字段
    fields.forEach(field => {
      field.clearValidate()
    })
  } else {
    // 清除指定字段
    const propList = Array.isArray(fieldProps) ? fieldProps : [fieldProps]
    propList.forEach(prop => {
      const field = Array.from(fields).find(f => f.prop === prop)
      if (field) {
        field.clearValidate()
      }
    })
  }
}

// 提供表单上下文
const formContext: FormContext = {
  model: toRef(() => props.model),
  rules: toRef(() => props.rules),
  labelWidth: toRef(() => props.labelWidth),
  labelPosition: toRef(() => props.labelPosition),
  disabled: toRef(() => props.disabled),
  registerField,
  unregisterField,
  validateField
}

provide(FormContextKey, formContext)

// 暴露方法给父组件
defineExpose<FormExpose>({
  validate,
  validateField: validateFields,
  resetFields,
  clearValidate: clearValidateFields
})
</script>

<style scoped>
.p-form {
  width: 100%;
}
</style>