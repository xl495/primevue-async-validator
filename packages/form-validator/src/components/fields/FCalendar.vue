<template>
  <Calendar
    v-model="modelValue"
    v-bind="mergedAttrs"
    :disabled="isDisabled || !!$attrs.disabled"
  />
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import Calendar from 'primevue/calendar'
import { useFormItemBindings } from '../../composables/useFormItem'

// 定义 props
interface Props {
  modelValue?: Date | Date[] | null
  validateEvent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  validateEvent: true
})

// 定义 emits
const emit = defineEmits<{
  'update:modelValue': [value: Date | Date[] | null]
}>()

// 获取 attrs
const attrs = useAttrs()

// 使用表单项绑定
const { mergedAttrs, isDisabled } = useFormItemBindings(attrs, {
  validateEvent: props.validateEvent
})

// v-model 处理
const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val ?? null)
})
</script>