# 快速开始

## 概述

PrimeVue Form Validator 是一个基于 PrimeVue 和 async-validator 的表单验证库，提供了类似 Element Plus 和 Ant Design Vue 的表单验证体验。

## 特性

- 🚀 基于 PrimeVue 组件，无需修改源码
- ✅ 使用 async-validator 进行验证
- 📝 验证规则格式兼容 Element Plus / Ant Design Vue
- 🎯 完整的 TypeScript 支持
- ⚡ 支持同步和异步验证
- 🔧 提供 Composables 便于自定义扩展

## 安装

### 使用 pnpm

```bash
pnpm add @primevue-form/validator
```

### 使用 npm

```bash
npm install @primevue-form/validator
```

### 使用 yarn

```bash
yarn add @primevue-form/validator
```

## 基础用法

### 1. 导入组件

```vue
<script setup>
import { Form, FormItem, FInputText, FInputNumber } from '@primevue-form/validator'
</script>
```

### 2. 创建表单

```vue
<template>
  <Form ref="formRef" :model="formData" :rules="rules">
    <FormItem prop="username" label="用户名">
      <FInputText v-model="formData.username" />
    </FormItem>

    <FormItem prop="age" label="年龄">
      <FInputNumber v-model="formData.age" />
    </FormItem>

    <Button @click="handleSubmit">提交</Button>
  </Form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Form, FormItem, FInputText, FInputNumber } from '@primevue-form/validator'
import Button from 'primevue/button'

const formRef = ref()

const formData = reactive({
  username: '',
  age: null
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
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

## 项目结构

这是一个 monorepo 项目，包含以下包：

- **@primevue-form/validator** - 核心库
- **example** - 示例应用
- **docs** - 文档站点

## 开发

### 克隆项目

```bash
git clone https://github.com/yourusername/primevue-form-validator.git
cd primevue-form-validator
```

### 安装依赖

```bash
pnpm install
```

### 运行示例

```bash
pnpm dev
```

### 运行文档

```bash
pnpm dev:docs
```

### 构建库

```bash
pnpm build:lib
```

## 下一步

- [安装配置](./installation.md) - 详细的安装和配置说明
- [基础用法](./basic-usage.md) - 更多使用示例
- [验证规则](./validation-rules.md) - 所有支持的验证规则
- [API 文档](/api/form) - 完整的 API 参考