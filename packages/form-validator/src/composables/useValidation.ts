import { ref, unref } from 'vue'
import AsyncValidator from 'async-validator'
import type { RuleItem, Rules, ValidateFieldsError, ValidateError } from 'async-validator'
import type { TriggerType } from '../types'

// 定义 fields 的类型
type FieldsType = Record<string, ValidateError[]>

/**
 * 封装 async-validator 的使用
 * 提供表单验证的核心功能
 */
export function useValidation() {
  // 验证错误信息存储
  const errors = ref<Record<string, string>>({})

  /**
   * 获取字段对应的验证规则
   * @param rules 所有规则
   * @param prop 字段名
   * @param trigger 触发类型（可以是单个值或数组）
   */
  const getFieldRules = (
    rules: Rules,
    prop: string,
    trigger?: TriggerType
  ): RuleItem[] => {
    const fieldRules = rules[prop]
    if (!fieldRules) return []

    const rulesArray = Array.isArray(fieldRules) ? fieldRules : [fieldRules]

    // 如果指定了触发类型，则过滤出对应的规则
    if (trigger) {
      // 将 trigger 转换为数组形式以便统一处理
      const triggerArray = Array.isArray(trigger) ? trigger : [trigger]

      return rulesArray.filter(rule => {
        if (!rule.trigger) return true // 没有指定 trigger 的规则总是生效

        // 将 rule.trigger 也转换为数组形式
        const ruleTriggers = Array.isArray(rule.trigger) ? rule.trigger : [rule.trigger]

        // 检查是否有交集
        return triggerArray.some(t => ruleTriggers.includes(t))
      })
    }

    return rulesArray
  }

  /**
   * 验证单个字段
   * @param model 表单数据
   * @param rules 验证规则
   * @param prop 字段名
   * @param trigger 触发类型
   */
  const validateField = async (
    model: Record<string, any>,
    rules: Rules,
    prop: string,
    trigger?: TriggerType
  ): Promise<void> => {
    const fieldRules = getFieldRules(rules, prop, trigger)

    // 如果没有对应的规则，清除错误并返回
    if (!fieldRules || fieldRules.length === 0) {
      errors.value[prop] = ''
      return
    }

    // 创建只包含当前字段的验证器
    const validator = new AsyncValidator({ [prop]: fieldRules })

    try {
      await validator.validate(
        { [prop]: unref(model)[prop] },
        { firstFields: true }
      )
      // 验证通过，清除错误
      errors.value[prop] = ''
    } catch (error) {
      const validateErrors = error as ValidateFieldsError
      // 设置错误信息
      if (validateErrors?.fields) {
        const fields = validateErrors.fields as unknown as FieldsType
        const fieldErrors = fields[prop]
        if (fieldErrors && Array.isArray(fieldErrors) && fieldErrors.length > 0) {
          errors.value[prop] = fieldErrors[0]?.message || ''
        }
      }
      throw error
    }
  }

  /**
   * 验证整个表单
   * @param model 表单数据
   * @param rules 验证规则
   * @param fields 要验证的字段列表，不传则验证所有字段
   */
  const validate = async (
    model: Record<string, any>,
    rules: Rules,
    fields?: string[]
  ): Promise<Record<string, any>> => {
    // 如果指定了字段列表，只验证指定的字段
    let rulesToValidate = rules
    if (fields && fields.length > 0) {
      rulesToValidate = {}
      fields.forEach(field => {
        if (rules[field]) {
          rulesToValidate[field] = rules[field]
        }
      })
    }

    const validator = new AsyncValidator(rulesToValidate)

    try {
      await validator.validate(unref(model), { firstFields: true })
      // 验证通过，清除所有错误
      if (fields) {
        fields.forEach(field => {
          errors.value[field] = ''
        })
      } else {
        errors.value = {}
      }
      return unref(model)
    } catch (error) {
      const validateErrors = error as ValidateFieldsError
      // 设置错误信息
      if (validateErrors?.fields) {
        const fields = validateErrors.fields as unknown as FieldsType
        Object.keys(fields).forEach(key => {
          const fieldErrors = fields[key]
          if (fieldErrors && Array.isArray(fieldErrors) && fieldErrors.length > 0) {
            errors.value[key] = fieldErrors[0]?.message || ''
          }
        })
      }
      throw error
    }
  }

  /**
   * 清除验证错误
   * @param props 要清除的字段列表，不传则清除所有
   */
  const clearValidate = (props?: string | string[]) => {
    if (!props) {
      errors.value = {}
      return
    }

    const fields = Array.isArray(props) ? props : [props]
    fields.forEach(field => {
      delete errors.value[field]
    })
  }

  /**
   * 重置字段（清除验证并重置值）
   * @param model 表单数据
   * @param initialModel 初始数据
   * @param props 要重置的字段列表
   */
  const resetFields = (
    model: Record<string, any>,
    initialModel: Record<string, any>,
    props?: string | string[]
  ) => {
    if (!props) {
      // 重置所有字段
      Object.keys(model).forEach(key => {
        model[key] = initialModel[key]
      })
      errors.value = {}
    } else {
      const fields = Array.isArray(props) ? props : [props]
      fields.forEach(field => {
        model[field] = initialModel[field]
        delete errors.value[field]
      })
    }
  }

  return {
    errors,
    validateField,
    validate,
    clearValidate,
    resetFields,
    getFieldRules
  }
}