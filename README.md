# PrimeVue Form Validator Monorepo

一个基于 PrimeVue 的表单验证库 monorepo 项目，使用 async-validator 提供强大的表单验证功能，API 设计兼容 Element Plus 和 Ant Design Vue。

## 项目结构

这是一个使用 pnpm workspace 管理的 monorepo 项目，包含以下包：

```
packages/
├── form-validator/     # 核心库 (@primevue-form/validator)
├── example/           # 示例应用
└── docs/             # 文档站点 (VitePress)

## 特性

- 基于 PrimeVue 组件，无需修改源码
- 使用 async-validator 进行表单验证（与 Element Plus / Ant Design 一致）
- 完整的 TypeScript 支持
- 支持异步验证
- 支持自定义验证器
- 验证规则格式完全兼容 Element Plus / Ant Design Vue
- 轻量级实现，代码简洁易懂

## 安装

```bash
npm install async-validator
```

## 基本使用

```vue
<template>
  <Form ref="formRef" :model="formData" :rules="rules">
    <FormItem prop="username" label="用户名">
      <FInputText v-model="formData.username" />
    </FormItem>

    <FormItem prop="email" label="邮箱">
      <FInputText v-model="formData.email" type="email" />
    </FormItem>

    <FormItem prop="age" label="年龄">
      <FInputNumber v-model="formData.age" />
    </FormItem>

    <Button @click="handleSubmit">提交</Button>
  </Form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Form, FormItem, FInputText, FInputNumber } from './src'

const formRef = ref()
const formData = reactive({
  username: '',
  email: '',
  age: null
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', min: 1, max: 120, message: '年龄必须在 1-120 之间', trigger: 'change' }
  ]
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    console.log('验证通过，提交数据:', formData)
  } catch (error) {
    console.log('验证失败')
  }
}
</script>
```

## 组件说明

### Form 组件

表单容器组件，管理整个表单的验证状态。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| model | Object | - | 表单数据对象（必填） |
| rules | Object | - | 表单验证规则 |
| labelWidth | String | '100px' | 标签宽度 |
| labelPosition | String | 'right' | 标签位置（left/right/top） |
| disabled | Boolean | false | 是否禁用表单 |
| validateOnBlur | Boolean | true | 失焦时是否触发验证 |
| validateOnChange | Boolean | true | 值改变时是否触发验证 |

#### Methods

| 方法名 | 说明 | 参数 | 返回值 |
|--------|------|------|--------|
| validate | 验证整个表单 | - | Promise<Values> |
| validateField | 验证指定字段 | prop: string \| string[] | Promise<void> |
| resetFields | 重置表单 | - | void |
| clearValidate | 清除验证状态 | props?: string \| string[] | void |

### FormItem 组件

表单项容器组件，管理单个表单项的验证状态。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| prop | String | - | 字段名 |
| label | String | - | 标签文本 |
| labelWidth | String | - | 标签宽度（覆盖 Form 的设置） |
| rules | Object/Array | - | 字段验证规则 |
| required | Boolean | false | 是否必填（显示红色星号） |
| showMessage | Boolean | true | 是否显示错误信息 |
| error | String | - | 自定义错误信息 |

### 封装的表单组件

所有封装组件都完全透传 PrimeVue 原组件的 props 和 events。

- **FInputText**: 基于 PrimeVue InputText
- **FInputNumber**: 基于 PrimeVue InputNumber
- **FDropdown**: 基于 PrimeVue Dropdown
- **FCalendar**: 基于 PrimeVue Calendar
- **FTextarea**: 基于 PrimeVue Textarea

## 验证规则

验证规则格式完全兼容 Element Plus / Ant Design Vue，使用 async-validator 作为验证引擎。

### 基本规则

```javascript
const rules = {
  // 必填验证
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' }
  ],

  // 类型验证
  email: [
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],

  // 长度验证
  password: [
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],

  // 正则验证
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ]
}
```

### 自定义验证器

```javascript
// 同步验证器
const validatePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (value.length < 6) {
    callback(new Error('密码长度不能小于6位'))
  } else {
    callback()
  }
}

// 异步验证器
const checkUsername = async (rule, value, callback) => {
  if (!value) {
    return callback(new Error('用户名不能为空'))
  }

  // 模拟异步检查
  const exists = await checkUsernameExists(value)
  if (exists) {
    callback(new Error('用户名已存在'))
  } else {
    callback()
  }
}

const rules = {
  password: [
    { validator: validatePassword, trigger: 'blur' }
  ],
  username: [
    { validator: checkUsername, trigger: 'blur' }
  ]
}
```

### 支持的验证类型

- `string`: 字符串（默认）
- `number`: 数字
- `boolean`: 布尔值
- `method`: 函数
- `regexp`: 正则表达式
- `integer`: 整数
- `float`: 浮点数
- `array`: 数组
- `object`: 对象
- `enum`: 枚举
- `date`: 日期
- `url`: URL
- `hex`: 十六进制
- `email`: 邮箱
- `any`: 任意类型

### 触发时机

- `blur`: 失去焦点时触发
- `change`: 值改变时触发

## 高级用法

### 动态表单验证

```vue
<template>
  <Form ref="formRef" :model="formData" :rules="rules">
    <FormItem
      v-for="(item, index) in formData.items"
      :key="index"
      :prop="`items.${index}.value`"
      :label="`项目 ${index + 1}`"
      :rules="[
        { required: true, message: '请输入项目值', trigger: 'blur' }
      ]"
    >
      <FInputText v-model="item.value" />
    </FormItem>
  </Form>
</template>
```

### 表单联动验证

```vue
<script setup>
const validateConfirmPassword = (rule, value, callback) => {
  if (value !== formData.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}
</script>
```

### 部分字段验证

```javascript
// 只验证指定字段
await formRef.value.validateField(['username', 'email'])

// 清除指定字段的验证
formRef.value.clearValidate(['username'])
```

## Composables

### useValidation

提供表单验证的核心功能：

```javascript
import { useValidation } from './src'

const { errors, validate, validateField, clearValidate, resetFields } = useValidation()
```

### useFormItem

用于自定义表单组件的集成：

```javascript
import { useFormItem } from './src'

export default {
  setup() {
    const { formItem, handleBlur, handleChange } = useFormItem()

    return {
      handleBlur,
      handleChange
    }
  }
}
```

## 项目结构

```
src/
├── components/
│   ├── Form.vue          # 表单容器组件
│   ├── FormItem.vue      # 表单项组件
│   └── fields/           # 封装的表单字段组件
│       ├── FInputText.vue
│       ├── FInputNumber.vue
│       ├── FDropdown.vue
│       ├── FCalendar.vue
│       └── FTextarea.vue
├── composables/
│   ├── useFormItem.ts    # 表单项逻辑复用
│   └── useValidation.ts  # 验证逻辑封装
├── types/
│   └── index.ts          # TypeScript 类型定义
└── index.ts              # 导出入口
```

## 与其他表单库的对比

| 特性 | 本库 | Element Plus | Ant Design Vue |
|------|------|--------------|----------------|
| 基础组件库 | PrimeVue | Element Plus | Ant Design |
| 验证引擎 | async-validator | async-validator | async-validator |
| TypeScript | ✅ | ✅ | ✅ |
| 异步验证 | ✅ | ✅ | ✅ |
| 表单联动 | ✅ | ✅ | ✅ |
| 动态表单 | ✅ | ✅ | ✅ |
| 规则格式 | 兼容 | 原生 | 原生 |

## License

MIT