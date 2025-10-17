import { inject, computed, watch } from 'vue'
import { FormItemContextKey, FormContextKey } from '../types'

/**
 * 表单项的通用逻辑
 * 用于封装的表单组件（FInputText、FDropdown等）
 */
export function useFormItem(props?: {
  validateEvent?: boolean
  modelValue?: any
}) {
  const formItem = inject(FormItemContextKey, null)
  const formContext = inject(FormContextKey, null)

  // 处理 blur 事件
  const handleBlur = () => {
    if (props?.validateEvent !== false && formItem) {
      formItem.validateField('blur')
    }
  }

  // 处理 change 事件
  const handleChange = () => {
    if (props?.validateEvent !== false && formItem) {
      formItem.validateField('change')
    }
  }

  // 是否禁用
  const isDisabled = computed(() => {
    return formContext?.disabled?.value || false
  })

  // 监听值变化，触发验证
  if (props?.modelValue !== undefined && formItem) {
    watch(
      () => props.modelValue,
      () => {
        // 值改变时触发 change 验证
        handleChange()
      }
    )
  }

  return {
    formItem,
    formContext,
    handleBlur,
    handleChange,
    isDisabled
  }
}

/**
 * 用于组件透传所有属性和事件
 * 合并原生事件和自定义验证事件
 */
export function useFormItemBindings(
  attrs: Record<string, any>,
  options?: {
    onBlur?: () => void
    onChange?: () => void
    validateEvent?: boolean
  }
) {
  const { formItem, formContext, handleBlur, handleChange, isDisabled } = useFormItem({
    validateEvent: options?.validateEvent
  })

  // 合并事件处理器
  const mergedAttrs = computed(() => {
    const result = { ...attrs }

    // 合并 blur 事件
    const originalBlur = attrs.onBlur || attrs['onBlur']
    result.onBlur = (...args: any[]) => {
      originalBlur?.(...args)
      options?.onBlur?.()
      handleBlur()
    }

    // 合并 change 事件（对于 dropdown 等组件）
    const originalChange = attrs.onChange || attrs['onChange'] || attrs['onUpdate:modelValue']
    if (originalChange) {
      result['onUpdate:modelValue'] = (...args: any[]) => {
        originalChange?.(...args)
        options?.onChange?.()
        handleChange()
      }
    }

    return result
  })

  return {
    formItem,
    formContext,
    mergedAttrs,
    isDisabled
  }
}