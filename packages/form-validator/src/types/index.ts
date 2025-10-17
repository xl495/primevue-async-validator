import type { Ref, InjectionKey } from 'vue'
import type { Rules, RuleItem, Values } from 'async-validator'

// 触发类型
export type TriggerType = 'blur' | 'change'

// 表单验证规则类型
export type FormRules = Rules

// 单个字段的验证规则
export type FormItemRule = RuleItem

// 表单项上下文
export interface FormItemContext {
  prop?: string
  error: Ref<string>
  validateField: (trigger?: TriggerType) => Promise<void>
  clearValidate: () => void
  resetField: () => void
}

// 表单上下文
export interface FormContext {
  model: Readonly<Ref<Record<string, any>>>
  rules?: Readonly<Ref<FormRules | undefined>>
  labelWidth?: Readonly<Ref<string | undefined>>
  labelPosition?: Readonly<Ref<'left' | 'right' | 'top' | undefined>>
  disabled?: Readonly<Ref<boolean | undefined>>
  registerField: (field: FormItemContext) => void
  unregisterField: (field: FormItemContext) => void
  validateField: (prop: string, trigger?: TriggerType) => Promise<void>
}

// 表单暴露的方法
export interface FormExpose {
  validate: () => Promise<Values>
  validateField: (prop: string | string[]) => Promise<void>
  resetFields: () => void
  clearValidate: (props?: string | string[]) => void
}

// provide/inject keys
export const FormContextKey: InjectionKey<FormContext> = Symbol('FormContext')
export const FormItemContextKey: InjectionKey<FormItemContext> = Symbol('FormItemContext')

// 表单组件 Props
export interface FormProps {
  model: Record<string, any>
  rules?: FormRules
  labelWidth?: string
  labelPosition?: 'left' | 'right' | 'top'
  disabled?: boolean
  validateOnBlur?: boolean
  validateOnChange?: boolean
}

// 表单项组件 Props
export interface FormItemProps {
  prop?: string
  label?: string
  labelWidth?: string
  rules?: FormItemRule | FormItemRule[]
  required?: boolean
  showMessage?: boolean
  error?: string
}