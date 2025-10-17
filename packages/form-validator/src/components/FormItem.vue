<template>
  <div
    class="p-form-item"
    :class="{
      'p-form-item--error': hasError,
      'p-form-item--required': isRequired,
      [`p-form-item--${formContext?.labelPosition?.value}`]: true
    }"
  >
    <!-- Label -->
    <label
      v-if="label || $slots.label"
      class="p-form-item__label"
      :style="labelStyle"
    >
      <slot name="label">
        {{ label }}
        <span v-if="isRequired" class="p-form-item__required">*</span>
      </slot>
    </label>

    <!-- Content -->
    <div class="p-form-item__content">
      <div class="p-form-item__control">
        <slot />
      </div>

      <!-- Error message -->
      <transition name="p-form-error">
        <div
          v-if="hasError && showMessage"
          class="p-form-item__error"
        >
          {{ errorMessage }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide, inject, onMounted, onUnmounted, watch } from 'vue'
import { FormContextKey, FormItemContextKey } from '../types'
import type { FormItemProps, FormItemContext, FormContext, TriggerType, FormItemRule } from '../types'

// 定义 props
const props = withDefaults(defineProps<FormItemProps>(), {
  showMessage: true
})

// 注入表单上下文
const formContext = inject<FormContext | undefined>(FormContextKey, undefined)

// 错误信息
const error = ref<string>('')

// 是否显示错误
const hasError = computed(() => !!error.value || !!props.error)

// 显示的错误信息
const errorMessage = computed(() => props.error || error.value)

// 是否必填
const isRequired = computed(() => {
  if (props.required) return true

  // 检查规则中是否有 required
  const rules = getMergedRules()
  if (!rules || rules.length === 0) return false

  return rules.some(rule => rule.required)
})

// Label 样式
const labelStyle = computed(() => {
  const width = props.labelWidth || formContext?.labelWidth?.value || '100px'
  const position = formContext?.labelPosition?.value || 'right'

  if (position === 'top') {
    return {}
  }

  return {
    width,
    textAlign: position as 'left' | 'right'
  }
})

/**
 * 获取合并后的验证规则
 */
const getMergedRules = (): FormItemRule[] => {
  const rules: FormItemRule[] = []

  // 从 Form 中获取规则
  if (formContext?.rules?.value && props.prop) {
    const formRules = formContext.rules.value[props.prop]
    if (formRules) {
      if (Array.isArray(formRules)) {
        rules.push(...formRules)
      } else {
        rules.push(formRules)
      }
    }
  }

  // 合并 FormItem 自己的规则
  if (props.rules) {
    if (Array.isArray(props.rules)) {
      rules.push(...props.rules)
    } else {
      rules.push(props.rules)
    }
  }

  return rules
}

/**
 * 验证字段
 */
const validateField = async (trigger?: TriggerType) => {
  if (!props.prop || !formContext) {
    return
  }

  await formContext.validateField(props.prop, trigger)
}

/**
 * 清除验证
 */
const clearValidate = () => {
  error.value = ''
}

/**
 * 重置字段
 */
const resetField = () => {
  clearValidate()
  // 如果有 prop，通知 Form 重置该字段的值
  if (props.prop && formContext?.model?.value) {
    // Form 组件会处理值的重置
  }
}

// FormItem 上下文
const formItemContext: FormItemContext = {
  prop: props.prop,
  error,
  validateField,
  clearValidate,
  resetField
}

// 提供 FormItem 上下文给子组件
provide(FormItemContextKey, formItemContext)

// 注册到 Form
onMounted(() => {
  if (formContext && props.prop) {
    formContext.registerField(formItemContext)
  }
})

// 注销
onUnmounted(() => {
  if (formContext && props.prop) {
    formContext.unregisterField(formItemContext)
  }
})

// 监听 prop 变化，重新注册
watch(
  () => props.prop,
  (newProp, oldProp) => {
    if (formContext) {
      if (oldProp) {
        formContext.unregisterField(formItemContext)
      }
      if (newProp) {
        formItemContext.prop = newProp
        formContext.registerField(formItemContext)
      }
    }
  }
)
</script>

<style scoped>
.p-form-item {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
}

/* Label 位置：top */
.p-form-item--top {
  flex-direction: column;
}

.p-form-item--top .p-form-item__label {
  width: 100% !important;
  text-align: left !important;
  margin-bottom: 0.5rem;
}

/* Label 位置：left/right */
.p-form-item--left,
.p-form-item--right {
  flex-direction: row;
}

.p-form-item__label {
  display: inline-block;
  padding-right: 12px;
  line-height: 2.25rem;
  font-size: 0.875rem;
  color: var(--surface-900);
  box-sizing: border-box;
  flex-shrink: 0;
}

.p-form-item__required {
  color: var(--red-500);
  margin-left: 4px;
}

.p-form-item__content {
  flex: 1;
  position: relative;
}

.p-form-item__control {
  position: relative;
  width: 100%;
}

/* 错误状态样式 */
.p-form-item--error .p-form-item__control :deep(.p-inputtext),
.p-form-item--error .p-form-item__control :deep(.p-inputnumber-input),
.p-form-item--error .p-form-item__control :deep(.p-dropdown),
.p-form-item--error .p-form-item__control :deep(.p-calendar),
.p-form-item--error .p-form-item__control :deep(.p-inputtextarea) {
  border-color: var(--red-500) !important;
}

.p-form-item--error .p-form-item__control :deep(.p-inputtext:focus),
.p-form-item--error .p-form-item__control :deep(.p-inputnumber-input:focus),
.p-form-item--error .p-form-item__control :deep(.p-dropdown:focus),
.p-form-item--error .p-form-item__control :deep(.p-calendar:focus),
.p-form-item--error .p-form-item__control :deep(.p-inputtextarea:focus) {
  box-shadow: 0 0 0 0.2rem rgba(var(--red-500-rgb), 0.25) !important;
}

/* 错误消息 */
.p-form-item__error {
  color: var(--red-500);
  font-size: 0.75rem;
  line-height: 1;
  padding-top: 0.25rem;
  position: absolute;
  top: 100%;
  left: 0;
}

/* 错误消息动画 */
.p-form-error-enter-active,
.p-form-error-leave-active {
  transition: opacity 0.3s ease;
}

.p-form-error-enter-from,
.p-form-error-leave-to {
  opacity: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .p-form-item {
    flex-direction: column;
  }

  .p-form-item__label {
    width: 100% !important;
    text-align: left !important;
    margin-bottom: 0.5rem;
  }
}
</style>